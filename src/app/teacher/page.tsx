import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser, requireClassroomOrganizationRole, ForbiddenError } from "@/lib/permissions";
import { listTeacherClasses } from "@/lib/teacher";
import { createClass } from "@/server/actions/teacher";
import { Card } from "@/components/ui/Card";
import { ClassForm } from "@/components/teacher/ClassForm";

export default async function TeacherDashboardPage() {
  const user = await requireUser();
  await requireClassroomOrganizationRole(user.id).catch((error) => {
    if (error instanceof ForbiddenError) notFound();
    throw error;
  });

  const classes = await listTeacherClasses(user.id);

  return (
    <main className="tool-shell mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-10 sm:py-14">
      <div>
        <span className="parent-kicker">CLASSROOM STUDIO · ✦</span>
        <h1 className="tool-heading">Kelas Saya</h1>
        <p className="mt-1 text-sm text-muted">Kelola kelas, murid, dan pantau progres belajar mereka.</p>
      </div>

      <div className="tool-list">
        {classes.map((classRecord) => (
          <Link key={classRecord.id} href={`/teacher/classes/${classRecord.id}`}>
            <Card className="tool-list-card flex items-center justify-between gap-3 transition-colors hover:border-primary">
              <p className="font-medium">{classRecord.name}</p>
              <span className="text-sm text-muted">{classRecord._count.members} murid</span>
            </Card>
          </Link>
        ))}
        {classes.length === 0 ? <p className="text-sm text-muted">Belum ada kelas.</p> : null}
      </div>

      <Card className="tool-form-card">
        <h2 className="text-lg font-semibold">Buat Kelas Baru</h2>
        <div className="mt-4">
          <ClassForm action={createClass} submitLabel="Buat Kelas" />
        </div>
      </Card>
    </main>
  );
}
