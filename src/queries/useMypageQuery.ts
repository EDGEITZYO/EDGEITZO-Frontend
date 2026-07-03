import { useQuery } from "@tanstack/react-query";
import { mypageApi } from "../api/mypage";
import { mypageKeys } from "./keys";
import type { MypageData } from "../types/mypage";

export function useMypageQuery(enabled = true) {
  return useQuery<MypageData>({
    queryKey: mypageKeys.detail(),
    queryFn: async () => {
      const res = await mypageApi.getMypage();
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
    enabled,
  });
}
