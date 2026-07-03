// Query Key Factory
// 문자열 하드코딩 금지, 이 파일을 통해서만 쿼리 키를 생성한다.
// 다른 도메인(home, bookmark, paper 등)은 추후 순차적으로 이곳으로 이전한다.

export const mypageKeys = {
  all: ["mypage"] as const,
  detail: () => [...mypageKeys.all] as const,
};
