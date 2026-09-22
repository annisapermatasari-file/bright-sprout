-- Data fix: the initial seed mixed English lesson/badge titles with
-- Indonesian descriptions. This updates already-seeded rows (matched by
-- their old exact title, so it's a no-op if they were never seeded or
-- already renamed) to consistent Indonesian titles.

UPDATE "courses" SET "title" = 'Dasar Berhitung' WHERE "title" = 'Counting Fundamentals';

UPDATE "lessons" SET "title" = 'Hitung dan Cocokkan' WHERE "title" = 'Count and Match';
UPDATE "lessons" SET "title" = 'Jiplak dan Cocokkan' WHERE "title" = 'Trace and Match';
UPDATE "lessons" SET "title" = 'Hitung dan Lingkari' WHERE "title" = 'Count and Circle';
UPDATE "lessons" SET "title" = 'Berhitung Buah' WHERE "title" = 'Fruits Counting';
UPDATE "lessons" SET "title" = 'Menghitung Buah' WHERE "title" = 'Count the Fruits';
UPDATE "lessons" SET "title" = 'Latihan Berhitung' WHERE "title" = 'Counting Practice';
UPDATE "lessons" SET "title" = 'Cocokkan Jumlah yang Sama' WHERE "title" = 'Match the Same Amount';
UPDATE "lessons" SET "title" = 'Menghitung Benda' WHERE "title" = 'Counting Objects';
UPDATE "lessons" SET "title" = 'Ayo Berhitung' WHERE "title" = 'Let''s Count';
UPDATE "lessons" SET "title" = 'Ikan dalam Toples' WHERE "title" = 'Fish in the Jar';
UPDATE "lessons" SET "title" = 'Ada Berapa?' WHERE "title" = 'How Many?';
UPDATE "lessons" SET "title" = 'Menghitung Dinosaurus' WHERE "title" = 'Dinosaur Counting';
UPDATE "lessons" SET "title" = 'Mengenal Angka' WHERE "title" = 'Number Recognition';
UPDATE "lessons" SET "title" = 'Latihan Berhitung Tambahan' WHERE "title" = 'Extra Counting Practice';

UPDATE "badges" SET "name" = 'Pelajaran Pertama' WHERE "name" = 'First Lesson';
UPDATE "badges" SET "name" = 'Pemula Berhitung' WHERE "name" = 'Counting Starter';
UPDATE "badges" SET "name" = '5 Pelajaran Selesai' WHERE "name" = '5 Lessons Complete';
UPDATE "badges" SET "name" = 'Juara Berhitung', "description" = 'Menyelesaikan seluruh kursus Dasar Berhitung.' WHERE "name" = 'Counting Champion';
UPDATE "badges" SET "name" = 'Pelajaran Sempurna' WHERE "name" = 'Perfect Lesson';
UPDATE "badges" SET "name" = 'Streak 7 Hari' WHERE "name" = '7 Day Streak';
