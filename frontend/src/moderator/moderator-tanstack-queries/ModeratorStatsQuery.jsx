import { useQuery } from "@tanstack/react-query";
import { moderatorrStatsApi } from "../moderator-apis/ModeratorStatsApi";


export const useGetModeratorStatsQuery = () => {
  return useQuery({
    queryKey: ["GetModeratorStatsQuery"],
    queryFn: moderatorrStatsApi,
    staleTime: 1000 * 60 * 60,
    gctime: 1000 * 60 * 120,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    retry: 2,
  
  });
};
