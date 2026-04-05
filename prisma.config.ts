import fs from "node:fs";
import path from "node:path";

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

export default {
  datasource: {
    url: databaseUrl,
  },
  migrations: {
    seed: "tsx ./prisma/seed.ts",
  },
};
