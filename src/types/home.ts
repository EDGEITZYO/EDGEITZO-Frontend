import { type PaperType } from './paper';

export type SearchType = 'keyword' | 'ai';

export interface KeywordPath {
  label: string;
}

export interface RecentSearch {
  id: string;
  searchType: SearchType;
  title: string;
  lastPaper: string;
  path?: KeywordPath[];      // 키워드 검색일 때
  keywords?: string[];       // AI 검색일 때
}

export interface RecentPaper {
  id: string;
  source: string;
  date: string;
  title: string;
  keywords: string[];
  kciType: string;
  citationCount: number;
  readAt: string;
  paperType?: PaperType;
}