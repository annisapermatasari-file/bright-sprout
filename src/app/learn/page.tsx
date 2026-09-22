import { requireActiveChild } from "@/lib/permissions";
import { ActiveChildBanner } from "@/components/learning/ActiveChildBanner";
import { BuddyWelcome } from "@/components/learning/BuddyWelcome";
import { MathMiniGame } from "@/components/learning/MathMiniGame";

export default async function LearnPage() {
  // Redirects to /parent if no active child is selected (Phase 3).
  const { child } = await requireActiveChild();

  return (
    <main className="child-shell mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-10 sm:py-14">
      <ActiveChildBanner child={child} />
      <BuddyWelcome />

      <div className="child-hero-copy">
        <span className="child-kicker">PETUALANGAN HARI INI · ✦</span>
        <h1>Siap untuk sedikit<br /><em>kejutan seru?</em></h1>
        <p>Pilih misi kecilmu. Setiap permainan membawamu satu langkah lebih dekat ke level berikutnya.</p>
      </div>

      <MathMiniGame />
    </main>
  );
}
