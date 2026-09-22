import Link from "next/link";
import { CheckoutSimulation } from "@/components/checkout/CheckoutSimulation";

export default function CheckoutPage() {
  return <main className="checkout-page"><div className="checkout-page-top"><Link href="/" className="brand" aria-label="Kembali ke halaman utama BrightSprout"><span className="brand-mark">✦</span><span>Bright<span>Sprout</span></span></Link><span className="checkout-demo-pill">MODE DEMO · TANPA TAGIHAN</span></div><section className="checkout-layout"><div className="checkout-intro"><span className="parent-kicker">LANGKAH KECIL UNTUK KELUARGA</span><h1>Siapkan ruang belajar yang terasa seperti bermain.</h1><p>Pilih Paket Anak Rp35.000 untuk satu anak saja, atau Paket Keluarga Rp100.000 untuk mendapatkan seluruh fitur dan menambah satu profil anak lagi, sehingga totalnya bisa dipakai oleh dua anak. Halaman ini adalah simulasi internal dan tidak terhubung ke payment gateway.</p><div className="checkout-note"><span aria-hidden="true">🔒</span><div><strong>Aman untuk dicoba</strong><small>Tidak ada kartu, saldo, atau pembayaran nyata yang diproses.</small></div></div></div><CheckoutSimulation /></section></main>;
}
