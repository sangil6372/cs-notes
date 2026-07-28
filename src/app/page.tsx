import Link from "next/link";
import { categories } from "@/lib/categories";
import { getChapters } from "@/lib/content";

export default function Home() {
  const rows = categories.map((c) => ({
    ...c,
    count: getChapters(c.slug).length,
  }));

  return (
    <>
      <header className="masthead">
        <div className="wrap">
          <p className="booktitle">CS Notes</p>
          <h1>
            외우는 대신
            <br />
            이유를 따라간다
          </h1>
          <p className="sub">
            시험에 나오는 정답이 아니라, 왜 그렇게 설계됐는지를 따라가며
            정리하는 노트. 하나의 이야기로 이어지도록 씁니다.
          </p>
        </div>
      </header>

      <section className="chapter">
        <div className="wrap">
          <p className="eyebrow">분야</p>
          <ul className="cards">
            {rows.map((c) => {
              const inner = (
                <>
                  <span className="card-no">
                    {c.count > 0 ? `${c.count}편` : "—"}
                  </span>
                  <span>
                    <span className="card-title">
                      {c.title}
                      {c.count === 0 ? (
                        <span className="soon-badge">준비 중</span>
                      ) : null}
                    </span>
                    <p className="card-desc">{c.desc}</p>
                  </span>
                </>
              );

              return (
                <li key={c.slug} className={c.count === 0 ? "soon" : undefined}>
                  {c.count > 0 ? (
                    <Link className="card" href={`/${c.slug}`}>
                      {inner}
                    </Link>
                  ) : (
                    <div className="card">{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
