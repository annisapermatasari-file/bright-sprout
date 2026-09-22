import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyDokuNotificationSignature } from "@/lib/doku";

const NOTIFICATION_PATH = "/api/doku/notification";

// DOKU calls this after a payment settles (or fails/expires). Must read the
// raw body before any JSON parsing — the signature is a digest of the exact
// bytes DOKU sent, and re-serializing JSON can change whitespace/key order
// and break verification.
export async function POST(request: Request) {
  const rawBody = await request.text();

  const verified = verifyDokuNotificationSignature({
    signatureHeader: request.headers.get("signature"),
    clientIdHeader: request.headers.get("client-id"),
    requestIdHeader: request.headers.get("request-id"),
    requestTimestampHeader: request.headers.get("request-timestamp"),
    requestTarget: NOTIFICATION_PATH,
    rawBody,
  });

  if (!verified) {
    console.warn("[doku:notification] invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: { transaction?: { status?: string }; order?: { invoice_number?: string } } | null = null;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const invoiceNumber = payload?.order?.invoice_number;
  const status = payload?.transaction?.status;

  if (!invoiceNumber || !status) {
    // Acknowledge anyway so DOKU doesn't keep retrying a malformed-but-benign
    // notification; there's nothing actionable without these two fields.
    return NextResponse.json({ ok: true });
  }

  const mappedStatus =
    status === "SUCCESS" ? "SUCCESS" : status === "EXPIRED" ? "EXPIRED" : status === "FAILED" ? "FAILED" : null;

  if (mappedStatus) {
    // Idempotent: DOKU may redeliver the same notification more than once.
    await db.checkoutOrder.updateMany({
      where: { invoiceNumber },
      data: {
        status: mappedStatus,
        paidAt: mappedStatus === "SUCCESS" ? new Date() : undefined,
      },
    });
  }

  return NextResponse.json({ ok: true });
}
