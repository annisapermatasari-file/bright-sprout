import { requireActiveChild } from "@/lib/permissions";
import { listPublishedCourses, getEnrollment } from "@/lib/content";
import { ActiveChildBanner } from "@/components/learning/ActiveChildBanner";
import { CourseCard } from "@/components/learning/CourseCard";
import { BuddyWelcome } from "@/components/learning/BuddyWelcome";
import { MathMiniGame } from "@/components/learning/MathMiniGame";

const SUBJECT_GROUPS = [
  { subject: "MATH", label: "Matematika", icon: "🧮" },
  { subject: "SCIENCE", label: "Sains", icon: "🔬" },
  { subject: "LANGUAGE", label: "Bahasa Inggris", icon: "🗣️" },
] as const;

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
        <span className="child-kicker">PETUALANGAN HARI INI · ✦</span>
        <h1>Siap untuk sedikit<br /><em>kejutan seru?</em></h1>
        <p>Pilih misi kecilmu. Setiap permainan membawamu satu langkah lebih dekat ke level berikutnya.</p>
      </div>

      {courses.length === 0 ? (
        <div className="child-empty"><span>🌱</span><p>Petualangan baru sedang disiapkan. Coba lagi sebentar lagi!</p></div>
      ) : (
        SUBJECT_GROUPS.map((group) => {
          const groupCourses = courses
            .map((course, index) => ({ course, index }))
            .filter(({ course }) => course.subject === group.subject);
          if (groupCourses.length === 0) return null;
          return (
            <section key={group.subject} className="subject-section">
              <h2 className="subject-heading"><span aria-hidden>{group.icon}</span> {group.label}</h2>
              <div className="quest-grid">
                {groupCourses.map(({ course, index }) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    isEnrolled={Boolean(enrollments[index])}
                    index={index}
                  />
                ))}
              </div>
            </section>
          );
        })
      )}

      <MathMiniGame />
    </main>
  );
}
