import "dotenv/config";
import { PrismaClient, QuestionType } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const hashedPassword = await bcrypt.hash("admin1234", 12);

  await prisma.user.upsert({
    where: { email: "admin@cal.edu" },
    update: { role: "ADMIN" },
    create: {
      name: "Admin User",
      email: "admin@cal.edu",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  const topic = await prisma.topic.upsert({
    where: { id: "topic-photosynthesis" },
    update: {},
    create: {
      id: "topic-photosynthesis",
      title: "Photosynthesis",
      description:
        "Learn how plants make their own food using sunlight, water, and carbon dioxide.",
      duration: "20 mins",
      order: 1,
    },
  });

  await prisma.lesson.upsert({
    where: { id: "lesson-photo-1" },
    update: {},
    create: {
      id: "lesson-photo-1",
      topicId: topic.id,
      order: 1,
      content: `## What is Photosynthesis?

Photosynthesis is the process by which green plants use sunlight to produce nutrients from carbon dioxide and water.`,
    },
  });

  const keyTerms = [
    {
      id: "kt-1",
      englishTerm: "Photosynthesis",
      igboTerm: "Ọrụ Anyanwụ",
      igboExplanation: "Usoro nke osisi si eme nri ha site n'ọkụ anyanwụ",
    },
    {
      id: "kt-2",
      englishTerm: "Chlorophyll",
      igboTerm: "Mgbara Ndụ Osisi",
      igboExplanation: "Ihe ndụ dị n'osisi nke na-enye ha agba ndụ",
    },
    {
      id: "kt-3",
      englishTerm: "Carbon Dioxide",
      igboTerm: "Ikuku Carbon",
      igboExplanation: "Ikuku nke mmadụ na ụmụ anụmanụ na-eku ume pụọ",
    },
  ];

  for (const term of keyTerms) {
    await prisma.keyTerm.upsert({
      where: { id: term.id },
      update: {},
      create: { ...term, topicId: topic.id },
    });
  }

  const questions = [
    {
      id: "q-1",
      type: QuestionType.MCQ,
      questionText:
        "Where does photosynthesis primarily take place in a plant?",
      options: ["Mitochondria", "Nucleus", "Chloroplast", "Cell Wall"],
      correctAnswer: "Chloroplast",
      feedbackRules: {
        defaultFeedback: "Photosynthesis occurs in chloroplasts.",
      },
    },
    {
      id: "q-2",
      type: QuestionType.TRUE_FALSE,
      questionText:
        "Photosynthesis produces carbon dioxide as its main output.",
      options: ["True", "False"],
      correctAnswer: "False",
      feedbackRules: {
        defaultFeedback: "Photosynthesis produces oxygen and glucose.",
      },
    },
  ];

  for (const q of questions) {
    await prisma.question.upsert({
      where: { id: q.id },
      update: {},
      create: { ...q, topicId: topic.id },
    });
  }

  console.log("Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
