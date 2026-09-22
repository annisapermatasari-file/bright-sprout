-- Seeds the Sains and Kosa Kata Inggris courses directly via SQL, so this
-- content exists in production without anyone needing to run `prisma db
-- seed` (which requires local Node tooling) against the live database.
-- Idempotent: ON CONFLICT DO NOTHING against each table's unique index, so
-- re-running this migration (or re-deploying) is a safe no-op.

-- Courses
INSERT INTO "courses" ("id", "slug", "title", "description", "subject", "status", "updatedAt")
VALUES
  ('course-sains-1', 'sains-lihat-lebih-dekat', 'Sains: Lihat Lebih Dekat', 'Mengenal alam sekitar lewat pertanyaan sederhana.', 'SCIENCE', 'PUBLISHED', CURRENT_TIMESTAMP),
  ('course-bahasa-1', 'kosa-kata-inggris', 'Kosa Kata Inggris', 'Kata-kata bahasa Inggris dasar untuk anak-anak.', 'LANGUAGE', 'PUBLISHED', CURRENT_TIMESTAMP)
ON CONFLICT ("slug") DO NOTHING;

-- Course modules
INSERT INTO "course_modules" ("id", "courseId", "title", "position", "status", "updatedAt")
VALUES
  ('module-sains-1', 'course-sains-1', 'Pengamatan Sains', 1, 'PUBLISHED', CURRENT_TIMESTAMP),
  ('module-bahasa-1', 'course-bahasa-1', 'Jejak Kata', 1, 'PUBLISHED', CURRENT_TIMESTAMP)
ON CONFLICT ("courseId", "position") DO NOTHING;

-- Lessons
INSERT INTO "lessons" ("id", "moduleId", "title", "description", "position", "status", "updatedAt")
VALUES
  ('lesson-sains-1', 'module-sains-1', 'Kenali Alam Sekitar', 'Pertanyaan ringan seputar tumbuhan, hewan, dan tubuh kita.', 1, 'PUBLISHED', CURRENT_TIMESTAMP),
  ('lesson-bahasa-1', 'module-bahasa-1', 'Temukan Kata yang Tepat', 'Mengenal arti dan lawan kata sederhana dalam bahasa Inggris.', 1, 'PUBLISHED', CURRENT_TIMESTAMP)
ON CONFLICT ("moduleId", "position") DO NOTHING;

-- Activities
INSERT INTO "activities" ("id", "lessonId", "type", "title", "position", "difficulty", "status", "updatedAt")
VALUES
  ('activity-sains-1', 'lesson-sains-1', 'MULTIPLE_CHOICE', 'Kenali Alam Sekitar', 1, 'EASY', 'PUBLISHED', CURRENT_TIMESTAMP),
  ('activity-bahasa-1', 'lesson-bahasa-1', 'MULTIPLE_CHOICE', 'Temukan Kata yang Tepat', 1, 'EASY', 'PUBLISHED', CURRENT_TIMESTAMP)
ON CONFLICT ("lessonId", "position") DO NOTHING;

-- Science questions
INSERT INTO "questions" ("id", "activityId", "skill", "prompt", "position", "options", "correctAnswer", "status", "updatedAt")
VALUES
  ('question-sains-1', 'activity-sains-1', 'SCIENCE_BASICS', 'Mana yang termasuk tumbuhan?', 1,
    '[{"id":"a","label":"Daun"},{"id":"b","label":"Batu"},{"id":"c","label":"Sepatu"}]'::jsonb,
    '{"optionId":"a"}'::jsonb, 'PUBLISHED', CURRENT_TIMESTAMP),
  ('question-sains-2', 'activity-sains-1', 'SCIENCE_BASICS', 'Apa yang kita perlukan untuk bernapas?', 2,
    '[{"id":"a","label":"Udara"},{"id":"b","label":"Air minum"},{"id":"c","label":"Apel"}]'::jsonb,
    '{"optionId":"a"}'::jsonb, 'PUBLISHED', CURRENT_TIMESTAMP),
  ('question-sains-3', 'activity-sains-1', 'SCIENCE_BASICS', 'Hewan mana yang bermula sebagai ulat?', 3,
    '[{"id":"a","label":"Kupu-kupu"},{"id":"b","label":"Anjing"},{"id":"c","label":"Ikan"}]'::jsonb,
    '{"optionId":"a"}'::jsonb, 'PUBLISHED', CURRENT_TIMESTAMP)
ON CONFLICT ("activityId", "position") DO NOTHING;

-- Language questions
INSERT INTO "questions" ("id", "activityId", "skill", "prompt", "position", "options", "correctAnswer", "status", "updatedAt")
VALUES
  ('question-bahasa-1', 'activity-bahasa-1', 'VOCABULARY_EN', 'Apa arti kata "cat"?', 1,
    '[{"id":"a","label":"Kucing"},{"id":"b","label":"Buku"},{"id":"c","label":"Matahari"}]'::jsonb,
    '{"optionId":"a"}'::jsonb, 'PUBLISHED', CURRENT_TIMESTAMP),
  ('question-bahasa-2', 'activity-bahasa-1', 'VOCABULARY_EN', 'Apa lawan kata "big"?', 2,
    '[{"id":"a","label":"Kecil"},{"id":"b","label":"Cepat"},{"id":"c","label":"Biru"}]'::jsonb,
    '{"optionId":"a"}'::jsonb, 'PUBLISHED', CURRENT_TIMESTAMP),
  ('question-bahasa-3', 'activity-bahasa-1', 'VOCABULARY_EN', 'Kata mana yang berarti "air"?', 3,
    '[{"id":"a","label":"Water"},{"id":"b","label":"Window"},{"id":"c","label":"Winter"}]'::jsonb,
    '{"optionId":"a"}'::jsonb, 'PUBLISHED', CURRENT_TIMESTAMP)
ON CONFLICT ("activityId", "position") DO NOTHING;

-- Enroll every existing child in both new courses, so they show as
-- available (not just visible) on /learn immediately.
INSERT INTO "enrollments" ("id", "childId", "courseId")
SELECT 'enr-sains-' || "children"."id", "children"."id", 'course-sains-1' FROM "children"
UNION ALL
SELECT 'enr-bahasa-' || "children"."id", "children"."id", 'course-bahasa-1' FROM "children"
ON CONFLICT ("childId", "courseId") DO NOTHING;
