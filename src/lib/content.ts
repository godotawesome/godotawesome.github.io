import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import authorsData from "../../content/authors.json";
import { SITE } from "./site";
import { slugify } from "./slugify";

const postsDirectory = path.join(process.cwd(), "content/posts");
const pagesDirectory = path.join(process.cwd(), "content/pages");

export type Author = {
  name: string;
  display_name: string;
  avatar: string;
  email?: string;
  web?: string;
  twitter?: string;
  description: string;
};

export type PostFrontmatter = {
  title: string;
  author?: string;
  categories?: string[];
  tags?: string[];
  image?: string;
  description?: string;
  featured?: boolean;
  hidden?: boolean;
  draft?: boolean;
  date?: string;
  updated?: string | Date;
};

export type Post = {
  slug: string;
  title: string;
  date: string;
  updated?: string;
  author?: string;
  categories: string[];
  tags: string[];
  image?: string;
  description: string;
  featured: boolean;
  excerpt: string;
  content: string;
};

export type PageDoc = {
  slug: string;
  title: string;
  description?: string;
  content: string;
};

const POST_FILENAME_RE = /^(\d{4}-\d{1,2}-\d{1,2})-(.+)\.md$/i;

export function getAuthors(): Record<string, Author> {
  return authorsData as Record<string, Author>;
}

export function getAuthor(id?: string): Author | undefined {
  if (!id) return undefined;
  return getAuthors()[id];
}

function parsePostFilename(filename: string): { date: string; slug: string } | null {
  const match = filename.match(POST_FILENAME_RE);
  if (!match) return null;
  const [, rawDate, slug] = match;
  const parts = rawDate.split("-").map((p) => p.padStart(2, "0"));
  const date = `${parts[0]}-${parts[1]}-${parts[2]}`;
  return { date, slug };
}

function toStringArray(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim()).filter(Boolean);
  }
  return String(value)
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

/** Ensure local image paths are root-absolute; leave remote URLs untouched. */
function normalizeImage(src?: string): string | undefined {
  if (!src) return undefined;
  if (/^https?:\/\//i.test(src) || src.startsWith("data:")) return src;
  return src.startsWith("/") ? src : `/${src}`;
}

/** YAML dates arrive as Date objects; normalise to YYYY-MM-DD. */
function toDateString(value: unknown): string | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

function stripMarkdown(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/[#>*_~|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isPublished(data: PostFrontmatter, fileDate: string): boolean {
  if (data.draft === true) return false;
  if (data.hidden === true) return false;
  const dateStr = data.date ? String(data.date).slice(0, 10) : fileDate;
  const postTime = Date.parse(dateStr);
  if (Number.isNaN(postTime)) return false;
  const now = Date.now();
  return postTime <= now;
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(postsDirectory)) return [];
  const files = fs.readdirSync(postsDirectory).filter((f) => f.endsWith(".md"));
  const posts: Post[] = [];

  for (const filename of files) {
    const parsed = parsePostFilename(filename);
    if (!parsed) continue;
    const fullPath = path.join(postsDirectory, filename);
    const raw = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(raw);
    const fm = data as PostFrontmatter;
    if (!isPublished(fm, parsed.date)) continue;

    const date = fm.date ? String(fm.date).slice(0, 10) : parsed.date;
    const excerptSource = stripMarkdown(content);
    const words = excerptSource.split(/\s+/).slice(0, 30).join(" ");

    posts.push({
      slug: parsed.slug,
      title: fm.title || parsed.slug,
      date,
      updated: toDateString(fm.updated),
      author: fm.author,
      categories: toStringArray(fm.categories),
      tags: toStringArray(fm.tags),
      image: normalizeImage(fm.image),
      description: fm.description || words,
      featured: fm.featured === true,
      excerpt: words,
      content,
    });
  }

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function getFeaturedPosts(): Post[] {
  return getAllPosts().filter((p) => p.featured);
}

export function getPaginatedPosts(page: number): {
  posts: Post[];
  totalPages: number;
  currentPage: number;
} {
  const all = getAllPosts();
  const totalPages = Math.max(1, Math.ceil(all.length / SITE.postsPerPage));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * SITE.postsPerPage;
  return {
    posts: all.slice(start, start + SITE.postsPerPage),
    totalPages,
    currentPage,
  };
}

export function getAllCategories(): { name: string; slug: string; posts: Post[] }[] {
  const map = new Map<string, Post[]>();
  for (const post of getAllPosts()) {
    for (const cat of post.categories) {
      const list = map.get(cat) ?? [];
      list.push(post);
      map.set(cat, list);
    }
  }
  return Array.from(map.entries())
    .map(([name, posts]) => ({ name, slug: slugify(name), posts }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getAllTags(): { name: string; slug: string; posts: Post[] }[] {
  const map = new Map<string, Post[]>();
  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      const list = map.get(tag) ?? [];
      list.push(post);
      map.set(tag, list);
    }
  }
  return Array.from(map.entries())
    .map(([name, posts]) => ({ name, slug: slugify(name), posts }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getCategoryBySlug(slug: string) {
  return getAllCategories().find((c) => c.slug === slug);
}

export function getPostsByAuthor(authorId: string): Post[] {
  return getAllPosts().filter((p) => p.author === authorId);
}

export function getAdjacentPosts(slug: string): {
  prev?: Post;
  next?: Post;
} {
  const all = getAllPosts();
  const index = all.findIndex((p) => p.slug === slug);
  if (index === -1) return {};
  return {
    next: all[index - 1],
    prev: all[index + 1],
  };
}

export async function renderMarkdown(markdown: string): Promise<string> {
  const file = await remark()
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypePrettyCode, {
      theme: "github-light",
      keepBackground: false,
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);
  return String(file);
}

/** Insert an HTML marker after the Nth H2 for mid-article ads. */
export function insertAfterNthHeading(
  html: string,
  n: number,
  marker: string,
): string {
  let count = 0;
  return html.replace(/<\/h2>/gi, (match) => {
    count += 1;
    if (count === n) return `${match}${marker}`;
    return match;
  });
}

export function getPageBySlug(slug: string): PageDoc | undefined {
  const fullPath = path.join(pagesDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return undefined;
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: String(data.title ?? slug),
    description: data.description ? String(data.description) : undefined,
    content,
  };
}

export function getSearchDocuments() {
  const posts = getAllPosts().map((p) => ({
    id: p.slug,
    url: `/${p.slug}/`,
    title: p.title,
    body: `${p.description} ${stripMarkdown(p.content).slice(0, 500)}`,
  }));
  return posts;
}
