import Link from "next/link";
import { cn } from "@/lib/utils";

const QUEST_STYLES = [
  { tone: "coral", icon: "✦", label: "AWAL CERIA" },
  { tone: "purple", icon: "◒", label: "HUTAN ANGKA" },
  { tone: "teal", icon: "✳", label: "TELUK POLA" },
  { tone: "yellow", icon: "◆", label: "JEJAK BINTANG" },
] as const;

export function CourseCard({
  course,
  isEnrolled,
  index = 0,
}: {
  course: { id: string; title: string; description: string | null };
  isEnrolled: boolean;
  index?: number;
}) {
  const style = QUEST_STYLES[index % QUEST_STYLES.length];

  return (
    <article className={cn("quest-card", `quest-${style.tone}`)}>
      <div className="quest-card-top"><span className="quest-label">{style.label}</span><span className="quest-icon" aria-hidden>{style.icon}</span></div>
      <div className="quest-card-body">
        <h2>{course.title}</h2>
        <p>{course.description ?? "Petualangan kecil penuh tantangan seru."}</p>
        <div className="quest-meta"><span>{isEnrolled ? "↗ Lanjutkan petualangan" : "✦ Petualangan baru"}</span><span>10 menit</span></div>
        <Link href={`/learn/courses/${course.id}`} className="quest-button">{isEnrolled ? "Lanjutkan" : "Mulai petualangan"}<span>↗</span></Link>
      </div>
    </article>
  );
}
