import "dotenv/config";
import { PrismaClient, type Skill, type ActivityType, type ContentStatus } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

// Development credentials only — never reuse these in a real environment.
const DEV_PASSWORD = "ChangeMe123!";

type Option = { id: string; label: string };

/**
 * Distinct numeric distractors near `correct`, widening the search window
 * outward so counts near the edges of [1, max] still yield three options.
 */
function distractors(correct: number, max: number): number[] {
  const offsets = [-3, -2, -1, 1, 2, 3, -4, 4, -5, 5];
  const result: number[] = [];
  for (const offset of offsets) {
    const n = correct + offset;
    if (n >= 1 && n <= max && n !== correct && !result.includes(n)) {
      result.push(n);
      if (result.length === 3) break;
    }
  }
  return result;
}

/** Builds a 4-option question, rotating the correct answer's position deterministically by `seedIndex`. */
function buildOptions(
  correctLabel: string,
  distractorLabels: string[],
  seedIndex: number,
): { options: Option[]; correctOptionId: string } {
  const letters = ["a", "b", "c", "d"];
  const values = [correctLabel, ...distractorLabels];
  const rotation = seedIndex % values.length;
  const rotated = [...values.slice(rotation), ...values.slice(0, rotation)];
  const options = rotated.map((label, i) => ({ id: letters[i], label }));
  const correctOptionId = options[(values.length - rotation) % values.length].id;
  return { options, correctOptionId };
}

/** "How many?" — child counts an emoji group and picks the matching number. */
function countSelectQuestion(seedIndex: number, emoji: string, count: number, max: number, skill: Skill) {
  const { options, correctOptionId } = buildOptions(
    String(count),
    distractors(count, max).map(String),
    seedIndex,
  );
  return {
    skill,
    prompt: `${emoji.repeat(count)}\nAda berapa banyak?`,
    options,
    correctAnswer: { optionId: correctOptionId },
  };
}

/** Numeral shown; child picks the emoji group with the matching quantity. */
function numberRecognitionQuestion(seedIndex: number, emoji: string, target: number, max: number, skill: Skill) {
  const { options, correctOptionId } = buildOptions(
    emoji.repeat(target),
    distractors(target, max).map((n) => emoji.repeat(n)),
    seedIndex,
  );
  return {
    skill,
    prompt: `Pilih kumpulan dengan jumlah ${target}.`,
    options,
    correctAnswer: { optionId: correctOptionId },
  };
}

/** A reference group is shown; child picks the other group with the same quantity. */
function matchAmountQuestion(
  seedIndex: number,
  referenceEmoji: string,
  optionEmoji: string,
  target: number,
  max: number,
  skill: Skill,
) {
  const { options, correctOptionId } = buildOptions(
    optionEmoji.repeat(target),
    distractors(target, max).map((n) => optionEmoji.repeat(n)),
    seedIndex,
  );
  return {
    skill,
    prompt: `${referenceEmoji.repeat(target)}\nPilih kumpulan dengan jumlah yang sama.`,
    options,
    correctAnswer: { optionId: correctOptionId },
  };
}

/** COUNT_INPUT: option id/label IS the numeral itself, matching the fixed 0-10 keypad UI. */
function countInputQuestion(emoji: string, count: number, skill: Skill) {
  return {
    skill,
    prompt: `${emoji.repeat(count)}\nAda berapa banyak?`,
    options: [{ id: String(count), label: String(count) }],
    correctAnswer: { optionId: String(count) },
  };
}

/** DRAG_MATCH: same shape as countSelectQuestion, phrased as a drag instruction. */
function dragMatchQuestion(seedIndex: number, emoji: string, count: number, max: number, skill: Skill) {
  const { options, correctOptionId } = buildOptions(
    String(count),
    distractors(count, max).map(String),
    seedIndex,
  );
  return {
    skill,
    prompt: `${emoji.repeat(count)}\nSeret ke kotak dengan jumlah yang tepat!`,
    options,
    correctAnswer: { optionId: correctOptionId },
  };
}

