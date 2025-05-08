import { useQuery } from "@tanstack/react-query";

import { fetchAdminVersionContentApi } from "../admin-apis/FetchAdminVersionContentApi";

export const useGetAdminVersionDataQuery = (versionposts,isAdmin) => {
  return useQuery({
    queryKey: ["getadminversionquery",versionposts],
    queryFn: ()=>fetchAdminVersionContentApi(versionposts),
    staleTime: 1000 * 60 * 60,
    gctime: 1000 * 60 * 120,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    retry: 1,
    enabled: (isAdmin && !!versionposts?.id),
  });
};
