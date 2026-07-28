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
          <p className="eyebrow">{chapters.length}편</p>
          {chapters.length === 0 ? (
            <p>아직 정리된 글이 없습니다.</p>
          ) : (
            <ul className="cards">
              {chapters.map((c) => (
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
          )}
        </div>
      </section>
    </>
  );
}
