import { useQuery } from "@tanstack/react-query";
import { keywordMapKeys } from "./keys";
import { keywordMapApi } from "../api/keywordMap";
import { useMypageQuery } from "./useMypageQuery";
import { useBreadcrumbs } from "../stores/keywordMapStore";
import type { KMPaperFilter } from "../types/keywordMap";

interface UseNodePapersQueryParams {
  nodeKey: string | null;
  filter: KMPaperFilter;
  enabled: boolean;
}

export function useNodePapersQuery({
  nodeKey,
  filter,
  enabled,
}: UseNodePapersQueryParams) {
  const { data: mypageData } = useMypageQuery();
  const userId = mypageData?.profile.id;
  const breadcrumbs = useBreadcrumbs();
  const keywordPath = breadcrumbs.map((b) => b.label).join(",");

  return useQuery({
    queryKey: keywordMapKeys.papers(nodeKey ?? "", filter),
    queryFn: async () => {
      const res = await keywordMapApi.getNodePapers(nodeKey!, {
        ...filter,
        user_id: userId ?? undefined,
        keyword_path: keywordPath || undefined,
      });
      return res.data.data;
    },
    enabled: enabled && nodeKey !== null,
    staleTime: 1000 * 60 * 3,
  });
}
