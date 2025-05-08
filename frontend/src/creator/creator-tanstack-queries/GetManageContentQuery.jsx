import { useQuery } from "@tanstack/react-query";
import { fetchContentApi } from "../creator-apis/FetchContenApi";

export const useGetManageContentQuery = (params,isCreator,manageuser) => {
  return useQuery({
    queryKey: ["fetchcreatormanagecontent", params],
    queryFn: () => fetchContentApi(params),
    staleTime: 1000 * 60 * 60,
    gctime: 1000 * 60 * 120,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    retry: 2,
    enabled:isCreator && manageuser === null,

  });
};
