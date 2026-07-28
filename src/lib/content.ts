import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type Frontmatter = {
  title: string;
  summary: string;
  part?: string;
  chapter?: number;
  tags?: string[];
  updated?: string;
};

export type Heading = { id: string; text: string };

export type Chapter = Frontmatter & {
  category: string;
  slug: string;
  body: string;
  headings: Heading[];
};

function categoryDir(category: string) {
  return path.join(CONTENT_DIR, category);
}

/**
 * 본문의 `## 제목`을 훑어 목차를 만든다.
 * rehype-slug가 붙이는 id와 같은 규칙(github-slugger)을 쓰므로 링크가 맞는다.
 */
function extractHeadings(body: string): Heading[] {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  let inFence = false;

  for (const line of body.split("\n")) {
    if (line.trimStart().startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const m = /^##\s+(.+?)\s*$/.exec(line);
    if (m) headings.push({ id: slugger.slug(m[1]), text: m[1] });
  }
  return headings;
}

export function getChapter(category: string, slug: string): Chapter | null {
  const file = path.join(categoryDir(category), `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;

  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  return {
    ...(data as Frontmatter),
    category,
    slug,
    body: content,
    headings: extractHeadings(content),
  };
}

/** 한 분야의 글 목록. chapter 번호 → 제목 순으로 정렬한다. */
export function getChapters(category: string): Chapter[] {
  const dir = categoryDir(category);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => getChapter(category, f.replace(/\.mdx$/, "")))
    .filter((c): c is Chapter => c !== null)
    .sort((a, b) => {
      const d = (a.chapter ?? Infinity) - (b.chapter ?? Infinity);
      return d !== 0 ? d : a.title.localeCompare(b.title, "ko");
    });
}

/** 정적 생성용 — content 폴더 전체를 훑는다. */
export function getAllChapterParams() {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  return fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .flatMap((d) =>
      getChapters(d.name).map((c) => ({ category: c.category, slug: c.slug }))
    );
}

/** 같은 분야 안에서의 이전 / 다음 글. */
export function getNeighbours(category: string, slug: string) {
  const all = getChapters(category);
  const i = all.findIndex((c) => c.slug === slug);
  return {
    prev: i > 0 ? all[i - 1] : null,
    next: i >= 0 && i < all.length - 1 ? all[i + 1] : null,
  };
}
