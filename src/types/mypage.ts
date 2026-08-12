import { z } from "zod";
import { type Gender, type Role, type Purpose } from "./user";

// ─── API 응답 타입 ─────────────────────────────────────────

export interface MypageProfile {
  id: string;
  email: string;
  provider: string;
  name: string;
  gender: string;
  birth_year: number;
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

export const ROLE_OPTIONS = ROLES;
export const PURPOSE_OPTIONS = PURPOSES;
export const GENDER_OPTIONS = GENDERS;

const CURRENT_YEAR = new Date().getFullYear();

export const profileEditSchema = z.object({
  name: z
    .string()
    .min(1, "이름을 입력해주세요")
    .max(10, "이름은 10자 이하로 입력해주세요")
    .regex(/^[a-zA-Z0-9가-힣]*$/, "특수문자는 입력할 수 없어요"),
  gender: z.enum(GENDERS, { message: "성별을 선택해주세요" }),
  birth_year: z
    .number({ message: "출생 연도를 입력해주세요" })
    .min(1920, "1920년부터 현재까지 입력할 수 있어요")
    .max(CURRENT_YEAR, "1920년부터 현재까지 입력할 수 있어요"),
  role: z.enum(ROLES, { message: "역할을 선택해주세요" }),
  research_field: z.string().min(1, "전공·연구 분야를 입력해주세요"),
  purposes: z
    .array(z.enum(PURPOSES))
    .min(1, "논문 탐색 목적을 하나 이상 선택해주세요"),
});

export type ProfileEditForm = z.infer<typeof profileEditSchema>;
