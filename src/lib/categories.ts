/**
 * 사이트의 대분류. 아직 글이 없는 분야도 여기 적어두면
 * 첫 화면에 "준비 중"으로 표시된다 — 앞으로 뭘 쓸지가 곧 목차다.
 */
export type Category = {
  slug: string;
  title: string;
  desc: string;
};

export const categories: Category[] = [
  {
    slug: "network",
    title: "네트워크",
    desc: "전기 신호 한 줄이 웹페이지가 되기까지. TCP, DNS, CDN, HTTPS.",
  },
  {
    slug: "os",
    title: "운영체제",
    desc: "프로세스와 스레드, 스케줄링, 메모리, 파일 시스템, 동기화.",
  },
  {
    slug: "architecture",
    title: "컴퓨터구조",
    desc: "CPU 파이프라인, 캐시, 메모리 계층, 저장장치.",
  },
  {
    slug: "database",
    title: "데이터베이스",
    desc: "인덱스, 트랜잭션, 격리 수준, 실행 계획, 락.",
  },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}
