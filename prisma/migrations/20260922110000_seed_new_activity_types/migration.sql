-- Seeds a new module ("Cara Baru Berlatih") under the existing "Dasar
-- Berhitung" (counting-fundamentals) course with one lesson per newly
-- built activity type: COUNT_INPUT, COUNT_CIRCLE, DRAG_MATCH, TRACE_NUMBER.
-- Written directly in SQL (not the Node seed script) so it applies
-- automatically on the next Vercel deploy without local tooling.
-- Idempotent via ON CONFLICT DO NOTHING on each table's unique index, and
-- the module insert is a safe no-op (inserts zero rows) if the
-- counting-fundamentals course doesn't exist in this database.

-- Module (position computed from whatever already exists under the course)
INSERT INTO "course_modules" ("id", "courseId", "title", "position", "status", "updatedAt")
SELECT
  'module-math-extra-1',
  c.id,
  'Cara Baru Berlatih',
  COALESCE((SELECT MAX(cm.position) FROM "course_modules" cm WHERE cm."courseId" = c.id), 0) + 1,
  'PUBLISHED',
  CURRENT_TIMESTAMP
FROM "courses" c
WHERE c.slug = 'counting-fundamentals'
ON CONFLICT ("courseId", "position") DO NOTHING;

-- Lessons
INSERT INTO "lessons" ("id", "moduleId", "title", "description", "position", "status", "updatedAt")
VALUES
  ('lesson-count-input-1', 'module-math-extra-1', 'Ketik Jumlahnya', 'Hitung bendanya, lalu ketik angkanya di keypad.', 1, 'PUBLISHED', CURRENT_TIMESTAMP),
  ('lesson-count-circle-1', 'module-math-extra-1', 'Lingkari Angka yang Benar', 'Hitung bendanya, lalu lingkari angka yang tepat.', 2, 'PUBLISHED', CURRENT_TIMESTAMP),
  ('lesson-drag-match-1', 'module-math-extra-1', 'Seret ke Kotak yang Tepat', 'Seret kumpulan benda ke kotak dengan angka yang cocok.', 3, 'PUBLISHED', CURRENT_TIMESTAMP),
  ('lesson-trace-number-1', 'module-math-extra-1', 'Jiplak Angka', 'Jiplak setiap angka dengan jari sampai selesai.', 4, 'PUBLISHED', CURRENT_TIMESTAMP)
ON CONFLICT ("moduleId", "position") DO NOTHING;

-- Activities
INSERT INTO "activities" ("id", "lessonId", "type", "title", "position", "difficulty", "status", "updatedAt")
VALUES
  ('activity-count-input-1', 'lesson-count-input-1', 'COUNT_INPUT', 'Ketik Jumlahnya', 1, 'EASY', 'PUBLISHED', CURRENT_TIMESTAMP),
  ('activity-count-circle-1', 'lesson-count-circle-1', 'COUNT_CIRCLE', 'Lingkari Angka yang Benar', 1, 'EASY', 'PUBLISHED', CURRENT_TIMESTAMP),
  ('activity-drag-match-1', 'lesson-drag-match-1', 'DRAG_MATCH', 'Seret ke Kotak yang Tepat', 1, 'EASY', 'PUBLISHED', CURRENT_TIMESTAMP),
  ('activity-trace-number-1', 'lesson-trace-number-1', 'TRACE_NUMBER', 'Jiplak Angka', 1, 'EASY', 'PUBLISHED', CURRENT_TIMESTAMP)
ON CONFLICT ("lessonId", "position") DO NOTHING;

