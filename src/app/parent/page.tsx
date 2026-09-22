import Link from "next/link";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { requireGlobalAdmin, requireClassroomOrganizationRole, ForbiddenError } from "@/lib/permissions";
import { logout } from "@/server/actions/auth";
import { setActiveChild } from "@/server/actions/children";
import { Button } from "@/components/ui/Button";
import { ChildCard } from "@/components/child/ChildCard";

export default async function ParentDashboardPage() {
  const session = await auth();
  if (!session?.user) return null;
  const [children, cookieStore] = await Promise.all([
    db.child.findMany({ where: { parentUserId: session.user.id }, orderBy: { createdAt: "asc" } }),
    cookies(),
  ]);
  const activeChildId = cookieStore.get("activeChildId")?.value;
  const isAdmin = await requireGlobalAdmin(session.user.id).then(() => true).catch((error) => { if (error instanceof ForbiddenError) return false; throw error; });
  const canTeach = await requireClassroomOrganizationRole(session.user.id).then(() => true).catch((error) => { if (error instanceof ForbiddenError) return false; throw error; });
  const activeChild = children.find((child) => child.id === activeChildId) ?? children[0];

  return (
    <main className="parent-shell mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-10 sm:py-14">
      <div className="parent-topline"><div><span className="parent-kicker">FAMILY SPACE · ✦</span><h1>Good morning, {session.user.name?.split(" ")[0] ?? "there"}.</h1><p>Here’s a gentle look at your family’s learning garden.</p></div><div className="parent-account"><span>{session.user.email}</span><form action={logout}><Button type="submit" variant="ghost">Sign out</Button></form></div></div>
      <section className="parent-welcome"><div><span className="parent-kicker">YOUR NEXT SMALL STEP</span><h2>{activeChild ? `${activeChild.displayName} is ready to play.` : "Plant your first learning seed."}</h2><p>{activeChild ? "Choose a child to see their progress, or jump straight back into a playful quest." : "Add a child profile and start a learning journey made just for them."}</p></div><span className="parent-welcome-art">🌱</span></section>
      <section className="parent-section"><div className="parent-section-heading"><div><span className="parent-kicker">YOUR LITTLE LEARNERS</span><h2>Profiles & progress</h2></div><Link href="/parent/children" className="parent-outline-button">Manage profiles <span>↗</span></Link></div>
        {children.length === 0 ? <div className="parent-empty"><span>🌱</span><div><b>No profiles yet</b><p>Add your first child to begin a private learning space.</p></div><Link href="/parent/children" className="parent-dark-button">Add a profile <span>↗</span></Link></div> : <div className="parent-child-grid">{children.map((child, index) => <div className={`parent-child-card ${child.id === activeChildId ? "is-active" : ""}`} key={child.id}><div className="parent-child-card-head"><span className={`parent-avatar avatar-${index % 3}`}>{child.avatarUrl ?? "🙂"}</span><span className="parent-active-label">{child.id === activeChildId ? "● PLAY MODE" : ""}</span></div><ChildCard child={child} isActive={child.id === activeChildId} /><div className="parent-child-actions"><Link href={`/parent/children/${child.id}/progress`} className="parent-progress-link">View progress <span>↗</span></Link>{child.id === activeChildId ? <span className="parent-selected">Selected</span> : <form action={setActiveChild.bind(null, child.id)}><Button type="submit" size="sm" variant="ghost">Choose</Button></form>}</div></div>)}</div>}
      </section>
      {activeChildId ? <section className="parent-quick-actions"><Link href="/learn" className="parent-dark-button">Open play mode <span>↗</span></Link><span>Learning is better in tiny, happy steps.</span></section> : null}
      <section className="parent-trust-grid"><div><span className="trust-icon">✦</span><div><b>Playful by design</b><p>Short activities help kids build confidence without pressure.</p></div></div><div><span className="trust-icon teal">✓</span><div><b>Private by default</b><p>Your child’s progress stays inside your family space.</p></div></div><div><span className="trust-icon purple">◒</span><div><b>Useful, not noisy</b><p>See the next helpful step, not a wall of numbers.</p></div></div></section>
      <div className="parent-secondary-links">{canTeach ? <Link href="/teacher">Open classroom tools ↗</Link> : null}{isAdmin ? <Link href="/admin">Open admin tools ↗</Link> : null}</div>
    </main>
  );
}
