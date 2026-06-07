import apiClient from "./client";
import type { ApiResponse } from "../types/auth";
import type { HomeData } from "../types/home";

export const homeApi = {
  getHome: () => apiClient.get<ApiResponse<HomeData>>("/home"),
};
