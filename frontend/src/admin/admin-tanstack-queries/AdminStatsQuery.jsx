import { useQuery } from "@tanstack/react-query";
import { adminStatsApi } from "../admin-apis/AdminStatsApi";

export const useGetAdminStatsQuery = () => {
  return useQuery({
    queryKey: ["GetAdminStatsQuery"],
    queryFn: adminStatsApi,
    staleTime: 1000 * 60 * 60,
    gctime: 1000 * 60 * 120,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    retry: 2,
  });
};
