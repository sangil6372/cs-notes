import type { MDXComponents } from "mdx/types";
import * as Diagrams from "./diagrams";

/**
 * MDX 안에서 이름만 쓰면 바로 쓸 수 있는 컴포넌트 목록.
 * 새 도식을 만들면 diagrams.tsx에 추가하기만 하면 여기로 자동 노출된다.
 */
export const mdxComponents: MDXComponents = {
  ...Diagrams,

  // 표는 가로 스크롤 컨테이너로 감싼다 — 본문이 옆으로 밀리지 않게.
  table: (props) => (
    <div className="tablewrap">
      <table {...props} />
    </div>
  ),
};