/** TRACE_NUMBER: a single always-correct option — finishing the trace gesture is the answer. */
function traceNumberQuestion(count: number, skill: Skill) {
  return {
    skill,
    prompt: `Jiplak angka ${count}.`,
    options: [{ id: "a", label: String(count) }],
    correctAnswer: { optionId: "a" },
  };
}

/** Missing-number sequence styled for the worksheet-inspired ordering lesson. */
function sequenceQuestion(seedIndex: number, missing: number, sequence: number[], skill: Skill) {
  const { options, correctOptionId } = buildOptions(
    String(missing),
    distractors(missing, Math.max(...sequence) + 2).map(String),
    seedIndex,
  );
  return {
    skill,
    prompt: `URUTAN:${sequence.map((value) => (value === missing ? "_" : value)).join(",")}` +
      "\nLengkapi angka yang hilang!",
    options,
    correctAnswer: { optionId: correctOptionId },
  };
}

type LessonDef = {
  title: string;
  description: string;
  activityType: ActivityType;
  skill: Skill;
  emoji: string;
  emoji2?: string;
  max: number;
  counts: number[];
  sequence?: boolean;
};

const moduleDefs: { title: string; lessons: LessonDef[] }[] = [
  {
    title: "Mengenal Berhitung",
    lessons: [
      {
        title: "Hitung dan Cocokkan",
        description: "Menghitung kumpulan benda dan mencocokkan dengan angka.",
        activityType: "COUNT_SELECT",
        skill: "COUNT_1_5",
        emoji: "🍎",
        max: 5,
        counts: [1, 2, 3, 4, 5],
      },
      {
        title: "Jiplak dan Cocokkan",
        description: "Latihan mengenali jumlah sambil menjiplak angka.",
        activityType: "COUNT_SELECT",
        skill: "COUNT_1_5",
        emoji: "⭐",
        max: 5,
        counts: [2, 3, 4, 5, 1],
      },
      {
        title: "Hitung dan Lingkari",
        description: "Menghitung benda lalu memilih jumlah yang tepat.",
        activityType: "COUNT_SELECT",
        skill: "COUNT_1_10",
        emoji: "🎈",
        max: 10,
        counts: [3, 5, 7, 8, 10],
      },
      {
        title: "Berhitung Buah",
        description: "Menghitung buah-buahan dalam kelompok kecil.",
        activityType: "COUNT_SELECT",
        skill: "COUNT_1_10",
        emoji: "🍇",
        max: 10,
        counts: [2, 4, 6, 8, 9],
      },
      {
        title: "Menghitung Buah",
        description: "Latihan lanjutan menghitung buah-buahan.",
        activityType: "COUNT_SELECT",
        skill: "COUNT_1_10",
        emoji: "🍊",
        max: 10,
        counts: [1, 3, 5, 7, 10],
      },
    ],
  },
  {
    title: "Latihan Berhitung",
    lessons: [
      {
        title: "Latihan Berhitung",
        description: "Latihan berhitung campuran untuk memperkuat pemahaman.",
        activityType: "COUNT_SELECT",
        skill: "COUNT_1_10",
        emoji: "🧸",
        max: 10,
        counts: [2, 4, 5, 7, 9],
      },
      {
        title: "Cocokkan Jumlah yang Sama",
        description: "Menemukan kumpulan benda dengan jumlah yang sama.",
        activityType: "SAME_AMOUNT",
        skill: "MATCH_QUANTITY",
        emoji: "🍎",
        emoji2: "🍊",
        max: 10,
        counts: [2, 3, 5, 6, 8],
      },
      {
        title: "Menghitung Benda",
        description: "Menghitung berbagai benda sehari-hari.",
        activityType: "COUNT_SELECT",
        skill: "COUNT_1_10",
        emoji: "🚗",
        max: 10,
        counts: [3, 4, 6, 8, 10],
      },
      {
        title: "Ayo Berhitung",
        description: "Latihan berhitung dengan tema kendaraan.",
        activityType: "COUNT_SELECT",
        skill: "COUNT_1_10",
        emoji: "🚲",
        max: 10,
        counts: [1, 2, 4, 6, 9],
      },
      {
        title: "Ikan dalam Toples",
        description: "Menghitung ikan di dalam toples.",
        activityType: "COUNT_SELECT",
        skill: "COUNT_1_10",
        emoji: "🐟",
        max: 10,
        counts: [3, 5, 6, 8, 10],
      },
    ],
  },
  {
    title: "Tantangan Berhitung",
    lessons: [
      {
        title: "Ada Berapa?",
        description: "Tantangan menghitung jumlah yang lebih besar.",
        activityType: "COUNT_SELECT",
        skill: "COUNT_1_20",
        emoji: "🎈",
        max: 20,
        counts: [8, 11, 14, 17, 20],
      },
      {
        title: "Menghitung Dinosaurus",
        description: "Menghitung dinosaurus dengan tema seru.",
        activityType: "COUNT_SELECT",
        skill: "COUNT_1_20",
        emoji: "🦕",
        max: 20,
        counts: [6, 10, 13, 16, 19],
      },
      {
        title: "Mengenal Angka",
        description: "Mengenali angka dan mencocokkan dengan jumlah benda.",
        activityType: "NUMBER_RECOGNITION",
        skill: "NUMBER_RECOGNITION_1_10",
        emoji: "🐠",
        max: 10,
        counts: [2, 4, 5, 7, 9],
      },
      {
        title: "Latihan Berhitung Tambahan",
        description: "Latihan tambahan untuk memperkuat semua keterampilan berhitung.",
        activityType: "COUNT_SELECT",
        skill: "VISUAL_COUNTING",
        emoji: "🍭",
        max: 10,
        counts: [2, 3, 5, 7, 8],
      },
      {
        title: "Urutan Angka Seru",
        description: "Melengkapi angka yang hilang dalam urutan sederhana.",
        activityType: "COUNT_SELECT",
        skill: "COUNT_1_10",
        emoji: "🚂",
        max: 10,
        counts: [2, 5, 8, 4, 7],
        sequence: true,
      },
    ],
  },
  {
    title: "Cara Baru Berlatih",
    lessons: [
      {
        title: "Ketik Jumlahnya",
        description: "Hitung bendanya, lalu ketik angkanya di keypad.",
        activityType: "COUNT_INPUT",
        skill: "COUNT_1_10",
        emoji: "🧁",
        max: 10,
        counts: [2, 4, 5, 7, 9],
      },
      {
        title: "Lingkari Angka yang Benar",
        description: "Hitung bendanya, lalu lingkari angka yang tepat.",
        activityType: "COUNT_CIRCLE",
        skill: "COUNT_1_10",
        emoji: "🎨",
        max: 10,
        counts: [1, 3, 6, 8, 10],
      },
      {
        title: "Seret ke Kotak yang Tepat",
        description: "Seret kumpulan benda ke kotak dengan angka yang cocok.",
        activityType: "DRAG_MATCH",
        skill: "COUNT_1_10",
        emoji: "🦋",
        max: 10,
        counts: [2, 3, 5, 7, 9],
      },
      {
        title: "Jiplak Angka",
        description: "Jiplak setiap angka dengan jari sampai selesai.",
        activityType: "TRACE_NUMBER",
        skill: "NUMBER_RECOGNITION_1_10",
        emoji: "✏️",
        max: 10,
        counts: [1, 2, 3, 4, 5],
      },
    ],
  },
];

