import Link from "next/link";
import { cn } from "@/lib/utils";

// Icon/tone genuinely tied to the subject (not a decorative rotation) —
// closer to how reference apps like LogicLike give each category tile its
// own instantly-recognizable picture (pyramids for Countries, watermelons
// for Numbers, etc).
const SUBJECT_STYLES: Record<string, { tone: string; icon: string; label: string }> = {
  MATH: { tone: "coral", icon: "🔢", label: "MATEMATIKA" },
  SCIENCE: { tone: "teal", icon: "🔬", label: "SAINS" },
  LANGUAGE: { tone: "purple", icon: "🗣️", label: "BAHASA INGGRIS" },
  COLORS_SHAPES: { tone: "yellow", icon: "🎨", label: "WARNA & BENTUK" },
};
const FALLBACK_STYLE = { tone: "yellow", icon: "✦", label: "PETUALANGAN" };

export function CourseCard({
  course,
  isEnrolled,
  index = 0,
}: {
  course: { id: string; title: string; description: string | null; subject?: string };
  isEnrolled: boolean;
  index?: number;
}) {
  const style = (course.subject && SUBJECT_STYLES[course.subject]) || FALLBACK_STYLE;

  return (
    <article className={cn("quest-card", `quest-${style.tone}`)}>
      <span className="quest-mascot" aria-hidden style={{ animationDelay: `${index * 0.4}s` }}>🌱</span>
      <div className="quest-card-top"><span className="quest-label">{style.label}</span></div>
      <div className="quest-card-icon" aria-hidden>{style.icon}</div>
      <div className="quest-card-body">
        <h2>{course.title}</h2>
        <p>{course.description ?? "Petualangan kecil penuh tantangan seru."}</p>
        <div className="quest-meta"><span>{isEnrolled ? "↗ Lanjutkan petualangan" : "✦ Petualangan baru"}</span><span>10 menit</span></div>
        <Link href={`/learn/courses/${course.id}`} className="quest-button">{isEnrolled ? "Lanjutkan" : "Mulai petualangan"}<span>↗</span></Link>
      </div>
    </article>
  );
}
