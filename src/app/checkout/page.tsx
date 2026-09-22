import Link from "next/link";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export default function CheckoutPage() {
  return <main className="checkout-page"><div className="checkout-page-top"><Link href="/" className="brand" aria-label="Kembali ke halaman utama BrightSprout"><span className="brand-mark">✦</span><span>Bright<span>Sprout</span></span></Link><span className="checkout-secure-pill">🔒 PEMBAYARAN AMAN VIA DOKU</span></div><section className="checkout-layout"><div className="checkout-intro"><span className="parent-kicker">LANGKAH KECIL UNTUK KELUARGA</span><h1>Siapkan ruang belajar yang terasa seperti bermain.</h1><p>Pilih Paket Anak Rp35.000 untuk satu anak saja, atau Paket Keluarga Rp100.000 untuk mendapatkan seluruh fitur dan menambah satu profil anak lagi, sehingga totalnya bisa dipakai oleh dua anak. Pembayaran diproses langsung oleh DOKU — virtual account, QRIS, e-wallet, dan metode lainnya.</p><div className="checkout-note"><span aria-hidden="true">🔒</span><div><strong>Transaksi terenkripsi</strong><small>Data pembayaranmu diproses oleh DOKU, bukan disimpan di server BrightSprout.</small></div></div></div><CheckoutForm /></section></main>;
}
