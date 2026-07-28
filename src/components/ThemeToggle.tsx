"use client";

/** 저장된 선택이 없으면 OS 설정을 따르고, 누르면 그 반대로 고정한다. */
export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    let current = root.getAttribute("data-theme");
    if (current !== "dark" && current !== "light") {
      current = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* 시크릿 모드 등에서 localStorage 접근이 막힌 경우 — 무시 */
    }
  }

  return (
    <button className="tbtn" type="button" onClick={toggle}>
      테마
    </button>
  );
}
