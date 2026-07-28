@AGENTS.md

# cs-notes

한국어 CS 학습 노트 사이트. ChatGPT와 대화하며 책 형식(『우리가 매일 쓰는 인터넷은
어떻게 움직이는가』)으로 정리한 내용을 챕터 단위로 싣는다. 네트워크에서 시작해
운영체제·컴퓨터구조·데이터베이스로 확장 중.

Next.js 16 (App Router, Turbopack) · TypeScript · MDX · 손으로 쓴 CSS. Tailwind 없음.

```bash
npm run dev      # 개발
npm run build    # 정적 생성까지 확인 — 변경 후 반드시 통과시킬 것
npm run lint
npx tsc --noEmit
```

## 구조

```
content/<분야>/<슬러그>.mdx   글. 파일 하나 = 페이지 하나
src/lib/categories.ts         분야 목록 (글 0편이면 "준비 중" 표시)
src/lib/content.ts            프론트매터 파싱, 목차 추출, 이전/다음
src/components/diagrams.tsx   본문 도식 — 새 도식은 전부 여기에
src/components/mdx.tsx        위 모듈을 통째로 MDX에 노출
src/app/globals.css           디자인 토큰과 전체 스타일 (단일 파일)
src/app/[category]/[slug]/    글 렌더링
src/app/api/ask/route.ts      GPT 훅. 키 없으면 503으로 꺼져 있음
reference/                    옛 단일 HTML 스냅샷. 빌드와 무관, 수정하지 말 것
```

목차·이전/다음·메타태그·목록은 전부 콘텐츠에서 자동 생성된다. 글을 추가할 때
라우팅이나 인덱스를 손댈 필요가 없다.

## 글 쓰기

프론트매터는 `title`, `summary` 필수. `part`, `chapter`, `tags`, `updated` 선택.
`summary`는 목록과 본문 리드 문단에 그대로 쓰인다.

`##`(h2)만 왼쪽 목차에 올라간다. 절 제목은 h2, 그 안의 소제목은 h3.

### 반드시 지킬 것

**YAML** — 값에 `"`나 `:`가 들어가면 전체를 작은따옴표로 감쌀 것. 날짜는
`updated: "2026-07-28"`처럼 따옴표 필수(안 그러면 Date 객체가 되어 렌더 시 터진다).

**한글 볼드** — 닫는 `**` 앞이 구두점이고 뒤가 한글이면 CommonMark가 닫기로
인정하지 않아 별표가 그대로 노출된다.

```mdx
**TTL(Time To Live)**이다              <!-- 깨짐 -->
<strong>TTL(Time To Live)</strong>이다  <!-- 정상 -->
**기억한다.** 이것이                    <!-- 정상 (뒤가 공백) -->
```

빌드 후 검사: `grep -o '\*\*' .next/server/app/<분야>/<슬러그>.html | wc -l` → 0이어야 한다.

**MDX 안의 JS 표현식** — `next-mdx-remote` v6는 `blockJS`가 기본 on이라 `steps={[...]}`
같은 props를 통째로 지운다. 그래서 `[slug]/page.tsx`에서 `blockJS: false`로 껐다.
이 옵션을 되돌리면 모든 도식이 조용히 빈 채로 렌더된다.

### 문체

짧은 문단, 비유 먼저 개념 나중, 질문으로 절을 연다. 각 장은 `<Key>`(오늘의 핵심)로
닫고 `<NextUp>`으로 다음 장을 예고한다. 원문(ChatGPT 대화)의 목소리를 유지하되,
한 단어씩 끊어진 줄바꿈은 읽을 수 있는 문단으로 합친다.

`<Deeper>`("더 깊이")는 **원문에 없는 보충**이다. 실무 정확도를 더하는 용도로만
쓰고, 원문 내용을 여기에 옮기지 않는다. 사용자가 은행권 종사자라 계정계·대외망·
이중화 같은 실무 예시가 잘 맞는다.

## 도식

`diagrams.tsx`에서 export만 하면 MDX에 자동 노출된다(`mdx.tsx`가 모듈 전체를 펼침).
import 불필요.

`Flag` `Said` `Seq` `Duplex` `Growth` `WindowSize` `Stack` `Stacks` `Chain` `FanOut`
`Life` `Journey` `Key` `Deeper` `NextUp` — props 표는 README 참조.

전부 CSS로 그린다. **이미지·SVG 파일을 새로 만들지 말 것.** 도식이 라이트/다크
양쪽에서 그대로 동작해야 하고, 텍스트로 검색·복사돼야 한다.

`Life`의 번호는 실제 순서를 뜻할 때만 쓴다. 순서가 없으면 `Chain`을 쓸 것.

### 알아둘 함정

`<span>`을 flex/grid 자식이 아닌 곳에 두고 `height`를 주면 먹지 않는다(인라인이라).
`.wire`가 이 문제로 화살표가 밖으로 튀어나간 적이 있다. 새 도식에서 선을 그릴 때는
`display: block`을 명시할 것.

## 디자인

토큰은 `globals.css` 최상단 `:root`에 전부 있다. 하드코딩된 색을 쓰지 말 것.

**액센트 두 색은 의미다.** `--dir-out`(파랑)은 보내는 방향, `--dir-in`(주황)은 받는
방향. 방향과 무관한 곳에 강조용으로 쓰면 안 된다. 강조가 필요하면 굵기나 여백으로
해결한다.

라이트/다크 양쪽을 항상 정의한다. `prefers-color-scheme`로 OS를 따르고,
`[data-theme="dark"]` / `[data-theme="light"]`가 사용자 선택을 덮어쓴다. 새 컴포넌트
스타일은 토큰만 참조하면 자동으로 양쪽에 대응된다.

과한 장식 금지 — 사용자가 명시적으로 요구한 방향이다. 모서리는 각지게(border-radius
없음), 그림자 없음, 애니메이션 없음. 여백과 타이포그래피로 위계를 만든다.

한글 웹폰트는 용량 때문에 넣지 않는다. 시스템 고딕이 본문, 바탕(명조) 계열은 책
제목 같은 곳에만. 본문에는 `word-break: keep-all`이 걸려 있다(한글 단어 중간 끊김 방지).

## 배포

`main`에 push하면 Vercel이 자동 배포한다. → <https://cs-notes-nine.vercel.app>

**Vercel CLI는 쓰지 말 것.** 이 환경에서 로그인되어 있지 않고, `vercel login`은
대화형이라 에이전트가 통과할 수 없다. 배포 확인이 필요하면 push 후 URL을 curl로
폴링한다(보통 30초~1분).

환경변수는 Vercel 대시보드에서 관리한다. `.env.local`은 커밋되지 않는다
(`.gitignore`의 `.env*`, 단 `!.env.example`로 템플릿만 예외).

프로젝트가 `C:\dev`에 있는 이유는 OneDrive 동기화가 `node_modules`를 건드리지
않게 하기 위해서다. OneDrive 안으로 옮기지 말 것.
