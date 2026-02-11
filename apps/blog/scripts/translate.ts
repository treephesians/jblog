import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import "dotenv/config";

const CONTENT_DIR = path.join(process.cwd(), "content/posts");

const SYSTEM_PROMPT = `You are a professional Korean-to-English translator for a tech blog.

Rules:
- Translate all Korean text to natural, professional English
- Keep ALL code blocks exactly as-is (do not translate code or comments inside code blocks)
- Keep frontmatter YAML structure intact, but translate: title, description
- Keep these frontmatter fields unchanged: date, category, tags, series.name, series.order, thumbnail, featured, draft
- Keep all MDX component syntax unchanged (e.g., <LinkCard />, <Callout />)
- Keep markdown formatting (headings, bold, lists, links, tables) intact
- Translate link text but keep URLs unchanged
- Output ONLY the translated MDX content, no explanations`;

function getMdxFiles(dir: string): { slug: string; filePath: string }[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: { slug: string; filePath: string }[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getMdxFiles(fullPath));
    } else if (entry.name.endsWith(".mdx") && !entry.name.endsWith(".en.mdx")) {
      files.push({
        slug: entry.name.replace(/\.mdx$/, ""),
        filePath: fullPath,
      });
    }
  }

  return files;
}

async function translateFile(
  client: Anthropic,
  filePath: string,
): Promise<string> {
  const content = fs.readFileSync(filePath, "utf-8");

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 8192,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Translate this Korean MDX blog post to English:\n\n${content}`,
      },
    ],
  });

  const block = response.content[0];
  if (block?.type !== "text") {
    throw new Error("Unexpected response type");
  }

  return block.text;
}

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("ANTHROPIC_API_KEY is not set.");
    console.error("Create apps/blog/.env with:");
    console.error("  ANTHROPIC_API_KEY=sk-ant-...");
    process.exit(1);
  }

  const client = new Anthropic({ apiKey });
  const targetSlug = process.argv[2];
  const allFiles = getMdxFiles(CONTENT_DIR);

  const files = targetSlug
    ? allFiles.filter((f) => f.slug === targetSlug)
    : allFiles;

  if (files.length === 0) {
    console.error(
      targetSlug ? `Post not found: ${targetSlug}` : "No MDX files found.",
    );
    process.exit(1);
  }

  console.log(`Translating ${files.length} post(s)...\n`);

  for (const file of files) {
    const enPath = file.filePath.replace(/\.mdx$/, ".en.mdx");

    if (fs.existsSync(enPath)) {
      console.log(`[skip] ${file.slug} (already translated)`);
      continue;
    }

    console.log(`[translating] ${file.slug}...`);

    try {
      const translated = await translateFile(client, file.filePath);
      fs.writeFileSync(enPath, translated, "utf-8");
      console.log(`[done] ${file.slug} → ${path.basename(enPath)}`);
    } catch (err) {
      console.error(`[error] ${file.slug}:`, err);
    }
  }

  console.log("\nAll done!");
}

main();
