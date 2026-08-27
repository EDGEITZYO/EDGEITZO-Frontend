// Query Key Factory
// 문자열 하드코딩 금지, 이 파일을 통해서만 쿼리 키를 생성한다.

export const mypageKeys = {
  all: ["mypage"] as const,
  detail: () => [...mypageKeys.all] as const,
};

export const keywordMapKeys = {
  all: ["keyword-map"] as const,
  papers: (nodeKey: string, filter: object) =>
    [...keywordMapKeys.all, "papers", nodeKey, filter] as const,
  detail: (nodeKey: string) =>
    [...keywordMapKeys.all, "detail", nodeKey] as const,
};

export const bookmarkKeys = {
  check: (paperId: string) => ["bookmark", paperId] as const,
  folders: () => ["bookmark-folders"] as const,
  savedFolders: () => ["saved-bookmark-folders"] as const,
  folder: (folderId: string) => ["bookmark-folder", folderId] as const,
  savedList: (folderId?: string, filter?: object, page?: number) =>
    ["saved-bookmarks", folderId, filter, page] as const,
  savedTotal: () => ["saved-bookmarks-total"] as const,
};

export const paperKeys = {
  all: ["paper"] as const,
  detail: (paperId: string) => [...paperKeys.all, paperId] as const,
  similar: (paperId: string) => [...paperKeys.all, paperId, "similar"] as const,
};

export const homeKeys = {
  all: ["home"] as const,
};

export const savedKeys = {
  all: ["recent-papers"] as const,
  allStats: ["recent-paper-stats"] as const,
  recentPapers: (periodMode: string, dateParam: string) =>
    ["recent-papers", periodMode, dateParam] as const,
  recentPaperStats: (periodMode: string, dateParam: string) =>
    ["recent-paper-stats", periodMode, dateParam] as const,
};

export const citationKeys = {
  graph: (paperId: string, direction: string) =>
    ["citation", paperId, direction] as const,
};
