-- Seeds the "Warna & Bentuk" course (two lessons: colors, then shapes)
-- directly in production, same pattern as the Sains/Kosa Kata migration.

INSERT INTO "courses" ("id", "slug", "title", "description", "subject", "status", "updatedAt")
VALUES ('course-colors-shapes-1', 'warna-dan-bentuk', 'Warna & Bentuk', 'Mengenal warna-warni dan bentuk di sekitar kita.', 'COLORS_SHAPES', 'PUBLISHED', CURRENT_TIMESTAMP)
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "course_modules" ("id", "courseId", "title", "position", "status", "updatedAt")
VALUES ('module-colors-shapes-1', 'course-colors-shapes-1', 'Warna & Bentuk', 1, 'PUBLISHED', CURRENT_TIMESTAMP)
ON CONFLICT ("courseId", "position") DO NOTHING;

INSERT INTO "lessons" ("id", "moduleId", "title", "description", "position", "status", "updatedAt")
VALUES
  ('lesson-colors-1', 'module-colors-shapes-1', 'Kenali Warna', 'Menebak nama warna dari kotak warna.', 1, 'PUBLISHED', CURRENT_TIMESTAMP),
  ('lesson-shapes-1', 'module-colors-shapes-1', 'Kenali Bentuk', 'Menebak nama bentuk dari gambar.', 2, 'PUBLISHED', CURRENT_TIMESTAMP)
ON CONFLICT ("moduleId", "position") DO NOTHING;

INSERT INTO "activities" ("id", "lessonId", "type", "title", "position", "difficulty", "status", "updatedAt")
VALUES
  ('activity-colors-1', 'lesson-colors-1', 'MULTIPLE_CHOICE', 'Kenali Warna', 1, 'EASY', 'PUBLISHED', CURRENT_TIMESTAMP),
  ('activity-shapes-1', 'lesson-shapes-1', 'MULTIPLE_CHOICE', 'Kenali Bentuk', 1, 'EASY', 'PUBLISHED', CURRENT_TIMESTAMP)
ON CONFLICT ("lessonId", "position") DO NOTHING;

INSERT INTO "questions" ("id", "activityId", "skill", "prompt", "position", "options", "correctAnswer", "status", "updatedAt")
VALUES
  ('question-color-1', 'activity-colors-1', 'COLOR_RECOGNITION', E'🟥\nWarna apa ini?', 1,
    '[{"id":"a","label":"Biru"},{"id":"b","label":"Merah"},{"id":"c","label":"Hijau"}]'::jsonb, '{"optionId":"b"}'::jsonb, 'PUBLISHED', CURRENT_TIMESTAMP),
  ('question-color-2', 'activity-colors-1', 'COLOR_RECOGNITION', E'🟦\nWarna apa ini?', 2,
    '[{"id":"a","label":"Biru"},{"id":"b","label":"Kuning"},{"id":"c","label":"Ungu"}]'::jsonb, '{"optionId":"a"}'::jsonb, 'PUBLISHED', CURRENT_TIMESTAMP),
  ('question-color-3', 'activity-colors-1', 'COLOR_RECOGNITION', E'🟩\nWarna apa ini?', 3,
    '[{"id":"a","label":"Oranye"},{"id":"b","label":"Hijau"},{"id":"c","label":"Merah muda"}]'::jsonb, '{"optionId":"b"}'::jsonb, 'PUBLISHED', CURRENT_TIMESTAMP),
  ('question-color-4', 'activity-colors-1', 'COLOR_RECOGNITION', E'🟨\nWarna apa ini?', 4,
    '[{"id":"a","label":"Cokelat"},{"id":"b","label":"Hitam"},{"id":"c","label":"Kuning"}]'::jsonb, '{"optionId":"c"}'::jsonb, 'PUBLISHED', CURRENT_TIMESTAMP),
  ('question-color-5', 'activity-colors-1', 'COLOR_RECOGNITION', E'🟪\nWarna apa ini?', 5,
    '[{"id":"a","label":"Ungu"},{"id":"b","label":"Putih"},{"id":"c","label":"Abu-abu"}]'::jsonb, '{"optionId":"a"}'::jsonb, 'PUBLISHED', CURRENT_TIMESTAMP)
ON CONFLICT ("activityId", "position") DO NOTHING;

INSERT INTO "questions" ("id", "activityId", "skill", "prompt", "position", "options", "correctAnswer", "status", "updatedAt")
VALUES
  ('question-shape-1', 'activity-shapes-1', 'SHAPE_RECOGNITION', E'◯\nBentuk apa ini?', 1,
    '[{"id":"a","label":"Segitiga"},{"id":"b","label":"Lingkaran"},{"id":"c","label":"Persegi"}]'::jsonb, '{"optionId":"b"}'::jsonb, 'PUBLISHED', CURRENT_TIMESTAMP),
  ('question-shape-2', 'activity-shapes-1', 'SHAPE_RECOGNITION', E'△\nBentuk apa ini?', 2,
    '[{"id":"a","label":"Bintang"},{"id":"b","label":"Segitiga"},{"id":"c","label":"Lingkaran"}]'::jsonb, '{"optionId":"b"}'::jsonb, 'PUBLISHED', CURRENT_TIMESTAMP),
  ('question-shape-3', 'activity-shapes-1', 'SHAPE_RECOGNITION', E'□\nBentuk apa ini?', 3,
    '[{"id":"a","label":"Persegi"},{"id":"b","label":"Hati"},{"id":"c","label":"Lingkaran"}]'::jsonb, '{"optionId":"a"}'::jsonb, 'PUBLISHED', CURRENT_TIMESTAMP),
  ('question-shape-4', 'activity-shapes-1', 'SHAPE_RECOGNITION', E'★\nBentuk apa ini?', 4,
    '[{"id":"a","label":"Segitiga"},{"id":"b","label":"Bintang"},{"id":"c","label":"Persegi"}]'::jsonb, '{"optionId":"b"}'::jsonb, 'PUBLISHED', CURRENT_TIMESTAMP),
  ('question-shape-5', 'activity-shapes-1', 'SHAPE_RECOGNITION', E'♥\nBentuk apa ini?', 5,
    '[{"id":"a","label":"Lingkaran"},{"id":"b","label":"Bintang"},{"id":"c","label":"Hati"}]'::jsonb, '{"optionId":"c"}'::jsonb, 'PUBLISHED', CURRENT_TIMESTAMP)
ON CONFLICT ("activityId", "position") DO NOTHING;

-- Enroll every existing child so the course shows as available immediately.
INSERT INTO "enrollments" ("id", "childId", "courseId")
SELECT 'enr-colors-shapes-' || "children"."id", "children"."id", 'course-colors-shapes-1' FROM "children"
ON CONFLICT ("childId", "courseId") DO NOTHING;
