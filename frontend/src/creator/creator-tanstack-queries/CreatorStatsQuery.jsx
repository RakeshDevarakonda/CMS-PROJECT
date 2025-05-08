import { useQuery } from "@tanstack/react-query";
import { creatorStatsApi } from "../creator-apis/CreatorStatsApi";

export const useGetCreatorStatsQuery = () => {
  return useQuery({
    queryKey: ["GetCreatorStatsQuery"],
    queryFn: creatorStatsApi,
    staleTime: 1000 * 60 * 60,
    gctime: 1000 * 60 * 120,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    retry: 2,
  });
};
