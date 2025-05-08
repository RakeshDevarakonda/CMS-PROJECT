import { useQuery } from "@tanstack/react-query";
import { fetchProfileApi } from "../creator-apis/FetchProfileApi";

export const fetchprofiledataquery = (isCreator) => {
  return useQuery({
    queryKey: ["fetchcreatorprofileData"],
    queryFn: fetchProfileApi,
    staleTime: 1000 * 60 * 60,
    gctime: 1000 * 60 * 120,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    retry: 2,
    enabled:isCreator
  });
};
