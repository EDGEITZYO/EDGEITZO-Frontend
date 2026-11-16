import { useQuery } from "@tanstack/react-query";
import { homeApi } from "../api/home";
import { homeKeys } from "./keys";

export const useSearchSuggestionsQuery = () =>
  useQuery({
    queryKey: homeKeys.searchSuggestions(),
    queryFn: () => homeApi.getSearchSuggestions().then((res) => res.data.data),
    staleTime: 1000 * 60 * 30,
  });
