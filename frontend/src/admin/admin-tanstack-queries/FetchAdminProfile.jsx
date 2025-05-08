import { useQuery } from "@tanstack/react-query";
import { fetchAdminProfileApi } from "../admin-apis/FetchAdminProfileApi";


export const fetchAdminprofiledataquery = (isAdmin) => {
  return useQuery({
    queryKey: ["fetchadminprofileData"],
    queryFn: fetchAdminProfileApi,
    staleTime: 1000 * 60 * 60,
    gctime: 1000 * 60 * 120,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    retry: 2,
    enabled:isAdmin
  });
};
