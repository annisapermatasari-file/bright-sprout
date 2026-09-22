"use client";

import { useState } from "react";
import Link from "next/link";

type PlanId = "child" | "family";
type Plan = { id: PlanId; name: string; amount: string; eyebrow: string; description: string; benefits: string[] };

const PLANS: Plan[] = [
  { id: "child", name: "Paket Anak", amount: "Rp35.000", eyebrow: "UNTUK 1 ANAK", description: "Aktivitas belajar seru untuk satu anak, dengan buddy hewan dan hadiah kecil setiap kali berhasil.", benefits: ["Minigame matematika, sains, dan kosa kata", "Buddy hewan dan achievement", "Satu profil anak"] },
  { id: "family", name: "Paket Keluarga", amount: "Rp100.000", eyebrow: "UNTUK KELUARGA", description: "Dapatkan seluruh fitur BrightSprout, dengan ringkasan progres orang tua dan satu profil anak tambahan untuk dipakai bersama.", benefits: ["Seluruh fitur BrightSprout", "Ringkasan progres untuk orang tua", "Tambah 1 profil anak lagi (total 2 anak)"] },
];

export function CheckoutSimulation() {
  const [planId, setPlanId] = useState<PlanId>("family");
  const [completed, setCompleted] = useState(false);
  const [email, setEmail] = useState("");
  const plan = PLANS.find((item) => item.id === planId) ?? PLANS[1];

  if (completed) {
    return <div className="checkout-success" role="status"><div className="checkout-success-icon" aria-hidden="true">🎉</div><span className="checkout-kicker">SIMULASI BERHASIL · {plan.name.toUpperCase()}</span><h2>Paketmu siap dicoba!</h2><p><strong>{plan.name} · {plan.amount}</strong> sudah dipilih untuk simulasi. Ini hanya demo checkout: tidak ada uang yang ditagihkan dan tidak ada transaksi nyata yang dibuat.</p><div className="checkout-success-actions"><Link href="/register" className="button button-primary">Buat akun keluarga <span>↗</span></Link><Link href="/" className="button button-quiet">Kembali ke halaman utama</Link></div></div>;
  }

  return <div><div className="plan-picker" role="radiogroup" aria-label="Pilih paket BrightSprout">{PLANS.map((item) => <button type="button" role="radio" aria-checked={planId === item.id} key={item.id} className={planId === item.id ? "plan-choice active" : "plan-choice"} onClick={() => setPlanId(item.id)}><span className="plan-choice-top"><span className="checkout-kicker">{item.eyebrow}</span><strong>{item.amount}</strong></span><b>{item.name}</b><small>{item.id === "child" ? "Satu anak saja" : "Untuk keluarga"}</small></button>)}</div><form className="checkout-card" onSubmit={(event) => { event.preventDefault(); setCompleted(true); }}><div className="checkout-card-head"><div><span className="checkout-kicker">{plan.eyebrow} · SIMULASI</span><h2>{plan.name}</h2></div><strong>{plan.amount}</strong></div><p className="checkout-description">{plan.description}</p><div className="checkout-benefits">{plan.benefits.map((benefit) => <span key={benefit}>✓ {benefit}</span>)}</div><label className="checkout-label" htmlFor="checkout-email">Email orang tua</label><input id="checkout-email" className="checkout-input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nama@contoh.com" required /><div className="checkout-disclaimer">Mode demo: tombol di bawah hanya mensimulasikan checkout. Jangan masukkan data kartu atau informasi pembayaran nyata.</div><button className="button button-primary checkout-submit" type="submit">Simulasikan checkout {plan.amount} <span>↗</span></button></form></div>;
}
