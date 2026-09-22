import Link from "next/link";
import { db } from "@/lib/db";
import { checkDokuOrderStatus } from "@/lib/doku";
import { PLANS, isPlanId } from "@/lib/plans";

export default async function CheckoutReturnPage({
  searchParams,
}: {
  searchParams: Promise<{ invoice?: string }>;
}) {
  const { invoice } = await searchParams;
  const order = invoice ? await db.checkoutOrder.findUnique({ where: { invoiceNumber: invoice } }) : null;

  if (!order) {
    return (
      <main className="checkout-page">
        <div className="checkout-return checkout-return-error">
          <span className="checkout-kicker">TIDAK DITEMUKAN</span>
          <h1>Kami tidak menemukan transaksi ini.</h1>
          <p>Kalau kamu baru saja membayar, coba cek email untuk bukti pembayaran, atau hubungi kami.</p>
          <Link href="/checkout" className="button button-primary">Kembali ke halaman pembayaran <span>↗</span></Link>
        </div>
      </main>
    );
  }

  // The async HTTP Notification from DOKU may not have arrived yet — poll
  // DOKU's own Check Status API so this page always shows the real status.
  let status = order.status;
  if (status === "PENDING") {
    const liveStatus = await checkDokuOrderStatus(order.invoiceNumber).catch(() => null);
    if (liveStatus === "SUCCESS" || liveStatus === "FAILED" || liveStatus === "EXPIRED") {
      await db.checkoutOrder.update({
        where: { id: order.id },
        data: { status: liveStatus, paidAt: liveStatus === "SUCCESS" ? new Date() : undefined },
      });
      status = liveStatus;
    }
  }

  const orderPlanId = order.planId;
  const plan: (typeof PLANS)[keyof typeof PLANS] | null = isPlanId(orderPlanId) ? PLANS[orderPlanId] : null;

  if (status === "SUCCESS") {
    return (
      <main className="checkout-page">
        <div className="checkout-success" role="status">
          <div className="checkout-success-icon" aria-hidden="true">🎉</div>
          <span className="checkout-kicker">PEMBAYARAN BERHASIL · {(plan?.name ?? order.planId).toUpperCase()}</span>
          <h2>Terima kasih! Pembayaranmu sudah kami terima.</h2>
          <p>
            <strong>{plan?.name ?? order.planId} · {plan?.amountLabel ?? order.amount}</strong> untuk {order.customerEmail} sudah lunas.
            Sekarang buat akun keluarga untuk mulai bermain.
          </p>
          <div className="checkout-success-actions">
            <Link href="/register" className="button button-primary">Buat akun keluarga <span>↗</span></Link>
            <Link href="/" className="button button-quiet">Kembali ke halaman utama</Link>
          </div>
        </div>
      </main>
    );
  }

  if (status === "PENDING") {
    return (
      <main className="checkout-page">
        <div className="checkout-return">
          <span className="checkout-kicker">MENUNGGU PEMBAYARAN</span>
          <h1>Pembayaran belum kami terima.</h1>
          <p>Kalau kamu memilih transfer/virtual account, prosesnya bisa perlu waktu. Halaman ini akan menampilkan status terbaru saat kamu memuat ulang.</p>
          <Link href={`/checkout/return?invoice=${order.invoiceNumber}`} className="button button-primary">Cek status lagi <span>↗</span></Link>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <div className="checkout-return checkout-return-error">
        <span className="checkout-kicker">{status === "EXPIRED" ? "KEDALUWARSA" : "PEMBAYARAN GAGAL"}</span>
        <h1>{status === "EXPIRED" ? "Waktu pembayaran sudah habis." : "Pembayaran tidak berhasil."}</h1>
        <p>Tidak ada uang yang terpotong untuk transaksi ini. Kamu bisa coba lagi kapan saja.</p>
        <Link href="/checkout" className="button button-primary">Coba lagi <span>↗</span></Link>
      </div>
    </main>
  );
}
