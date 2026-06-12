import { z } from "zod";
import { type Gender, type Role, type Purpose } from "./user";

// ─── API 응답 타입 ─────────────────────────────────────────

export interface MypageProfile {
  id: string;
  email: string;
  provider: string;
  name: string;
  gender: string;
  age: string;
  role: string;
  research_field: string;
  purposes: string[];
  purpose_custom: string | null;
  is_profile_set: boolean;
  created_at: string;
  updated_at: string;
}

export interface MypageSummary {
  bookmark_count: number;
  bookmark_folder_count: number;
  recent_read_count: number;
}

export interface MypageData {
  profile: MypageProfile;
  summary: MypageSummary;
}

// ─── 폼 타입 ──────────────────────────────────────────────

const GENDERS: [Gender, ...Gender[]] = ["여성", "남성", "선택 안함"];
const ROLES: [Role, ...Role[]] = [
  "대학원 진학 준비",
  "석사과정",
  "박사과정",
  "석박통합과정",
  "교수·연구원",
  "대학생",
  "기타",
];
const PURPOSES: [Purpose, ...Purpose[]] = [
  "연구 주제 탐색",
  "랩미팅/발표 준비",
  "논문 작성 참고",
  "최신 트렌드 파악",
  "연구자 탐색",
];

export const AGE_OPTIONS = [
  "20대",
  "30대",
  "40대",
  "50대",
  "60대",
  "70대",
  "80대 이상",
] as const;
export type AgeGroup = (typeof AGE_OPTIONS)[number];

export const ROLE_OPTIONS = ROLES;
export const PURPOSE_OPTIONS = PURPOSES;
export const GENDER_OPTIONS = GENDERS;

export const profileEditSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  gender: z.enum(GENDERS, { message: "성별을 선택해주세요" }),
  age: z.enum(AGE_OPTIONS, { message: "나이를 선택해주세요" }),
  role: z.enum(ROLES, { message: "역할을 선택해주세요" }),
  research_field: z.string().min(1, "전공·연구 분야를 입력해주세요"),
  purposes: z
    .array(z.enum(PURPOSES))
    .min(1, "논문 탐색 목적을 하나 이상 선택해주세요"),
});

export type ProfileEditForm = z.infer<typeof profileEditSchema>;
