import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { getCategory } from "@/lib/categories";
import { getAllChapterParams, getChapter, getNeighbours } from "@/lib/content";
import { ChapterToc } from "@/components/ChapterToc";
import { mdxComponents } from "@/components/mdx";

export function generateStaticParams() {
  return getAllChapterParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const ch = getChapter(category, slug);
  return ch ? { title: ch.title, description: ch.summary } : {};
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const cat = getCategory(category);
  const ch = getChapter(category, slug);
  if (!cat || !ch) notFound();

  const { prev, next } = getNeighbours(category, slug);
  const eyebrow = [cat.title, ch.part, ch.chapter ? `${ch.chapter}장` : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <ChapterToc label={ch.part ?? cat.title} headings={ch.headings} />

      <article className="chapter">
        <div className="wrap">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{ch.title}</h1>
          <p className="lead">{ch.summary}</p>

          <MDXRemote
            source={ch.body}
            components={mdxComponents}
            options={{
              // v6부터 기본으로 켜져 있는 blockJS는 MDX 안의 모든 JS 표현식을
              // 지운다. 도식에 넘기는 steps={[...]} 같은 props까지 사라지므로 끈다.
              // 본문은 우리가 직접 쓴 content/ 파일뿐이고, 위험한 호출을 걸러내는
              // blockDangerousJS는 그대로 켜져 있다.
              blockJS: false,
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [rehypeSlug],
              },
            }}
          />

          <nav className="pager">
            {prev ? (
              <Link href={`/${category}/${prev.slug}`}>
                <span className="dir">이전</span>
                <span className="t">{prev.title}</span>
              </Link>
            ) : null}
            {next ? (
              <Link className="fwd" href={`/${category}/${next.slug}`}>
                <span className="dir">다음</span>
                <span className="t">{next.title}</span>
              </Link>
            ) : null}
          </nav>
        </div>
      </article>
    </>
  );
}
