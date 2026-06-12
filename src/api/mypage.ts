import apiClient from "./client";
import type { ApiResponse } from "../types/auth";
import type {
  MypageData,
  MypageProfile,
  ProfileEditForm,
} from "../types/mypage";

export const mypageApi = {
  getMypage: () => apiClient.get<ApiResponse<MypageData>>("/mypage"),

  updateProfile: (data: ProfileEditForm) =>
    apiClient.patch<ApiResponse<MypageProfile>>("/mypage/profile", data),

  updateResearchField: (researchField: string) =>
    apiClient.patch<ApiResponse<MypageProfile>>("/mypage/profile", {
      research_field: researchField,
    }),
};
