import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, getCategory } from "@/lib/categories";
import { getChapters } from "@/lib/content";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const c = getCategory(category);
  return c ? { title: c.title, description: c.desc } : {};
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();

  const chapters = getChapters(category);

  // 같은 Part끼리 묶는다. 이미 chapter 번호순이라 연속 구간으로 모으면 된다.
  const groups: { part: string; items: typeof chapters }[] = [];
  for (const c of chapters) {
    const part = c.part ?? "기타";
    const last = groups.at(-1);
    if (last?.part === part) last.items.push(c);
    else groups.push({ part, items: [c] });
  }

  return (
    <>
      <header className="masthead">
        <div className="wrap">
          <p className="booktitle">CS Notes</p>
          <h1>{cat.title}</h1>
          <p className="sub">{cat.desc}</p>
        </div>
      </header>

      <section className="chapter">
        <div className="wrap">
          {chapters.length === 0 ? (
            <>
              <p className="eyebrow">0편</p>
              <p>아직 정리된 글이 없습니다.</p>
            </>
          ) : (
            groups.map((g) => (
              <div className="partgroup" key={g.part}>
                <p className="eyebrow">
                  {g.part} · {g.items.length}편
                </p>
                <ul className="cards">
                  {g.items.map((c) => (
                    <li key={c.slug}>
                      <Link className="card" href={`/${category}/${c.slug}`}>
                        <span className="card-no">
                          {c.chapter ? String(c.chapter).padStart(2, "0") : "—"}
                        </span>
                        <span>
                          <span className="card-title">{c.title}</span>
                          <p className="card-desc">{c.summary}</p>
                          {c.tags?.length ? (
                            <span className="card-tags">
                              {c.tags.map((t) => (
                                <span key={t}>{t}</span>
                              ))}
                            </span>
                          ) : null}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
}
