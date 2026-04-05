import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

function readEnvValue(key: string) {
  const candidateFiles = [".env.local", ".env"];

  for (const fileName of candidateFiles) {
    const filePath = path.join(process.cwd(), fileName);
    if (!fs.existsSync(filePath)) {
      continue;
    }

    const content = fs.readFileSync(filePath, "utf8");
    const line = content
      .split(/\r?\n/)
      .find((entry) => entry.trim().startsWith(`${key}=`));

    if (line) {
      return line.slice(line.indexOf("=") + 1).trim();
    }
  }

  return undefined;
}

const databaseUrl = process.env.DATABASE_URL ?? readEnvValue("DATABASE_URL");

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set for seeding.");
}

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

const examBoards = ["AQA", "Edexcel", "OCR", "WJEC", "CCEA"];

const subjects = [
  { title: "Mathematics", slug: "mathematics", examBoard: "AQA", color: "#3B82F6", description: "GCSE Mathematics - Core mathematical concepts and problem solving" },
  { title: "English Language", slug: "english-language", examBoard: "AQA", color: "#EF4444", description: "GCSE English Language - Reading, writing, and communication skills" },
  { title: "English Literature", slug: "english-literature", examBoard: "Edexcel", color: "#DC2626", description: "GCSE English Literature - Literary analysis and essay writing" },
  { title: "Biology", slug: "biology", examBoard: "AQA", color: "#10B981", description: "GCSE Biology - Study of living organisms and life processes" },
  { title: "Chemistry", slug: "chemistry", examBoard: "Edexcel", color: "#F59E0B", description: "GCSE Chemistry - Atomic structure, bonding, and reactions" },
  { title: "Physics", slug: "physics", examBoard: "OCR", color: "#8B5CF6", description: "GCSE Physics - Energy, forces, and electromagnetism" },
  { title: "Combined Science", slug: "combined-science", examBoard: "AQA", color: "#06B6D4", description: "GCSE Combined Science - All three sciences combined" },
  { title: "Geography", slug: "geography", examBoard: "Edexcel", color: "#14B8A6", description: "GCSE Geography - Physical and human geography" },
  { title: "History", slug: "history", examBoard: "AQA", color: "#6B7280", description: "GCSE History - Analysis of significant historical periods" },
  { title: "Religious Studies", slug: "religious-studies", examBoard: "OCR", color: "#D946EF", description: "GCSE Religious Studies - Beliefs, ethics, and philosophy" },
  { title: "French", slug: "french", examBoard: "AQA", color: "#1E40AF", description: "GCSE French - Speaking, reading, listening, and writing" },
  { title: "Spanish", slug: "spanish", examBoard: "Edexcel", color: "#DC2626", description: "GCSE Spanish - Hispanic language and culture" },
  { title: "German", slug: "german", examBoard: "OCR", color: "#1E3A8A", description: "GCSE German - German language communication" },
  { title: "Computer Science", slug: "computer-science", examBoard: "AQA", color: "#0891B2", description: "GCSE Computer Science - Programming and computational thinking" },
  { title: "Digital Media", slug: "digital-media", examBoard: "Edexcel", color: "#6366F1", description: "GCSE Digital Media - Media production and analysis" },
  { title: "Art and Design", slug: "art-design", examBoard: "AQA", color: "#EC4899", description: "GCSE Art and Design - Visual arts and creative practice" },
  { title: "Music", slug: "music", examBoard: "Edexcel", color: "#F43F5E", description: "GCSE Music - Composition, performance, and music theory" },
  { title: "Drama", slug: "drama", examBoard: "OCR", color: "#A855F7", description: "GCSE Drama - Theatre performance and dramatic techniques" },
  { title: "Physical Education", slug: "physical-education", examBoard: "AQA", color: "#06B6D4", description: "GCSE PE - Sport, health, and fitness concepts" },
  { title: "Health and Social Care", slug: "health-social-care", examBoard: "Edexcel", color: "#EC4899", description: "GCSE Health and Social Care - Care systems and wellbeing" },
  { title: "Business Studies", slug: "business-studies", examBoard: "AQA", color: "#7C3AED", description: "GCSE Business Studies - Enterprise and business management" },
  { title: "Economics", slug: "economics", examBoard: "Edexcel", color: "#059669", description: "GCSE Economics - Economic systems and principles" },
  { title: "Design and Technology", slug: "design-technology", examBoard: "OCR", color: "#EA580C", description: "GCSE Design and Technology - Product design and engineering" },
  { title: "Construction", slug: "construction", examBoard: "Edexcel", color: "#B45309", description: "GCSE Construction - Building techniques and site management" },
  { title: "Engineering", slug: "engineering", examBoard: "AQA", color: "#92400E", description: "GCSE Engineering - Engineering principles and practice" },
  { title: "Media Studies", slug: "media-studies", examBoard: "WJEC", color: "#DC2626", description: "GCSE Media Studies - Media analysis and production" },
  { title: "Classics", slug: "classics", examBoard: "AQA", color: "#4B5563", description: "GCSE Classics - Ancient Greece and Rome" },
  { title: "Environmental Science", slug: "environmental-science", examBoard: "Edexcel", color: "#15803D", description: "GCSE Environmental Science - Ecology and sustainability" },
];

async function main() {
  console.log("🌱 Starting database seeding...\n");

  for (const board of examBoards) {
    await prisma.examBoard.upsert({
      where: { slug: board.toLowerCase() },
      update: { name: board },
      create: {
        name: board,
        slug: board.toLowerCase(),
      },
    });
  }

  console.log("📖 Seeding subjects...");
  for (const subject of subjects) {
    await prisma.subject.upsert({
      where: { slug: subject.slug },
      update: {
        title: subject.title,
        name: subject.title,
        examBoard: subject.examBoard,
        color: subject.color,
        description: subject.description,
      },
      create: {
        title: subject.title,
        slug: subject.slug,
        name: subject.title,
        examBoard: subject.examBoard,
        color: subject.color,
        description: subject.description,
      },
    });
    console.log(`  ✓ ${subject.title}`);
  }

  console.log("\n✨ Seeding complete!");
  console.log(`   • ${examBoards.length} exam boards`);
  console.log(`   • ${subjects.length} subjects`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
