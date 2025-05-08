import { useQuery } from "@tanstack/react-query";
import { fetchModeratorContentApi } from "../moderator-apis/FetchModeratorContentApi";

export const useGetModeratorManageContentQuery = (params,isModerator,manageuser) => {
  return useQuery({
    queryKey: ["moderatormanagecontent",params],
    queryFn: ()=>fetchModeratorContentApi(params),
    staleTime: 1000 * 60 * 60,
    gctime: 1000 * 60 * 120,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    retry: 1,
    enabled:isModerator && manageuser === null,
  });
};
