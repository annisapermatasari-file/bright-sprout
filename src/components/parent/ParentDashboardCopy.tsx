"use client";

import { useState } from "react";
import Link from "next/link";
import { logout } from "@/server/actions/auth";
import { setActiveChild } from "@/server/actions/children";
import { Button } from "@/components/ui/Button";
import { ChildCard } from "@/components/child/ChildCard";

type Language = "id" | "en";
type ChildRow = { id: string; displayName: string; avatarUrl: string | null; ageBand: string | null };

const COPY: Record<Language, {
  kicker1: string;
  greeting: (name: string) => string;
  subtitle: string;
  signOut: string;
  kicker2: string;
  readyTitle: (name: string) => string;
  seedTitle: string;
  readySubtitle: string;
  seedSubtitle: string;
  kicker3: string;
  sectionTitle: string;
  manage: string;
  emptyTitle: string;
  emptyBody: string;
  addProfile: string;
  playMode: string;
  viewProgress: string;
  selected: string;
  choose: string;
  openPlayMode: string;
  tinySteps: string;
  trust1Title: string;
  trust1Body: string;
  trust2Title: string;
  trust2Body: string;
  trust3Title: string;
  trust3Body: string;
  classroomTools: string;
  adminTools: string;
}> = {
  id: {
    kicker1: "RUANG KELUARGA · ✦",
    greeting: (name) => `Selamat pagi, ${name}.`,
    subtitle: "Ini pantauan santai kebun belajar keluargamu.",
    signOut: "Keluar",
    kicker2: "LANGKAH KECIL BERIKUTNYA",
    readyTitle: (name) => `${name} siap untuk bermain.`,
    seedTitle: "Tanam benih belajar pertamamu.",
    readySubtitle: "Pilih anak untuk lihat progresnya, atau langsung lanjut ke petualangan seru.",
    seedSubtitle: "Tambah profil anak dan mulai perjalanan belajar khusus untuknya.",
    kicker3: "PARA PEMBELAJAR KECILMU",
    sectionTitle: "Profil & progres",
    manage: "Kelola profil",
    emptyTitle: "Belum ada profil",
    emptyBody: "Tambah anak pertamamu untuk mulai ruang belajar pribadi.",
    addProfile: "Tambah profil",
    playMode: "● MODE BERMAIN",
    viewProgress: "Lihat progres",
    selected: "Terpilih",
    choose: "Pilih",
    openPlayMode: "Buka mode bermain",
    tinySteps: "Belajar lebih baik dengan langkah kecil yang menyenangkan.",
    trust1Title: "Dirancang untuk bermain",
    trust1Body: "Aktivitas singkat membantu anak percaya diri tanpa tekanan.",
    trust2Title: "Privat secara default",
    trust2Body: "Progres anakmu tetap ada di dalam ruang keluargamu.",
    trust3Title: "Berguna, tidak berisik",
    trust3Body: "Lihat langkah berikutnya yang membantu, bukan tumpukan angka.",
    classroomTools: "Buka alat kelas ↗",
    adminTools: "Buka alat admin ↗",
  },
  en: {
    kicker1: "FAMILY SPACE · ✦",
    greeting: (name) => `Good morning, ${name}.`,
    subtitle: "Here's a gentle look at your family's learning garden.",
    signOut: "Sign out",
    kicker2: "YOUR NEXT SMALL STEP",
    readyTitle: (name) => `${name} is ready to play.`,
    seedTitle: "Plant your first learning seed.",
    readySubtitle: "Choose a child to see their progress, or jump straight back into a playful quest.",
    seedSubtitle: "Add a child profile and start a learning journey made just for them.",
    kicker3: "YOUR LITTLE LEARNERS",
    sectionTitle: "Profiles & progress",
    manage: "Manage profiles",
    emptyTitle: "No profiles yet",
    emptyBody: "Add your first child to begin a private learning space.",
    addProfile: "Add a profile",
    playMode: "● PLAY MODE",
    viewProgress: "View progress",
    selected: "Selected",
    choose: "Choose",
    openPlayMode: "Open play mode",
    tinySteps: "Learning is better in tiny, happy steps.",
    trust1Title: "Playful by design",
    trust1Body: "Short activities help kids build confidence without pressure.",
    trust2Title: "Private by default",
    trust2Body: "Your child's progress stays inside your family space.",
    trust3Title: "Useful, not noisy",
    trust3Body: "See the next helpful step, not a wall of numbers.",
    classroomTools: "Open classroom tools ↗",
    adminTools: "Open admin tools ↗",
  },
};

