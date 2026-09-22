"use client";

import { useState } from "react";
import Link from "next/link";

type Language = "id" | "en";

const COPY: Record<Language, {
  kicker: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  primaryLabelLoggedIn: string;
  primaryLabelGuest: string;
  secondaryAction: string;
  planChildName: string;
  planChildDesc: string;
  planFamilyBadge: string;
  planFamilyName: string;
  planFamilyDesc: string;
  trust: string;
}> = {
  id: {
    kicker: "Belajar yang terasa seperti petualangan kecil",
    titleLine1: "Belajar angka.",
    titleLine2: "Tanpa drama.",
    subtitle: "BrightSprout memberi anak soal pendek yang terasa seperti permainan. Orang tua bisa melihat apa yang sudah dicoba dan apa yang perlu diulang.",
    primaryLabelLoggedIn: "Buka dasbor saya",
    primaryLabelGuest: "Mulai bermain gratis",
    secondaryAction: "Lihat cara kerja",
    planChildName: "Paket Anak",
    planChildDesc: "Untuk 1 anak",
    planFamilyBadge: "Paling laris",
    planFamilyName: "Paket Keluarga",
    planFamilyDesc: "Untuk keluarga · 2 anak",
    trust: "Dipakai oleh keluarga yang suka belajar",
  },
  en: {
    kicker: "Learning that feels like a tiny adventure",
    titleLine1: "Learn numbers.",
    titleLine2: "No drama.",
    subtitle: "BrightSprout gives kids short questions that feel like play. Parents can see what's been tried and what needs another round.",
    primaryLabelLoggedIn: "Open my dashboard",
    primaryLabelGuest: "Start playing for free",
    secondaryAction: "See how it works",
    planChildName: "Child Plan",
    planChildDesc: "For 1 child",
    planFamilyBadge: "Most popular",
    planFamilyName: "Family Plan",
    planFamilyDesc: "For families · 2 children",
    trust: "Loved by families who enjoy learning together",
  },
};

export function HeroCopy({ primaryHref, loggedIn }: { primaryHref: string; loggedIn: boolean }) {
  const [language, setLanguage] = useState<Language>("id");
  const t = COPY[language];
  const primaryLabel = loggedIn ? t.primaryLabelLoggedIn : t.primaryLabelGuest;

  return (
    <div className="hero-copy">
      <div className="hero-lang-toggle language-toggle" aria-label={language === "id" ? "Pilih bahasa" : "Choose language"}>
        <button type="button" className={language === "id" ? "active" : ""} onClick={() => setLanguage("id")}>ID</button>
        <button type="button" className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")}>EN</button>
      </div>
      <div className="kicker"><span className="kicker-star">✦</span> {t.kicker}</div>
      <h1>{t.titleLine1}<br /><em>{t.titleLine2}</em></h1>
      <p className="hero-subtitle">{t.subtitle}</p>
      <div className="hero-actions">
        <Link href={primaryHref} className="button button-primary">{primaryLabel}<span>↗</span></Link>
        <Link href="#how-it-works" className="button button-quiet">{t.secondaryAction} <span>↓</span></Link>
      </div>
      <div className="hero-pricing">
        <Link href="/checkout" className="hero-pricing-card">
          <span className="hero-pricing-name">{t.planChildName}</span>
          <strong className="hero-pricing-amount">Rp35.000</strong>
          <span className="hero-pricing-desc">{t.planChildDesc}</span>
        </Link>
        <Link href="/checkout" className="hero-pricing-card featured">
          <span className="hero-pricing-badge">{t.planFamilyBadge}</span>
          <span className="hero-pricing-name">{t.planFamilyName}</span>
          <strong className="hero-pricing-amount">Rp100.000</strong>
          <span className="hero-pricing-desc">{t.planFamilyDesc}</span>
        </Link>
      </div>
      <div className="trust-row"><div className="mini-avatars"><span>🧒</span><span>👧</span><span>🧑</span></div><span>{t.trust}</span><span className="trust-stars">★★★★★</span></div>
    </div>
  );
}
