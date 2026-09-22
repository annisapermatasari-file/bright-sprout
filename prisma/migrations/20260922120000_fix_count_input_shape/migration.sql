-- COUNT_INPUT now renders a fixed 0-10 keypad (see NumberInputActivity),
-- so the correct option's id must be the numeral itself rather than an
-- arbitrary shuffled letter id. Updates the 5 rows seeded in
-- 20260922110000_seed_new_activity_types.
UPDATE "questions" SET
  "options" = '[{"id":"2","label":"2"}]'::jsonb,
  "correctAnswer" = '{"optionId":"2"}'::jsonb
WHERE "id" = 'question-count-input-1';

UPDATE "questions" SET
  "options" = '[{"id":"4","label":"4"}]'::jsonb,
  "correctAnswer" = '{"optionId":"4"}'::jsonb
WHERE "id" = 'question-count-input-2';

UPDATE "questions" SET
  "options" = '[{"id":"5","label":"5"}]'::jsonb,
  "correctAnswer" = '{"optionId":"5"}'::jsonb
WHERE "id" = 'question-count-input-3';

UPDATE "questions" SET
  "options" = '[{"id":"7","label":"7"}]'::jsonb,
  "correctAnswer" = '{"optionId":"7"}'::jsonb
WHERE "id" = 'question-count-input-4';

UPDATE "questions" SET
  "options" = '[{"id":"9","label":"9"}]'::jsonb,
  "correctAnswer" = '{"optionId":"9"}'::jsonb
WHERE "id" = 'question-count-input-5';
