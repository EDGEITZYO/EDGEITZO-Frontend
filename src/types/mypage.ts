import { z } from 'zod';
import { type Gender, type Job, type Purpose } from './user';

const GENDERS: [Gender, ...Gender[]] = ['여성', '남성', '선택 안함'];
const JOBS: [Job, ...Job[]] = [
  '대학원 진학 준비',
  '석사과정',
  '박사과정',
  '석박통합과정',
  '교수·연구원',
  '대학생',
  '기타',
];
const PURPOSES: [Purpose, ...Purpose[]] = [
  '연구 주제 탐색',
  '랩미팅 발표 준비',
  '논문 작성 참고',
  '최신 트렌드 파악',
  '연구자 탐색',
];

export const AGE_OPTIONS = [
  '20대', '30대', '40대', '50대', '60대', '70대', '80대 이상',
] as const;
export type AgeGroup = (typeof AGE_OPTIONS)[number];

export const JOB_OPTIONS = JOBS;
export const PURPOSE_OPTIONS = PURPOSES;
export const GENDER_OPTIONS = GENDERS;

export const profileEditSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요'),
  gender: z.enum(GENDERS, { message: '성별을 선택해주세요' }),
  ageGroup: z.enum(AGE_OPTIONS, { message: '나이를 선택해주세요' }),
  job: z.enum(JOBS, { message: '역할을 선택해주세요' }),
  researchField: z.string().min(1, '전공·연구 분야를 입력해주세요'),
  purposes: z.array(z.enum(PURPOSES)).min(1, '논문 탐색 목적을 하나 이상 선택해주세요'),
});

export type ProfileEditForm = z.infer<typeof profileEditSchema>;