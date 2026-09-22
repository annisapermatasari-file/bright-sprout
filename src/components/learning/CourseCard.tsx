import Link from "next/link";
import { cn } from "@/lib/utils";

const QUEST_STYLES = [
  { tone: "coral", icon: "✦", label: "SUNNY START" },
  { tone: "purple", icon: "◒", label: "NUMBER FOREST" },
  { tone: "teal", icon: "✳", label: "PATTERN BAY" },
  { tone: "yellow", icon: "◆", label: "STAR TRAIL" },
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
        <p>{course.description ?? "A tiny adventure full of friendly challenges."}</p>
        <div className="quest-meta"><span>{isEnrolled ? "↗ Continue your quest" : "✦ New adventure"}</span><span>10 min</span></div>
        <Link href={`/learn/courses/${course.id}`} className="quest-button">{isEnrolled ? "Keep going" : "Start quest"}<span>↗</span></Link>
      </div>
    </article>
  );
}