export function ParentDashboardCopy({
  userName,
  userEmail,
  childList,
  activeChildId,
  isAdmin,
  canTeach,
}: {
  userName: string;
  userEmail: string;
  childList: ChildRow[];
  activeChildId: string | undefined;
  isAdmin: boolean;
  canTeach: boolean;
}) {
  const [language, setLanguage] = useState<Language>("id");
  const t = COPY[language];
  const activeChild = childList.find((child) => child.id === activeChildId) ?? childList[0];

  return (
    <>
      <div className="parent-topline">
        <div>
          <div className="hero-kicker-row">
            <span className="parent-kicker">{t.kicker1}</span>
            <div className="hero-lang-toggle language-toggle" aria-label={language === "id" ? "Pilih bahasa" : "Choose language"}>
              <button type="button" className={language === "id" ? "active" : ""} onClick={() => setLanguage("id")}>ID</button>
              <button type="button" className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")}>EN</button>
            </div>
          </div>
          <h1>{t.greeting(userName)}</h1>
          <p>{t.subtitle}</p>
        </div>
        <div className="parent-account">
          <span>{userEmail}</span>
          <form action={logout}><Button type="submit" variant="ghost">{t.signOut}</Button></form>
        </div>
      </div>

      <section className="parent-welcome">
        <div>
          <span className="parent-kicker">{t.kicker2}</span>
          <h2>{activeChild ? t.readyTitle(activeChild.displayName) : t.seedTitle}</h2>
          <p>{activeChild ? t.readySubtitle : t.seedSubtitle}</p>
        </div>
        <span className="parent-welcome-art">🌱</span>
      </section>

      <section className="parent-section">
        <div className="parent-section-heading">
          <div><span className="parent-kicker">{t.kicker3}</span><h2>{t.sectionTitle}</h2></div>
          <Link href="/parent/children" className="parent-outline-button">{t.manage} <span>↗</span></Link>
        </div>
        {childList.length === 0 ? (
          <div className="parent-empty">
            <span>🌱</span>
            <div><b>{t.emptyTitle}</b><p>{t.emptyBody}</p></div>
            <Link href="/parent/children" className="parent-dark-button">{t.addProfile} <span>↗</span></Link>
          </div>
        ) : (
          <div className="parent-child-grid">
            {childList.map((child, index) => (
              <div className={`parent-child-card ${child.id === activeChildId ? "is-active" : ""}`} key={child.id}>
                <div className="parent-child-card-head">
                  <span className={`parent-avatar avatar-${index % 3}`}>{child.avatarUrl ?? "🙂"}</span>
                  <span className="parent-active-label">{child.id === activeChildId ? t.playMode : ""}</span>
                </div>
                <ChildCard child={child} isActive={child.id === activeChildId} />
                <div className="parent-child-actions">
                  <Link href={`/parent/children/${child.id}/progress`} className="parent-progress-link">{t.viewProgress} <span>↗</span></Link>
                  {child.id === activeChildId ? (
                    <span className="parent-selected">{t.selected}</span>
                  ) : (
                    <form action={setActiveChild.bind(null, child.id)}><Button type="submit" size="sm" variant="ghost">{t.choose}</Button></form>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {activeChildId ? (
        <section className="parent-quick-actions">
          <Link href="/learn" className="parent-dark-button">{t.openPlayMode} <span>↗</span></Link>
          <span>{t.tinySteps}</span>
        </section>
      ) : null}

      <section className="parent-trust-grid">
        <div><span className="trust-icon">✦</span><div><b>{t.trust1Title}</b><p>{t.trust1Body}</p></div></div>
        <div><span className="trust-icon teal">✓</span><div><b>{t.trust2Title}</b><p>{t.trust2Body}</p></div></div>
        <div><span className="trust-icon purple">◒</span><div><b>{t.trust3Title}</b><p>{t.trust3Body}</p></div></div>
      </section>

      <div className="parent-secondary-links">
        {canTeach ? <Link href="/teacher">{t.classroomTools}</Link> : null}
        {isAdmin ? <Link href="/admin">{t.adminTools}</Link> : null}
      </div>
    </>
  );
}
