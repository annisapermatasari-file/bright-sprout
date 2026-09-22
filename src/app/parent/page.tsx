import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { requireGlobalAdmin, requireClassroomOrganizationRole, ForbiddenError } from "@/lib/permissions";
import { ParentDashboardCopy } from "@/components/parent/ParentDashboardCopy";

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

  return (
    <main className="parent-shell mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-10 sm:py-14">
      <ParentDashboardCopy
        userName={session.user.name?.split(" ")[0] ?? "there"}
        userEmail={session.user.email ?? ""}
        childList={children}
        activeChildId={activeChildId}
        isAdmin={isAdmin}
        canTeach={canTeach}
      />
    </main>
  );
}
