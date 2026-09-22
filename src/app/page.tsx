import Link from "next/link";
import { auth } from "@/lib/auth";
import { PlayDemo, ProgressPreview, FeatureTabs, FAQAccordion } from "@/components/landing/PlayDemo";

const journey = [
  { number: "01", title: "Pilih misi", body: "Pelajaran singkat, satu tantangan ramah setiap kali.", color: "coral" },
  { number: "02", title: "Bermain sambil belajar", body: "Jawaban terasa seperti bermain, jadi percaya diri tumbuh perlahan.", color: "purple" },
  { number: "03", title: "Rayakan kemajuan", body: "Streak, bintang, dan tampilan sederhana untuk orang tua.", color: "teal" },
];

const highlights = [
  ["Tanpa iklan", "Ruang belajar yang fokus dan aman untuk anak."],
  ["Dibuat untuk tangan kecil", "Tombol besar dan pilihan sederhana nyaman di setiap layar."],
  ["Progres yang bisa dipercaya", "Lihat keterampilan yang dilatih, bukan hanya jumlah poin."],
];

export default async function HomePage() {
  const session = await auth();
  const primaryHref = session?.user ? "/parent" : "/register";
  const primaryLabel = session?.user ? "Buka dasbor saya" : "Mulai bermain gratis";

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="site-header">
        <Link href="/" className="brand" aria-label="BrightSprout home"><span className="brand-mark">✦</span><span>Bright<span>Sprout</span></span></Link>
        <nav aria-label="Navigasi utama"><Link href="#how-it-works">Cara kerja</Link><Link href="#grown-ups">Untuk orang tua</Link><Link href="#faq">FAQ</Link></nav>
        <div className="header-actions">{session?.user ? <Link href="/parent" className="text-link">Dasbor</Link> : <><Link href="/login" className="text-link">Masuk</Link><Link href="/register" className="button button-small">Coba sekarang<span>↗</span></Link></>}{session?.user ? <Link href={primaryHref} className="button button-small">Main sekarang<span>↗</span></Link> : null}</div>
      </header>

      <main id="main-content">
        <section className="hero-section">
          <div className="hero-copy">
            <div className="kicker"><span className="kicker-star">✦</span> Belajar yang terasa seperti petualangan kecil</div>
            <h1>Belajar angka.<br /><em>Tanpa drama.</em></h1>
            <p className="hero-subtitle">BrightSprout memberi anak soal pendek yang terasa seperti permainan. Orang tua bisa melihat apa yang sudah dicoba dan apa yang perlu diulang.</p>
            <div className="hero-actions"><Link href={primaryHref} className="button button-primary">{primaryLabel}<span>↗</span></Link><Link href="#how-it-works" className="button button-quiet">Lihat cara kerja <span>↓</span></Link></div>
            <div className="hero-pricing">
              <Link href="/checkout" className="hero-pricing-card">
                <span className="hero-pricing-name">Paket Anak</span>
                <strong className="hero-pricing-amount">Rp35.000</strong>
                <span className="hero-pricing-desc">Untuk 1 anak</span>
              </Link>
              <Link href="/checkout" className="hero-pricing-card featured">
                <span className="hero-pricing-badge">Paling laris</span>
                <span className="hero-pricing-name">Paket Keluarga</span>
                <strong className="hero-pricing-amount">Rp100.000</strong>
                <span className="hero-pricing-desc">Untuk keluarga · 2 anak</span>
              </Link>
            </div>
            <div className="trust-row"><div className="mini-avatars"><span>🧒</span><span>👧</span><span>🧑</span></div><span>Dipakai oleh keluarga yang suka belajar</span><span className="trust-stars">★★★★★</span></div>
          </div>
          <div className="hero-visual"><div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" /><div className="hero-blob"><div className="sun-face"><span className="eye left" /><span className="eye right" /><span className="smile" /></div><span className="blob-leaf leaf-one">✦</span><span className="blob-leaf leaf-two">✳</span></div><div className="floating-note note-one"><span>✦</span><b>+10 XP</b><small>Hebat!</small></div><div className="floating-note note-two"><span>🔥</span><b>Streak 3 hari</b><small>Lanjutkan!</small></div><div className="floating-note note-three"><span>☼</span><b>Level 3</b><small>Pemikir cerah</small></div></div>
        </section>

        <section className="demo-section" id="how-it-works"><div className="section-label">Intip ruang bermain <span>↘</span></div><div className="demo-grid"><div><h2>Satu jawaban benar.<br /><em>Satu tos kecil.</em></h2><p className="section-copy">Soalnya singkat. Tombolnya besar. Anak bisa mencoba lagi tanpa merasa sedang diuji.</p><div className="demo-legend"><span><i className="legend-dot orange" /> Mode bermain anak</span><span><i className="legend-dot yellow" /> Insight orang tua</span></div></div><PlayDemo /><ProgressPreview /></div></section>

        <section className="relatable-section"><div className="relatable-image"><img src="https://api.memegen.link/images/drake/orang_tua_menyuruh_satu_soal_lagi/anak_minta_satu_level_lagi.png?font=notosans&width=720" alt="Meme ringan tentang orang tua yang meminta satu soal lagi dan anak yang meminta satu level lagi" /></div><div><div className="section-label">Momen yang familiar <span>↗</span></div><h2>“Satu soal lagi.”</h2><p>Orang tua menyebutnya latihan. Anak menyebutnya “aku mau naik level”. Kami memilih tidak ikut berdebat.</p></div></section>

        <section className="journey-section"><div className="section-label">Ritme BrightSprout <span>✦</span></div><div className="journey-heading"><h2>Cara yang lebih ringan untuk membangun <em>awal yang kuat.</em></h2><p>Dirancang mengikuti cara anak belajar: dengan pengulangan, dukungan, dan kejutan kecil yang menyenangkan.</p></div><div className="journey-grid">{journey.map((item) => <div className={`journey-card ${item.color}`} key={item.number}><span className="journey-number">{item.number}</span><div className="journey-icon">{item.color === "coral" ? "✦" : item.color === "purple" ? "◒" : "✳"}</div><h3>{item.title}</h3><p>{item.body}</p><span className="card-arrow">↗</span></div>)}</div></section>

        <section className="split-section" id="grown-ups"><div className="split-art"><div className="art-card art-card-main"><div className="art-header"><span>SENIN, 20 MEI</span><span>•••</span></div><div className="art-title"><span>🌱</span><div><b>Taman belajar Maya</b><small>Tumbuh dengan baik</small></div></div><div className="art-chart"><div className="chart-line" /><span className="chart-label one">80%</span><span className="chart-label two">55%</span><span className="chart-label three">30%</span></div><div className="art-pills"><span>✦ Berhitung</span><span>◒ Angka</span></div></div><div className="art-sticker">You’re doing<br /><strong>great!</strong> ✦</div><div className="art-sparkle">✳</div></div><div className="split-copy"><div className="section-label">Untuk orang tua <span>↘</span></div><h2>Lihat seluruh cerita,<br /><em>bukan hanya nilainya.</em></h2><p>Progres harus terasa berguna, bukan membuat kewalahan. BrightSprout menunjukkan apa yang sudah dilatih, bagian yang mulai dikuasai, dan apa yang bisa dicoba berikutnya.</p><ul className="check-list"><li><span>✓</span><div><b>Ringkasan per keterampilan</b><small>Lihat perkembangan berhitung, angka, dan matematika dasar.</small></div></li><li><span>✓</span><div><b>Streak yang layak dirayakan</b><small>Perhatikan kebiasaan belajar tanpa mengubah bermain menjadi perlombaan.</small></div></li><li><span>✓</span><div><b>Privat sejak awal</b><small>Tanpa iklan, profil publik, atau gangguan.</small></div></li></ul><Link href={primaryHref} className="button button-primary">{session?.user ? "Lihat dasbor" : "Buat akun gratis"}<span>↗</span></Link></div></section>

        <section className="feature-section"><FeatureTabs /><div className="highlight-grid">{highlights.map(([title, body], index) => <div className="highlight" key={title}><span className={`highlight-icon icon-${index}`}>{index === 0 ? "✦" : index === 1 ? "↗" : "✓"}</span><div><h3>{title}</h3><p>{body}</p></div></div>)}</div></section>

        <section className="cta-section"><span className="cta-star">✦</span><div className="section-label">Siap saat kamu siap <span>↗</span></div><h2>Mari tumbuhkan rasa suka belajar.</h2><p>Mulai dari satu misi kecil hari ini. Sedikit demi sedikit akan terasa.</p><Link href={primaryHref} className="button button-light">{primaryLabel}<span>↗</span></Link><span className="cta-doodle doodle-left">✳</span><span className="cta-doodle doodle-right">◒</span></section>

        <section className="faq-section" id="faq"><div className="section-label">Beberapa pertanyaan umum <span>↘</span></div><div className="faq-layout"><h2>Ingin tahu<br /><em>cara kerjanya?</em></h2><FAQAccordion /></div></section>
      </main>

      <footer className="site-footer"><Link href="/" className="brand"><span className="brand-mark">✦</span><span>Bright<span>Sprout</span></span></Link><span>Dibuat untuk penjelajah kecil dan orang-orang yang selalu mendukungnya.</span><div><Link href="#faq">Bantuan</Link><Link href="/login">Masuk</Link></div></footer>
    </div>
  );
}
