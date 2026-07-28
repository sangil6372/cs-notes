"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/content";

/**
 * 목차는 서버에서 이미 렌더된 상태로 온다(깜빡임 없음).
 * 여기서는 지금 읽고 있는 절만 표시해 준다.
 */
export function ChapterToc({
  label,
  headings,
}: {
  label: string;
  headings: Heading[];
}) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!headings.length) return;

    const targets = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-15% 0px -75% 0px" }
    );

    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [headings]);

  if (!headings.length) return null;

  return (
    <aside className="toc" aria-label="이 글의 목차">
      <p>{label}</p>
      <ol>
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              aria-current={active === h.id ? "true" : undefined}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </aside>
  );
}
