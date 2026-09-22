import { requireActiveChild } from "@/lib/permissions";
import { listPublishedCourses, getEnrollment } from "@/lib/content";
import { ActiveChildBanner } from "@/components/learning/ActiveChildBanner";
import { CourseCard } from "@/components/learning/CourseCard";
import { BuddyWelcome } from "@/components/learning/BuddyWelcome";
import { MathMiniGame } from "@/components/learning/MathMiniGame";

export default async function LearnPage() {
  // Redirects to /parent if no active child is selected (Phase 3).
  const { child } = await requireActiveChild();
  const courses = await listPublishedCourses();
  const enrollments = await Promise.all(
    courses.map((course) => getEnrollment(child.id, course.id)),
  );

  return (
    <main className="child-shell mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-10 sm:py-14">
      <ActiveChildBanner child={child} />
      <BuddyWelcome />

      <div className="child-hero-copy">
        <span className="child-kicker">TODAY'S ADVENTURE · ✦</span>
        <h1>Ready for a little<br /><em>brain sparkle?</em></h1>
        <p>Pilih misi kecilmu. Setiap permainan membawamu satu langkah lebih dekat ke level berikutnya.</p>
      </div>

      {courses.length === 0 ? (
        <div className="child-empty"><span>🌱</span><p>Petualangan baru sedang disiapkan. Coba lagi sebentar lagi!</p></div>
      ) : (
        <div className="quest-grid">
          {courses.map((course, index) => (
            <CourseCard
              key={course.id}
              course={course}
              isEnrolled={Boolean(enrollments[index])}
              index={index}
            />
          ))}
        </div>
      )}

      <MathMiniGame />
    </main>
  );
}
