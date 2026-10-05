import { useQuery } from "@tanstack/react-query";
import { externalPaperApi } from "../api/externalPaper";
import { externalPaperKeys } from "./keys";

export const useExternalPaperDetailQuery = (externalId: string) =>
  useQuery({
    queryKey: externalPaperKeys.detail(externalId),
    queryFn: () =>
      externalPaperApi.getDetail(externalId).then((res) => res.data.data),
    staleTime: 1000 * 60 * 5,
    enabled: !!externalId,
  });

export const useRelatedCorpusPapersQuery = (externalId: string) =>
  useQuery({
    queryKey: externalPaperKeys.related(externalId),
    queryFn: () =>
      externalPaperApi.getRelated(externalId).then((res) => res.data.data),
    staleTime: 1000 * 60 * 5,
    enabled: !!externalId,
  });

export const useAdditionRequestStatusQuery = (externalId: string) =>
  useQuery({
    queryKey: externalPaperKeys.additionRequest(externalId),
    queryFn: () =>
      externalPaperApi
        .getAdditionRequestStatus(externalId)
        .then((res) => res.data.data),
    staleTime: 0,
    enabled: !!externalId,
  });