-- COUNT_INPUT questions (🧁, counts 2/4/5/7/9)
INSERT INTO "questions" ("id", "activityId", "skill", "prompt", "position", "options", "correctAnswer", "status", "updatedAt")
VALUES
  ('question-count-input-1', 'activity-count-input-1', 'COUNT_1_10', E'🧁🧁\nAda berapa banyak?', 1,
    '[{"id":"a","label":"1"},{"id":"b","label":"2"},{"id":"c","label":"3"},{"id":"d","label":"4"}]'::jsonb, '{"optionId":"b"}'::jsonb, 'PUBLISHED', CURRENT_TIMESTAMP),
  ('question-count-input-2', 'activity-count-input-1', 'COUNT_1_10', E'🧁🧁🧁🧁\nAda berapa banyak?', 2,
    '[{"id":"a","label":"4"},{"id":"b","label":"1"},{"id":"c","label":"2"},{"id":"d","label":"3"}]'::jsonb, '{"optionId":"a"}'::jsonb, 'PUBLISHED', CURRENT_TIMESTAMP),
  ('question-count-input-3', 'activity-count-input-1', 'COUNT_1_10', E'🧁🧁🧁🧁🧁\nAda berapa banyak?', 3,
    '[{"id":"a","label":"2"},{"id":"b","label":"3"},{"id":"c","label":"5"},{"id":"d","label":"4"}]'::jsonb, '{"optionId":"c"}'::jsonb, 'PUBLISHED', CURRENT_TIMESTAMP),
  ('question-count-input-4', 'activity-count-input-1', 'COUNT_1_10', E'🧁🧁🧁🧁🧁🧁🧁\nAda berapa banyak?', 4,
    '[{"id":"a","label":"4"},{"id":"b","label":"7"},{"id":"c","label":"5"},{"id":"d","label":"6"}]'::jsonb, '{"optionId":"b"}'::jsonb, 'PUBLISHED', CURRENT_TIMESTAMP),
  ('question-count-input-5', 'activity-count-input-1', 'COUNT_1_10', E'🧁🧁🧁🧁🧁🧁🧁🧁🧁\nAda berapa banyak?', 5,
    '[{"id":"a","label":"9"},{"id":"b","label":"8"},{"id":"c","label":"6"},{"id":"d","label":"7"}]'::jsonb, '{"optionId":"a"}'::jsonb, 'PUBLISHED', CURRENT_TIMESTAMP)
ON CONFLICT ("activityId", "position") DO NOTHING;

-- COUNT_CIRCLE questions (🎨, counts 1/3/6/8/10)
INSERT INTO "questions" ("id", "activityId", "skill", "prompt", "position", "options", "correctAnswer", "status", "updatedAt")
VALUES
  ('question-count-circle-1', 'activity-count-circle-1', 'COUNT_1_10', E'🎨\nAda berapa banyak?', 1,
    '[{"id":"a","label":"2"},{"id":"b","label":"3"},{"id":"c","label":"1"},{"id":"d","label":"4"}]'::jsonb, '{"optionId":"c"}'::jsonb, 'PUBLISHED', CURRENT_TIMESTAMP),
  ('question-count-circle-2', 'activity-count-circle-1', 'COUNT_1_10', E'🎨🎨🎨\nAda berapa banyak?', 2,
    '[{"id":"a","label":"3"},{"id":"b","label":"4"},{"id":"c","label":"1"},{"id":"d","label":"2"}]'::jsonb, '{"optionId":"a"}'::jsonb, 'PUBLISHED', CURRENT_TIMESTAMP),
  ('question-count-circle-3', 'activity-count-circle-1', 'COUNT_1_10', E'🎨🎨🎨🎨🎨🎨\nAda berapa banyak?', 3,
    '[{"id":"a","label":"4"},{"id":"b","label":"6"},{"id":"c","label":"3"},{"id":"d","label":"5"}]'::jsonb, '{"optionId":"b"}'::jsonb, 'PUBLISHED', CURRENT_TIMESTAMP),
  ('question-count-circle-4', 'activity-count-circle-1', 'COUNT_1_10', E'🎨🎨🎨🎨🎨🎨🎨🎨\nAda berapa banyak?', 4,
    '[{"id":"a","label":"5"},{"id":"b","label":"7"},{"id":"c","label":"8"},{"id":"d","label":"6"}]'::jsonb, '{"optionId":"c"}'::jsonb, 'PUBLISHED', CURRENT_TIMESTAMP),
  ('question-count-circle-5', 'activity-count-circle-1', 'COUNT_1_10', E'🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨\nAda berapa banyak?', 5,
    '[{"id":"a","label":"10"},{"id":"b","label":"9"},{"id":"c","label":"7"},{"id":"d","label":"8"}]'::jsonb, '{"optionId":"a"}'::jsonb, 'PUBLISHED', CURRENT_TIMESTAMP)
ON CONFLICT ("activityId", "position") DO NOTHING;

