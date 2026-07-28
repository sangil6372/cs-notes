import type { Metadata } from "next";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "컴퓨터 전공지식",
    template: "%s · 컴퓨터 전공지식",
  },
  description:
    "외우는 대신 이유를 따라가는 CS 노트. 네트워크, 운영체제, 컴퓨터구조, 데이터베이스.",
};

/**
 * 첫 페인트 전에 저장된 테마를 적용한다.
 * 이게 없으면 다크 모드 사용자에게 흰 화면이 한 번 번쩍인다.
 */
const noFlashTheme = `try{var t=localStorage.getItem('theme');if(t==='dark'||t==='light')document.documentElement.setAttribute('data-theme',t)}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashTheme }} />
      </head>
      <body>
        <a className="skip" href="#main">
          본문으로 건너뛰기
        </a>

        <nav className="topbar">
          <div className="wrap">
            <Link className="brand" href="/">
              컴퓨터 전공지식
            </Link>
            <div className="spacer" />
            <ThemeToggle />
          </div>
        </nav>

        <div id="main">{children}</div>

        <footer className="sitefoot">
          <div className="wrap">
            <p>외우는 대신 이유를 따라가는 CS 노트.</p>
            <p>“더 깊이” 항목은 원문 정리에 덧붙인 보충 설명입니다.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
