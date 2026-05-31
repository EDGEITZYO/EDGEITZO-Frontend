// src/types/user.ts

export type Gender = '여성' | '남성' | '선택 안함';

export type Job =
  | '대학원 진학 준비'
  | '석사과정'
  | '박사과정'
  | '석박통합과정'
  | '교수·연구원'
  | '대학생'
  | '기타';

export type Purpose =
  | '선택연구 주제 탐색'
  | '랩미팅 발표 준비'
  | '논문 작성 참고'
  | '최신 트렌드 파악'
  | '연구자 탐색';

export interface UserProfile {
  name: string;
  gender: Gender;
  birthYear: number;
  job: Job;
  researchField: string;
  purposes: Purpose[];
}