import { useQuery } from "@tanstack/react-query";
import { fetchversionContentApi } from "./../creator-apis/FetchversionContentApi";

export const useGetVersionDataQuery = (versionposts, isCreator) => {
  return useQuery({
    queryKey: ["getcreatorversionquery", versionposts],
    queryFn: () => fetchversionContentApi(versionposts),
    staleTime: 1000 * 60 * 60,
    gctime: 1000 * 60 * 120,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    retry: 1,
    enabled: (isCreator && !!versionposts?.id),
  });
};
