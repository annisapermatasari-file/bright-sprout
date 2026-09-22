import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser, requireChildAccess, ForbiddenError } from "@/lib/permissions";
import { getChildDashboardData } from "@/lib/progress";
import { getRecommendations } from "@/lib/recommendations";
import { SKILL_LABELS } from "@/lib/content";
import { Card } from "@/components/ui/Card";
import { StatTile } from "@/components/parent/StatTile";
import { DownloadReportButton } from "@/components/parent/DownloadReportButton";

export default async function ChildProgressPage({ params }: PageProps<"/parent/children/[childId]/progress">) {
  const { childId } = await params;
  const user = await requireUser();
  const child = await requireChildAccess(user.id, childId).catch((error) => { if (error instanceof ForbiddenError) return null; throw error; });
  if (!child) notFound();
  const data = await getChildDashboardData(childId);
  const qualifyingSkills = data.skillMastery.filter((skill) => skill.attemptsTotal >= 2);
  const strongSkills = qualifyingSkills.filter((skill) => skill.masteryScore >= 0.8).slice(0, 3);
  const weakSkills = [...qualifyingSkills].filter((skill) => skill.masteryScore < 0.7).sort((a, b) => a.masteryScore - b.masteryScore).slice(0, 3);
  const recommendations = getRecommendations({ totalAttempts: data.totalAttempts, currentStreak: data.streak, weakestSkill: weakSkills[0] ? { skill: weakSkills[0].skill, masteryScore: weakSkills[0].masteryScore } : null, isCourseFullyCompleted: data.totalPublishedLessons > 0 && data.completedLessonsCount === data.totalPublishedLessons });
  const currentCourseTitle = data.currentLessonProgress?.lesson.module.course.title ?? data.enrollments[0]?.course.title ?? null;

  return (
    <main className="progress-shell mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-10 sm:py-14">
      <div className="progress-breadcrumb"><Link href="/parent">← Family space</Link><span>/ Progress</span></div>
      <section className="progress-heading"><div><span className="parent-kicker">A LITTLE LOOK BACK · ✦</span><h1>{child.displayName}&apos;s learning garden</h1><p>{currentCourseTitle ? `Growing through ${currentCourseTitle}` : "Every small step counts."}</p></div><div className="progress-heading-actions"><DownloadReportButton data={{ childName: child.displayName, overallProgressPercent: data.overallProgressPercent, completedLessonsCount: data.completedLessonsCount, totalPublishedLessons: data.totalPublishedLessons, totalXp: data.totalXp, totalStars: data.totalStars, badgeCount: data.badges.length, streak: data.streak, totalAttempts: data.totalAttempts, accuracy: data.accuracy, skills: data.skillMastery.map((skill) => ({ label: SKILL_LABELS[skill.skill], score: Math.round(skill.masteryScore * 100) })), recommendations: recommendations.map((recommendation) => recommendation.message) }} /><span className="progress-hero-avatar">{child.avatarUrl ?? "🙂"}</span></div></section>
      <div className="progress-stats"><StatTile label="XP earned" value={data.totalXp} /><StatTile label="Stars found" value={data.totalStars} /><StatTile label="Badges" value={data.badges.length} /><StatTile label="Day streak" value={data.streak} /></div>
      <section className="progress-main-grid"><Card className="progress-overview-card"><div className="progress-card-heading"><div><span className="parent-kicker">THE BIG PICTURE</span><h2>Learning momentum</h2></div><span className="progress-percent">{data.overallProgressPercent}%</span></div><p className="progress-muted">{data.completedLessonsCount} of {data.totalPublishedLessons} lessons completed</p><div className="progress-large-track"><span style={{ width: `${data.overallProgressPercent}%` }} /></div>{data.currentLessonProgress ? <p className="progress-last">Last visited <Link href={`/learn/lessons/${data.currentLessonProgress.lessonId}`}>{data.currentLessonProgress.lesson.title} ↗</Link></p> : <p className="progress-last">No lesson started yet — a first tiny quest is waiting.</p>}</Card><Card className="progress-note-card"><span className="progress-note-icon">✦</span><h2>Keep the joy in it.</h2><p>Progress is a trail of tiny moments. Celebrate the questions, not just the answers.</p><Link href="/learn" className="parent-dark-button">Open play mode <span>↗</span></Link></Card></section>
      <section className="progress-section"><div className="progress-section-title"><span className="parent-kicker">WHAT&apos;S BLOOMING</span><h2>Skills in the garden</h2></div><div className="skill-progress-grid">{data.skillMastery.map((skill, index) => <div className="skill-progress-row" key={skill.id}><span className={`skill-progress-icon skill-color-${index % 3}`}>{index === 0 ? "✦" : index === 1 ? "◒" : "◆"}</span><div><div className="skill-progress-label"><b>{SKILL_LABELS[skill.skill]}</b><span>{Math.round(skill.masteryScore * 100)}%</span></div><div className="skill-progress-track"><span style={{ width: `${Math.round(skill.masteryScore * 100)}%` }} /></div></div></div>)}</div></section>
      <section className="progress-lower-grid"><Card><span className="parent-kicker">CELEBRATE</span><h2 className="small-progress-heading">Strong shoots</h2>{strongSkills.length > 0 ? <ul className="progress-list positive">{strongSkills.map((skill) => <li key={skill.id}>✦ {SKILL_LABELS[skill.skill]}</li>)}</ul> : <p className="progress-muted">A few more tries will help the strongest skills emerge.</p>}</Card><Card><span className="parent-kicker">GENTLE NUDGE</span><h2 className="small-progress-heading">Worth another try</h2>{weakSkills.length > 0 ? <ul className="progress-list gentle">{weakSkills.map((skill) => <li key={skill.id}>◒ {SKILL_LABELS[skill.skill]}</li>)}</ul> : <p className="progress-muted">No extra practice needed right now.</p>}</Card></section>
      <section className="progress-recommendation"><div><span className="parent-kicker">NEXT BEST STEP</span><h2>Try this together</h2></div><ul>{recommendations.map((recommendation) => <li key={recommendation.id}>💡 {recommendation.message}</li>)}</ul></section>
    </main>
  );
}
