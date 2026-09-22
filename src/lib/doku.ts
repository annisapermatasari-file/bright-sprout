import "server-only";
import crypto from "node:crypto";

// DOKU Checkout (Non-SNAP) integration.
// Docs: https://developers.doku.com/accept-payments/doku-checkout/integration-guide/backend-integration
// Signature: https://developers.doku.com/get-started-with-doku-api/signature-component/non-snap

const DOKU_CLIENT_ID = process.env.DOKU_CLIENT_ID;
const DOKU_SECRET_KEY = process.env.DOKU_SECRET_KEY;
const DOKU_IS_PRODUCTION = process.env.DOKU_IS_PRODUCTION === "true";

const DOKU_BASE_URL = DOKU_IS_PRODUCTION
  ? "https://api.doku.com"
  : "https://api-sandbox.doku.com";

const CHECKOUT_PATH = "/checkout/v1/payment";

function requireDokuConfig() {
  if (!DOKU_CLIENT_ID || !DOKU_SECRET_KEY) {
    throw new Error(
      "DOKU is not configured. Set DOKU_CLIENT_ID and DOKU_SECRET_KEY in your environment variables.",
    );
  }
  return { clientId: DOKU_CLIENT_ID, secretKey: DOKU_SECRET_KEY };
}

/** base64(SHA-256(rawBody)) — DOKU's "Digest" header, required for any POST request. */
export function generateDigest(rawBody: string): string {
  return crypto.createHash("sha256").update(rawBody, "utf8").digest("base64");
}

/**
 * HMAC-SHA256 signature over the canonical component string DOKU expects.
 * `digest` should be omitted for requests with no body (GET/DELETE).
 */
export function generateSignature(params: {
  clientId: string;
  requestId: string;
  requestTimestamp: string;
  requestTarget: string;
  digest?: string;
  secretKey: string;
}): string {
  const { clientId, requestId, requestTimestamp, requestTarget, digest, secretKey } = params;
  const lines = [
    `Client-Id:${clientId}`,
    `Request-Id:${requestId}`,
    `Request-Timestamp:${requestTimestamp}`,
    `Request-Target:${requestTarget}`,
  ];
  if (digest) lines.push(`Digest:${digest}`);
  const component = lines.join("\n");
  const raw = crypto.createHmac("sha256", secretKey).update(component, "utf8").digest("base64");
  return `HMACSHA256=${raw}`;
}

/** ISO8601 UTC timestamp in the format DOKU expects, e.g. 2026-09-22T06:00:00Z */
function dokuTimestamp(date = new Date()): string {
  return date.toISOString().replace(/\.\d+Z$/, "Z");
}

export type DokuCheckoutInput = {
  invoiceNumber: string;
  amount: number;
  customerEmail: string;
  itemName: string;
  /** Where DOKU sends the shopper back after the payment result is known. */
  callbackUrlResult: string;
};

export type DokuCheckoutResult = {
  paymentUrl: string;
  tokenId: string;
  expiredDate: string;
};

/**
 * Calls DOKU's "Generate Checkout Invoice" endpoint and returns the hosted
 * payment page URL to redirect the customer to. Throws on any non-success
 * response so the caller can show a real error instead of a fake success.
 */
export async function createDokuCheckout(input: DokuCheckoutInput): Promise<DokuCheckoutResult> {
  const { clientId, secretKey } = requireDokuConfig();

  const body = {
    order: {
      amount: input.amount,
      invoice_number: input.invoiceNumber,
      currency: "IDR",
      callback_url: input.callbackUrlResult,
      callback_url_result: input.callbackUrlResult,
      language: "ID",
      auto_redirect: true,
      line_items: [
        {
          id: input.invoiceNumber,
          name: input.itemName,
          quantity: 1,
          price: input.amount,
          category: "digital-content",
        },
      ],
    },
    payment: {
      payment_due_date: 60,
    },
    customer: {
      email: input.customerEmail,
    },
  };

  const rawBody = JSON.stringify(body);
  const requestId = crypto.randomUUID();
  const requestTimestamp = dokuTimestamp();
  const digest = generateDigest(rawBody);
  const signature = generateSignature({
    clientId,
    requestId,
    requestTimestamp,
    requestTarget: CHECKOUT_PATH,
    digest,
    secretKey,
  });

  const response = await fetch(`${DOKU_BASE_URL}${CHECKOUT_PATH}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Client-Id": clientId,
      "Request-Id": requestId,
      "Request-Timestamp": requestTimestamp,
      Signature: signature,
    },
    body: rawBody,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.response?.payment?.url) {
    const messages = data?.error_messages ?? data?.message ?? [`HTTP ${response.status}`];
    throw new Error(`DOKU checkout failed: ${JSON.stringify(messages)}`);
  }

  return {
    paymentUrl: data.response.payment.url,
    tokenId: data.response.payment.token_id,
    expiredDate: data.response.payment.expired_date,
  };
}

/**
 * Calls DOKU's Check Status API for a given invoice number. Used on the
 * checkout return page so the shown status is authoritative even if the
 * async HTTP Notification hasn't landed yet.
 */
export async function checkDokuOrderStatus(invoiceNumber: string): Promise<string | null> {
  const { clientId, secretKey } = requireDokuConfig();
  const path = `/orders/v1/status/${invoiceNumber}`;
  const requestId = crypto.randomUUID();
  const requestTimestamp = dokuTimestamp();
  const signature = generateSignature({
    clientId,
    requestId,
    requestTimestamp,
    requestTarget: path,
    secretKey,
  });

  const response = await fetch(`${DOKU_BASE_URL}${path}`, {
    method: "GET",
    headers: {
      "Client-Id": clientId,
      "Request-Id": requestId,
      "Request-Timestamp": requestTimestamp,
      Signature: signature,
    },
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) return null;
  return data?.transaction?.status ?? null;
}

/**
 * Verifies the Signature header on an incoming DOKU HTTP Notification.
 * `rawBody` MUST be the exact, unparsed bytes DOKU sent (read via
 * `await request.text()` before any JSON parsing) or the digest won't match.
 */
export function verifyDokuNotificationSignature(params: {
  signatureHeader: string | null;
  clientIdHeader: string | null;
  requestIdHeader: string | null;
  requestTimestampHeader: string | null;
  requestTarget: string;
  rawBody: string;
}): boolean {
  const { secretKey, clientId } = requireDokuConfig();
  const { signatureHeader, clientIdHeader, requestIdHeader, requestTimestampHeader, requestTarget, rawBody } = params;

  if (!signatureHeader || !clientIdHeader || !requestIdHeader || !requestTimestampHeader) return false;
  if (clientIdHeader !== clientId) return false;

  const digest = generateDigest(rawBody);
  const expected = generateSignature({
    clientId: clientIdHeader,
    requestId: requestIdHeader,
    requestTimestamp: requestTimestampHeader,
    requestTarget,
    digest,
    secretKey,
  });

  const a = Buffer.from(expected);
  const b = Buffer.from(signatureHeader);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