-- DRAG_MATCH questions (🦋, counts 2/3/5/7/9)
INSERT INTO "questions" ("id", "activityId", "skill", "prompt", "position", "options", "correctAnswer", "status", "updatedAt")
VALUES
  ('question-drag-match-1', 'activity-drag-match-1', 'COUNT_1_10', E'🦋🦋\nSeret ke kotak dengan jumlah yang tepat!', 1,
    '[{"id":"a","label":"1"},{"id":"b","label":"2"},{"id":"c","label":"4"},{"id":"d","label":"3"}]'::jsonb, '{"optionId":"b"}'::jsonb, 'PUBLISHED', CURRENT_TIMESTAMP),
  ('question-drag-match-2', 'activity-drag-match-1', 'COUNT_1_10', E'🦋🦋🦋\nSeret ke kotak dengan jumlah yang tepat!', 2,
    '[{"id":"a","label":"4"},{"id":"b","label":"1"},{"id":"c","label":"3"},{"id":"d","label":"2"}]'::jsonb, '{"optionId":"c"}'::jsonb, 'PUBLISHED', CURRENT_TIMESTAMP),
  ('question-drag-match-3', 'activity-drag-match-1', 'COUNT_1_10', E'🦋🦋🦋🦋🦋\nSeret ke kotak dengan jumlah yang tepat!', 3,
    '[{"id":"a","label":"5"},{"id":"b","label":"3"},{"id":"c","label":"2"},{"id":"d","label":"4"}]'::jsonb, '{"optionId":"a"}'::jsonb, 'PUBLISHED', CURRENT_TIMESTAMP),
  ('question-drag-match-4', 'activity-drag-match-1', 'COUNT_1_10', E'🦋🦋🦋🦋🦋🦋🦋\nSeret ke kotak dengan jumlah yang tepat!', 4,
    '[{"id":"a","label":"6"},{"id":"b","label":"4"},{"id":"c","label":"7"},{"id":"d","label":"5"}]'::jsonb, '{"optionId":"c"}'::jsonb, 'PUBLISHED', CURRENT_TIMESTAMP),
  ('question-drag-match-5', 'activity-drag-match-1', 'COUNT_1_10', E'🦋🦋🦋🦋🦋🦋🦋🦋🦋\nSeret ke kotak dengan jumlah yang tepat!', 5,
    '[{"id":"a","label":"8"},{"id":"b","label":"9"},{"id":"c","label":"6"},{"id":"d","label":"7"}]'::jsonb, '{"optionId":"b"}'::jsonb, 'PUBLISHED', CURRENT_TIMESTAMP)
ON CONFLICT ("activityId", "position") DO NOTHING;

-- TRACE_NUMBER questions (single always-correct option; counts 1-5)
INSERT INTO "questions" ("id", "activityId", "skill", "prompt", "position", "options", "correctAnswer", "status", "updatedAt")
VALUES
  ('question-trace-number-1', 'activity-trace-number-1', 'NUMBER_RECOGNITION_1_10', 'Jiplak angka 1.', 1,
    '[{"id":"a","label":"1"}]'::jsonb, '{"optionId":"a"}'::jsonb, 'PUBLISHED', CURRENT_TIMESTAMP),
  ('question-trace-number-2', 'activity-trace-number-1', 'NUMBER_RECOGNITION_1_10', 'Jiplak angka 2.', 2,
    '[{"id":"a","label":"2"}]'::jsonb, '{"optionId":"a"}'::jsonb, 'PUBLISHED', CURRENT_TIMESTAMP),
  ('question-trace-number-3', 'activity-trace-number-1', 'NUMBER_RECOGNITION_1_10', 'Jiplak angka 3.', 3,
    '[{"id":"a","label":"3"}]'::jsonb, '{"optionId":"a"}'::jsonb, 'PUBLISHED', CURRENT_TIMESTAMP),
  ('question-trace-number-4', 'activity-trace-number-1', 'NUMBER_RECOGNITION_1_10', 'Jiplak angka 4.', 4,
    '[{"id":"a","label":"4"}]'::jsonb, '{"optionId":"a"}'::jsonb, 'PUBLISHED', CURRENT_TIMESTAMP),
  ('question-trace-number-5', 'activity-trace-number-1', 'NUMBER_RECOGNITION_1_10', 'Jiplak angka 5.', 5,
    '[{"id":"a","label":"5"}]'::jsonb, '{"optionId":"a"}'::jsonb, 'PUBLISHED', CURRENT_TIMESTAMP)
ON CONFLICT ("activityId", "position") DO NOTHING;

-- Retag the existing "Cocokkan Jumlah yang Sama" lesson's activity from
-- MULTIPLE_CHOICE to the now-built SAME_AMOUNT type (same question data
-- shape; this only changes which UI renders it).
UPDATE "activities" SET "type" = 'SAME_AMOUNT'
WHERE "id" IN (
  SELECT a.id FROM "activities" a
  JOIN "lessons" l ON l.id = a."lessonId"
  WHERE l.title = 'Cocokkan Jumlah yang Sama'
);
