# 컴퓨터 전공지식

외우는 대신 이유를 따라가는 CS 노트. 네트워크에서 시작해 운영체제, 컴퓨터구조,
데이터베이스로 넓혀 갑니다.

```bash
npm run dev     # http://localhost:3000
npm run build   # 정적 생성 확인
```

## 글 하나 추가하기

`content/<분야>/<슬러그>.mdx` 파일 하나만 만들면 끝입니다. 목록 페이지, 목차,
이전/다음 링크, 메타태그는 전부 자동으로 붙습니다.

```mdx
---
title: DNS는 어떻게 구글을 찾을까?
summary: 한 줄 요약. 목록과 본문 리드 문단에 그대로 쓰입니다.
part: Part 3
chapter: 18
tags: [DNS, 재귀 질의, TTL]
updated: "2026-08-01"
---

## 첫 번째 절

본문. `##`(h2)이 왼쪽 목차에 올라갑니다.
```

프론트매터 주의사항 두 가지:

- 값 안에 `"`나 `:`가 들어가면 전체를 작은따옴표로 감싸세요.
- 날짜는 따옴표로 감싸야 문자열로 남습니다. 안 그러면 Date 객체가 됩니다.

새 분야를 추가하려면 `src/lib/categories.ts`에 한 줄 넣으면 됩니다. 글이 없으면
첫 화면에 "준비 중"으로 표시됩니다.

## 도식 컴포넌트

`src/components/diagrams.tsx`에 정의돼 있고, MDX에서 import 없이 바로 씁니다.
전부 CSS로 그려서 이미지가 없습니다 — 다크 모드에서도 그대로 보입니다.

| 컴포넌트 | 쓰임 |
| --- | --- |
| `<Flag dir="out\|in">FIN</Flag>` | 본문 안의 프로토콜 플래그 |
| `<Said lines={[{who, text}]} />` | 대화체 |
| `<Seq steps={[{flag, dir, note}]} />` | 시퀀스 다이어그램 |
| `<Duplex send="closed" />` | 양방향 통로 (Half Close) |
| `<Growth values={[1,2,4,8]} />` | 지수 증가 막대 |
| `<WindowSize rows={[{filled, total, label}]} />` | 윈도우 크기 |
| `<Stacks left={{title, layers, highlight}} right={...} />` | 프로토콜 스택 비교 |
| `<Life items={[{what, how}]} />` | 번호가 실제 순서를 뜻할 때만 |
| `<Journey items={[...]} />` | 지금까지의 여정 체인 |
| `<Key>`, `<Deeper>`, `<NextUp>` | 핵심 정리 / 보충 / 다음 장 예고 |

새 도식을 만들면 `diagrams.tsx`에서 export만 하면 MDX에 자동 노출됩니다
(`src/components/mdx.tsx`가 모듈 전체를 펼쳐서 넘깁니다).

### 색을 두 개만 쓰는 이유

`--dir-out`(파랑)은 보내는 방향, `--dir-in`(주황)은 받는 방향입니다. 장식이
아니라 의미이므로, 방향과 무관한 곳에 쓰지 마세요.

## 디자인

전부 `src/app/globals.css` 한 파일에 있고 CSS 변수로 토큰화돼 있습니다.
라이트/다크 양쪽 다 정의돼 있으며, OS 설정을 따르다가 사용자가 테마 버튼을
누르면 그 선택이 `localStorage`에 남습니다.

한글 웹폰트는 용량이 커서 넣지 않았습니다. 본문은 시스템 고딕, 책 제목처럼
분위기가 필요한 곳만 바탕(명조) 계열을 씁니다. 나중에 Pretendard를 self-host
하려면 `--sans`만 바꾸면 됩니다.

## /api/ask

읽던 글을 근거로 질문에 답하는 엔드포인트입니다. 아직 화면은 붙이지
않았습니다. `.env.example`을 `.env.local`로 복사하고 `OPENAI_API_KEY`를 넣으면
켜지고, 키가 없으면 503으로 조용히 꺼져 있습니다.

```bash
curl -X POST http://localhost:3000/api/ask \
  -H "Content-Type: application/json" \
  -d '{"category":"network","slug":"tcp-quic","question":"HOL이 뭐야?"}'
```

## reference/

`reference/2026-07-28-part2-tcp-snapshot.html`은 이 사이트로 옮기기 전에 만든
단일 HTML 파일입니다. 기록용이고 빌드에는 관여하지 않습니다.
