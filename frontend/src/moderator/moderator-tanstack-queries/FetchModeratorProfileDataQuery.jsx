import { useQuery } from "@tanstack/react-query";
import { fetchModeratorProfileApi } from "../moderator-apis/FetchModeratorProfileApi";


export const fetchmoderatorprofiledataquery = (isModerator) => {
  return useQuery({
    queryKey: ["fetchmoderatorprofileData"],
    queryFn: fetchModeratorProfileApi,
    staleTime: 1000 * 60 * 60,
    gctime: 1000 * 60 * 120,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    retry: 2,
    enabled:isModerator
  });
};
