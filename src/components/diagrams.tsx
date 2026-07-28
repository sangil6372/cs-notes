import type { ReactNode } from "react";

/**
 * 본문에서 쓰는 도식 컴포넌트 모음.
 * 색은 두 개뿐이고 둘 다 의미가 있다 — out은 보내는 방향, in은 받는 방향.
 */

type Dir = "out" | "in";

/* ── 인라인 프로토콜 플래그 ─────────────────────── */
export function Flag({
  dir = "out",
  children,
}: {
  dir?: Dir;
  children: ReactNode;
}) {
  return <span className={`flag ${dir}`}>{children}</span>;
}

/* ── 대화체 ─────────────────────────────────────── */
export function Said({
  lines,
}: {
  lines: { who?: string; text: string }[];
}) {
  return (
    <div className="said">
      {lines.map((l, i) => (
        <p key={i}>
          {l.who ? <span className="who">{l.who}</span> : null}
          {l.text}
        </p>
      ))}
    </div>
  );
}

/* ── 시퀀스 다이어그램 ──────────────────────────── */
export function Seq({
  left = "내 PC",
  right = "서버",
  steps,
  end,
  caption,
}: {
  left?: string;
  right?: string;
  steps: { flag: string; dir: Dir; note?: string }[];
  end?: string;
  caption?: string;
}) {
  return (
    <figure>
      <div className="seq">
        <div className="seq-heads">
          <span>{left}</span>
          <span>{right}</span>
        </div>
        <div className="seq-body">
          {steps.map((s, i) => (
            <div key={i} className={s.dir === "in" ? "step rx" : "step"}>
              <span className="label">{s.flag}</span>
              <span className="wire" />
              {s.note ? <span className="note">{s.note}</span> : null}
            </div>
          ))}
        </div>
        {end ? <p className="seq-end">{end}</p> : null}
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

/* ── 양방향 통로 (Half Close 설명용) ────────────── */
export function Duplex({
  left = "내 PC",
  right = "서버",
  send = "open",
  recv = "open",
  caption,
}: {
  left?: string;
  right?: string;
  send?: "open" | "closed";
  recv?: "open" | "closed";
  caption?: string;
}) {
  return (
    <figure>
      <div className="duplex">
        <div className={`lane${send === "closed" ? " closed" : ""}`}>
          <span className="end">{left}</span>
          <span className="track" />
          <span className="end">{right}</span>
        </div>
        <div className={`lane rx${recv === "closed" ? " closed" : ""}`}>
          <span className="end">{left}</span>
          <span className="track" />
          <span className="end">{right}</span>
        </div>
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

/* ── 지수 증가 (Slow Start) ─────────────────────── */
export function Growth({
  values,
  caption,
}: {
  values: number[];
  caption?: string;
}) {
  const max = Math.max(...values);
  return (
    <figure>
      <div className="growth">
        {values.map((v, i) => (
          <div className="row" key={i}>
            <span className="n">{v}</span>
            <span className="bar" style={{ width: `${(v / max) * 100}%` }} />
          </div>
        ))}
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

/* ── 윈도우 크기 ────────────────────────────────── */
export function WindowSize({
  rows,
  caption,
}: {
  rows: { filled: number; total: number; label: string }[];
  caption?: string;
}) {
  return (
    <figure>
      <div className="window">
        {rows.map((r, i) => (
          <div key={i}>
            <div className="cells">
              {Array.from({ length: r.total }, (_, c) => (
                <i key={c} className={c < r.filled ? "on" : undefined} />
              ))}
            </div>
            <p className="cap">{r.label}</p>
          </div>
        ))}
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

/* ── 프로토콜 스택 비교 ─────────────────────────── */
type StackSpec = { title: string; layers: string[]; highlight?: string };

export function Stacks({ left, right }: { left: StackSpec; right: StackSpec }) {
  return (
    <div className="stacks">
      {[left, right].map((s, i) => (
        <div className="stack" key={i}>
          <p className="title">{s.title}</p>
          <ol>
            {s.layers.map((l) => (
              <li key={l} className={l === s.highlight ? "hl" : undefined}>
                {l}
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}

/* ── 단계 목록 (번호가 실제 순서를 뜻할 때만) ───── */
export function Life({
  items,
}: {
  items: { what: string; how: string }[];
}) {
  return (
    <ol className="life">
      {items.map((it, i) => (
        <li key={i}>
          <span className="num">{i + 1}</span>
          <span>
            <span className="what">{it.what}</span>
            <span className="how">{it.how}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

/* ── 지금까지의 여정 ────────────────────────────── */
export function Journey({ items }: { items: string[] }) {
  return (
    <div className="journey">
      {items.map((it, i) => (
        <span key={it} style={{ display: "contents" }}>
          <b className={i === items.length - 1 ? "last" : undefined}>{it}</b>
          {i < items.length - 1 ? <i>›</i> : null}
        </span>
      ))}
    </div>
  );
}

/* ── 콜아웃 ─────────────────────────────────────── */
export function Key({ children }: { children: ReactNode }) {
  return (
    <aside className="key">
      <span className="tag">오늘의 핵심</span>
      {children}
    </aside>
  );
}

export function Deeper({ children }: { children: ReactNode }) {
  return (
    <aside className="deeper">
      <span className="tag">더 깊이</span>
      {children}
    </aside>
  );
}

export function NextUp({
  label = "다음 장",
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  return (
    <aside className="nextup">
      <span className="tag">{label}</span>
      {children}
    </aside>
  );
}
