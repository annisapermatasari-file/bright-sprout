import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { createDokuCheckout } from "@/lib/doku";
import { PLANS, isPlanId } from "@/lib/plans";

const bodySchema = z.object({
  planId: z.string().refine(isPlanId, "Paket tidak dikenal"),
  email: z.email(),
});

function appBaseUrl(request: Request): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL;
  if (configured) return configured.replace(/\/$/, "");
  return new URL(request.url).origin;
}

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Data checkout tidak valid." }, { status: 400 });
  }

  const plan = PLANS[parsed.data.planId];
  const invoiceNumber = `BS-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  try {
    const order = await db.checkoutOrder.create({
      data: {
        invoiceNumber,
        planId: plan.id,
        amount: plan.amount,
        customerEmail: parsed.data.email,
        status: "PENDING",
      },
    });

    const checkout = await createDokuCheckout({
      invoiceNumber,
      amount: plan.amount,
      customerEmail: parsed.data.email,
      itemName: `BrightSprout - ${plan.name}`,
      callbackUrlResult: `${appBaseUrl(request)}/checkout/return?invoice=${invoiceNumber}`,
    });

    await db.checkoutOrder.update({
      where: { id: order.id },
      data: { dokuPaymentUrl: checkout.paymentUrl, dokuTokenId: checkout.tokenId },
    });

    return NextResponse.json({ paymentUrl: checkout.paymentUrl });
  } catch (error) {
    console.error("[checkout:create]", error);
    return NextResponse.json(
      { error: "Gagal membuat pembayaran. Coba lagi sebentar lagi." },
      { status: 502 },
    );
  }
}
