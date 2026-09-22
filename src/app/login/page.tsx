import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { callbackUrl, registered } = await searchParams;
  return <main className="auth-shell"><section className="auth-art auth-art-login"><Link href="/" className="brand auth-brand"><span className="brand-mark">✦</span><span>Bright<span>Sprout</span></span></Link><div className="auth-art-copy"><span className="parent-kicker">SENANG BERTEMU LAGI · ✦</span><h1>Langkah kecil.<br /><em>Kilau besar.</em></h1><p>Petualangan belajar kecilmu berikutnya sudah menunggu.</p></div><span className="auth-art-doodle">◒</span></section><section className="auth-form-panel"><div className="auth-form-inner"><div className="auth-mobile-brand"><Link href="/" className="brand"><span className="brand-mark">✦</span><span>Bright<span>Sprout</span></span></Link></div><span className="parent-kicker">RUANG KELUARGA</span><h2>Masuk ke BrightSprout</h2><p className="auth-intro">Lanjutkan kegiatan belajar dari tempat terakhir.</p>{registered ? <p className="auth-success">✓ Akun berhasil dibuat. Silakan masuk.</p> : null}<LoginForm callbackUrl={typeof callbackUrl === "string" ? callbackUrl : undefined} /><p className="auth-switch">Belum punya akun? <Link href="/register">Daftar gratis ↗</Link></p></div></section></main>;
}