const badgeDefs = [
  { code: "FIRST_LESSON", name: "Pelajaran Pertama", description: "Menyelesaikan pelajaran pertama." },
  { code: "COUNTING_STARTER", name: "Pemula Berhitung", description: "Memulai perjalanan belajar berhitung." },
  { code: "FIVE_LESSONS", name: "5 Pelajaran Selesai", description: "Menyelesaikan 5 pelajaran." },
  { code: "COUNTING_CHAMPION", name: "Juara Berhitung", description: "Menyelesaikan seluruh kursus Dasar Berhitung." },
  { code: "PERFECT_LESSON", name: "Pelajaran Sempurna", description: "Menjawab semua soal dengan benar dalam satu pelajaran." },
  { code: "SEVEN_DAY_STREAK", name: "Streak 7 Hari", description: "Belajar 7 hari berturut-turut." },
];

const PUBLISHED: ContentStatus = "PUBLISHED";

async function main() {
  const organization = await db.organization.upsert({
    where: { id: "org-demo-family" },
    update: {},
    create: {
      id: "org-demo-family",
      name: "Demo Family",
      type: "INDIVIDUAL",
    },
  });

  const adminPasswordHash = await bcrypt.hash(DEV_PASSWORD, 10);
  const admin = await db.user.upsert({
    where: { email: "admin@countinglms.dev" },
    update: {},
    create: {
      email: "admin@countinglms.dev",
      name: "Counting LMS Admin",
      passwordHash: adminPasswordHash,
    },
  });
  await db.organizationMember.upsert({
    where: { organizationId_userId: { organizationId: organization.id, userId: admin.id } },
    update: { role: "ADMIN" },
    create: { organizationId: organization.id, userId: admin.id, role: "ADMIN" },
  });

  const parentPasswordHash = await bcrypt.hash(DEV_PASSWORD, 10);
  const parent = await db.user.upsert({
    where: { email: "parent@countinglms.dev" },
    update: {},
    create: {
      email: "parent@countinglms.dev",
      name: "Demo Parent",
      passwordHash: parentPasswordHash,
    },
  });
  await db.organizationMember.upsert({
    where: { organizationId_userId: { organizationId: organization.id, userId: parent.id } },
    update: { role: "PARENT" },
    create: { organizationId: organization.id, userId: parent.id, role: "PARENT" },
  });

  const child = await db.child.upsert({
    where: { id: "child-demo-1" },
    update: {},
    create: {
      id: "child-demo-1",
      organizationId: organization.id,
      parentUserId: parent.id,
      displayName: "Bintang",
      ageBand: "AGE_5_6",
    },
  });

  const course = await db.course.upsert({
    where: { slug: "counting-fundamentals" },
    update: { title: "Dasar Berhitung", subject: "MATH", status: PUBLISHED },
    create: {
      slug: "counting-fundamentals",
      title: "Dasar Berhitung",
      description: "Kursus dasar berhitung untuk anak usia dini.",
      subject: "MATH",
      status: PUBLISHED,
    },
  });

  await db.enrollment.upsert({
    where: { childId_courseId: { childId: child.id, courseId: course.id } },
    update: {},
    create: { childId: child.id, courseId: course.id },
  });

  // Shared counter for buildOptions()'s deterministic answer rotation,
  // used both by the Sains/Bahasa questions below and the numeric Math
  // lessons further down.
  let globalQuestionIndex = 0;

  // --- Sains and Bahasa Inggris courses: separate subjects from Math,
  // using plain-text MULTIPLE_CHOICE questions (not the numeric counting
  // helpers above, since these aren't "count the emoji" questions). ---
  type SimpleQuestionDef = { prompt: string; correct: string; distractors: string[] };

  const scienceQuestions: SimpleQuestionDef[] = [
    { prompt: "Mana yang termasuk tumbuhan?", correct: "Daun", distractors: ["Batu", "Sepatu"] },
    { prompt: "Apa yang kita perlukan untuk bernapas?", correct: "Udara", distractors: ["Air minum", "Apel"] },
    { prompt: "Hewan mana yang bermula sebagai ulat?", correct: "Kupu-kupu", distractors: ["Anjing", "Ikan"] },
  ];

  const languageQuestions: SimpleQuestionDef[] = [
    { prompt: 'Apa arti kata "cat"?', correct: "Kucing", distractors: ["Buku", "Matahari"] },
    { prompt: 'Apa lawan kata "big"?', correct: "Kecil", distractors: ["Cepat", "Biru"] },
    { prompt: 'Kata mana yang berarti "air"?', correct: "Water", distractors: ["Window", "Winter"] },
  ];

  async function seedSimpleCourse(options: {
    slug: string;
    title: string;
    description: string;
    subject: "SCIENCE" | "LANGUAGE";
    moduleTitle: string;
    lessonTitle: string;
    lessonDescription: string;
    skill: Skill;
    questions: SimpleQuestionDef[];
  }) {
    const simpleCourse = await db.course.upsert({
      where: { slug: options.slug },
      update: { title: options.title, subject: options.subject, status: PUBLISHED },
      create: {
        slug: options.slug,
        title: options.title,
        description: options.description,
        subject: options.subject,
        status: PUBLISHED,
      },
    });

    await db.enrollment.upsert({
      where: { childId_courseId: { childId: child.id, courseId: simpleCourse.id } },
      update: {},
      create: { childId: child.id, courseId: simpleCourse.id },
    });

    const simpleModule = await db.courseModule.upsert({
      where: { courseId_position: { courseId: simpleCourse.id, position: 1 } },
      update: { title: options.moduleTitle, status: PUBLISHED },
      create: { courseId: simpleCourse.id, title: options.moduleTitle, position: 1, status: PUBLISHED },
    });

    const simpleLesson = await db.lesson.upsert({
      where: { moduleId_position: { moduleId: simpleModule.id, position: 1 } },
      update: { title: options.lessonTitle, description: options.lessonDescription, status: PUBLISHED },
      create: {
        moduleId: simpleModule.id,
        title: options.lessonTitle,
        description: options.lessonDescription,
        position: 1,
        status: PUBLISHED,
      },
    });

    const simpleActivity = await db.activity.upsert({
      where: { lessonId_position: { lessonId: simpleLesson.id, position: 1 } },
      update: { type: "MULTIPLE_CHOICE", title: options.lessonTitle, status: PUBLISHED },
      create: {
        lessonId: simpleLesson.id,
        type: "MULTIPLE_CHOICE",
        title: options.lessonTitle,
        position: 1,
        difficulty: "EASY",
        status: PUBLISHED,
      },
    });

    for (let q = 0; q < options.questions.length; q++) {
      const def = options.questions[q];
      const { options: builtOptions, correctOptionId } = buildOptions(def.correct, def.distractors, globalQuestionIndex);
      globalQuestionIndex += 1;
      await db.question.upsert({
        where: { activityId_position: { activityId: simpleActivity.id, position: q + 1 } },
        update: {
          skill: options.skill,
          prompt: def.prompt,
          options: builtOptions,
          correctAnswer: { optionId: correctOptionId },
          status: PUBLISHED,
        },
        create: {
          activityId: simpleActivity.id,
          skill: options.skill,
          prompt: def.prompt,
          position: q + 1,
          options: builtOptions,
          correctAnswer: { optionId: correctOptionId },
          status: PUBLISHED,
        },
      });
    }
  }

  await seedSimpleCourse({
    slug: "sains-lihat-lebih-dekat",
    title: "Sains: Lihat Lebih Dekat",
    description: "Mengenal alam sekitar lewat pertanyaan sederhana.",
    subject: "SCIENCE",
    moduleTitle: "Pengamatan Sains",
    lessonTitle: "Kenali Alam Sekitar",
    lessonDescription: "Pertanyaan ringan seputar tumbuhan, hewan, dan tubuh kita.",
    skill: "SCIENCE_BASICS",
    questions: scienceQuestions,
  });

  // --- Warna & Bentuk: one course, two lessons (colors, then shapes) ---
  const colorShapeCourse = await db.course.upsert({
    where: { slug: "warna-dan-bentuk" },
    update: { title: "Warna & Bentuk", subject: "COLORS_SHAPES", status: PUBLISHED },
    create: {
      slug: "warna-dan-bentuk",
      title: "Warna & Bentuk",
      description: "Mengenal warna-warni dan bentuk di sekitar kita.",
      subject: "COLORS_SHAPES",
      status: PUBLISHED,
    },
  });
  await db.enrollment.upsert({
    where: { childId_courseId: { childId: child.id, courseId: colorShapeCourse.id } },
    update: {},
    create: { childId: child.id, courseId: colorShapeCourse.id },
  });
  const colorShapeModule = await db.courseModule.upsert({
    where: { courseId_position: { courseId: colorShapeCourse.id, position: 1 } },
    update: { title: "Warna & Bentuk", status: PUBLISHED },
    create: { courseId: colorShapeCourse.id, title: "Warna & Bentuk", position: 1, status: PUBLISHED },
  });

  const colorQuestions: SimpleQuestionDef[] = [
    { prompt: "🟥\nWarna apa ini?", correct: "Merah", distractors: ["Biru", "Hijau"] },
    { prompt: "🟦\nWarna apa ini?", correct: "Biru", distractors: ["Kuning", "Ungu"] },
    { prompt: "🟩\nWarna apa ini?", correct: "Hijau", distractors: ["Oranye", "Merah muda"] },
    { prompt: "🟨\nWarna apa ini?", correct: "Kuning", distractors: ["Cokelat", "Hitam"] },
    { prompt: "🟪\nWarna apa ini?", correct: "Ungu", distractors: ["Abu-abu", "Putih"] },
  ];
  const shapeQuestions: SimpleQuestionDef[] = [
    { prompt: "◯\nBentuk apa ini?", correct: "Lingkaran", distractors: ["Segitiga", "Persegi"] },
    { prompt: "△\nBentuk apa ini?", correct: "Segitiga", distractors: ["Bintang", "Lingkaran"] },
    { prompt: "□\nBentuk apa ini?", correct: "Persegi", distractors: ["Hati", "Lingkaran"] },
    { prompt: "★\nBentuk apa ini?", correct: "Bintang", distractors: ["Persegi", "Segitiga"] },
    { prompt: "♥\nBentuk apa ini?", correct: "Hati", distractors: ["Bintang", "Lingkaran"] },
  ];

  async function seedColorShapeLesson(position: number, title: string, description: string, skill: Skill, questions: SimpleQuestionDef[]) {
    const lesson = await db.lesson.upsert({
      where: { moduleId_position: { moduleId: colorShapeModule.id, position } },
      update: { title, description, status: PUBLISHED },
      create: { moduleId: colorShapeModule.id, title, description, position, status: PUBLISHED },
    });
    const activity = await db.activity.upsert({
      where: { lessonId_position: { lessonId: lesson.id, position: 1 } },
      update: { type: "MULTIPLE_CHOICE", title, status: PUBLISHED },
      create: { lessonId: lesson.id, type: "MULTIPLE_CHOICE", title, position: 1, difficulty: "EASY", status: PUBLISHED },
    });
    for (let q = 0; q < questions.length; q++) {
      const def = questions[q];
      const { options, correctOptionId } = buildOptions(def.correct, def.distractors, globalQuestionIndex);
      globalQuestionIndex += 1;
      await db.question.upsert({
        where: { activityId_position: { activityId: activity.id, position: q + 1 } },
        update: { skill, prompt: def.prompt, options, correctAnswer: { optionId: correctOptionId }, status: PUBLISHED },
        create: { activityId: activity.id, skill, prompt: def.prompt, position: q + 1, options, correctAnswer: { optionId: correctOptionId }, status: PUBLISHED },
      });
    }
  }

  await seedColorShapeLesson(1, "Kenali Warna", "Menebak nama warna dari kotak warna.", "COLOR_RECOGNITION", colorQuestions);
  await seedColorShapeLesson(2, "Kenali Bentuk", "Menebak nama bentuk dari gambar.", "SHAPE_RECOGNITION", shapeQuestions);

  await seedSimpleCourse({
    slug: "kosa-kata-inggris",
    title: "Kosa Kata Inggris",
    description: "Kata-kata bahasa Inggris dasar untuk anak-anak.",
    subject: "LANGUAGE",
    moduleTitle: "Jejak Kata",
    lessonTitle: "Temukan Kata yang Tepat",
    lessonDescription: "Mengenal arti dan lawan kata sederhana dalam bahasa Inggris.",
    skill: "VOCABULARY_EN",
    questions: languageQuestions,
  });

  // --- Phase 10: a SCHOOL organization with a teacher, a class, and a
  // couple of school-managed children (no parent account of their own —
  // Child.parentUserId is nullable for exactly this case). ---
  const school = await db.organization.upsert({
    where: { id: "org-demo-school" },
    update: {},
    create: { id: "org-demo-school", name: "Demo School", type: "SCHOOL" },
  });

  const teacherPasswordHash = await bcrypt.hash(DEV_PASSWORD, 10);
  const teacher = await db.user.upsert({
    where: { email: "teacher@countinglms.dev" },
    update: {},
    create: {
      email: "teacher@countinglms.dev",
      name: "Demo Teacher",
      passwordHash: teacherPasswordHash,
    },
  });
  await db.organizationMember.upsert({
    where: { organizationId_userId: { organizationId: school.id, userId: teacher.id } },
    update: { role: "TEACHER" },
    create: { organizationId: school.id, userId: teacher.id, role: "TEACHER" },
  });

  const classroom = await db.class.upsert({
    where: { id: "class-demo-a" },
    update: {},
    create: { id: "class-demo-a", organizationId: school.id, name: "Kelas A", teacherUserId: teacher.id },
  });

  const studentDefs = [
    { id: "child-demo-rara", displayName: "Rara", ageBand: "AGE_5_6" as const },
    { id: "child-demo-dimas", displayName: "Dimas", ageBand: "AGE_7_8" as const },
  ];
  for (const studentDef of studentDefs) {
    const student = await db.child.upsert({
      where: { id: studentDef.id },
      update: {},
      create: {
        id: studentDef.id,
        organizationId: school.id,
        parentUserId: null,
        displayName: studentDef.displayName,
        ageBand: studentDef.ageBand,
      },
    });
    await db.classMember.upsert({
      where: { classId_childId: { classId: classroom.id, childId: student.id } },
      update: {},
      create: { classId: classroom.id, childId: student.id },
    });
  }

  for (let m = 0; m < moduleDefs.length; m++) {
    const moduleDef = moduleDefs[m];
    const courseModule = await db.courseModule.upsert({
      where: { courseId_position: { courseId: course.id, position: m + 1 } },
      update: { title: moduleDef.title, status: PUBLISHED },
      create: {
        courseId: course.id,
        title: moduleDef.title,
        position: m + 1,
        status: PUBLISHED,
      },
    });

    for (let l = 0; l < moduleDef.lessons.length; l++) {
      const lessonDef = moduleDef.lessons[l];
      const lesson = await db.lesson.upsert({
        where: { moduleId_position: { moduleId: courseModule.id, position: l + 1 } },
        update: { title: lessonDef.title, description: lessonDef.description, status: PUBLISHED },
        create: {
          moduleId: courseModule.id,
          title: lessonDef.title,
          description: lessonDef.description,
          position: l + 1,
          status: PUBLISHED,
        },
      });

      const activity = await db.activity.upsert({
        where: { lessonId_position: { lessonId: lesson.id, position: 1 } },
        update: { type: lessonDef.activityType, title: lessonDef.title, status: PUBLISHED },
        create: {
          lessonId: lesson.id,
          type: lessonDef.activityType,
          title: lessonDef.title,
          position: 1,
          difficulty: "EASY",
          status: PUBLISHED,
        },
      });

      for (let q = 0; q < lessonDef.counts.length; q++) {
        const count = lessonDef.counts[q];
        const spec = lessonDef.sequence
          ? sequenceQuestion(
              globalQuestionIndex,
              count,
              [count - 1, count, count + 1, count + 2].map((value) => (value > 10 ? value - 4 : value)),
              lessonDef.skill,
            )
          : lessonDef.activityType === "NUMBER_RECOGNITION"
            ? numberRecognitionQuestion(globalQuestionIndex, lessonDef.emoji, count, lessonDef.max, lessonDef.skill)
            : lessonDef.activityType === "MULTIPLE_CHOICE" || lessonDef.activityType === "SAME_AMOUNT"
              ? matchAmountQuestion(
                  globalQuestionIndex,
                  lessonDef.emoji,
                  lessonDef.emoji2 ?? lessonDef.emoji,
                  count,
                  lessonDef.max,
                  lessonDef.skill,
                )
              : lessonDef.activityType === "DRAG_MATCH"
                ? dragMatchQuestion(globalQuestionIndex, lessonDef.emoji, count, lessonDef.max, lessonDef.skill)
                : lessonDef.activityType === "TRACE_NUMBER"
                  ? traceNumberQuestion(count, lessonDef.skill)
                  : lessonDef.activityType === "COUNT_INPUT"
                    ? countInputQuestion(lessonDef.emoji, count, lessonDef.skill)
                    : countSelectQuestion(globalQuestionIndex, lessonDef.emoji, count, lessonDef.max, lessonDef.skill);
        globalQuestionIndex++;

        await db.question.upsert({
          where: { activityId_position: { activityId: activity.id, position: q + 1 } },
          update: {
            skill: spec.skill,
            prompt: spec.prompt,
            options: spec.options,
            correctAnswer: spec.correctAnswer,
            status: PUBLISHED,
          },
          create: {
            activityId: activity.id,
            skill: spec.skill,
            prompt: spec.prompt,
            options: spec.options,
            correctAnswer: spec.correctAnswer,
            position: q + 1,
            status: PUBLISHED,
          },
        });
      }
    }
  }

  for (const badge of badgeDefs) {
    await db.badge.upsert({
      where: { code: badge.code },
      update: { name: badge.name, description: badge.description },
      create: badge,
    });
  }

  await db.subscription.upsert({
    where: { organizationId: organization.id },
    update: {},
    create: { organizationId: organization.id, plan: "FREE", status: "ACTIVE" },
  });

  console.log("Seed complete:");
  console.log(`  Organization: ${organization.name} (${organization.id})`);
  console.log(`  Admin login:  admin@countinglms.dev / ${DEV_PASSWORD}`);
  console.log(`  Parent login: parent@countinglms.dev / ${DEV_PASSWORD}`);
  console.log(`  Child:        ${child.displayName} (${child.id})`);
  console.log(`  Course:       ${course.title} — ${moduleDefs.length} modules, ${moduleDefs.reduce((n, m) => n + m.lessons.length, 0)} lessons, ${globalQuestionIndex} questions`);
  console.log(`  Badges:       ${badgeDefs.length}`);
  console.log(`  Teacher login: teacher@countinglms.dev / ${DEV_PASSWORD}`);
  console.log(`  Class:         ${classroom.name} at ${school.name} (${studentDefs.length} students)`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
