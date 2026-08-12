import { useQuery } from "@tanstack/react-query";
import { homeApi } from "../api/home";
import { homeKeys } from "./keys";
import type { HomeData } from "../types/home";

export function useHomeQuery() {
  return useQuery<HomeData>({
    queryKey: homeKeys.all,
    queryFn: async () => {
      const res = await homeApi.getHome();
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}
