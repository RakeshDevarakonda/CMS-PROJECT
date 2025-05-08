import { useQuery } from "@tanstack/react-query";
import { fetchAdminContentApi } from "../admin-apis/FetchAdminContentApi";


export const useGetAdminContentQuery = (params,isAdmin,manageuser) => {

  console.log(manageuser)
  return useQuery({
    queryKey: ["adminmanagecontent",params],
    queryFn: ()=>fetchAdminContentApi(params),
    staleTime: 1000 * 60 * 60,
    gctime: 1000 * 60 * 120,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    retry: 1,
    enabled:isAdmin && manageuser === null,
  });
};
