import { useQuery } from "@tanstack/react-query";
import { fetchAllUsersInAdminApi } from "../admin-apis/GetAllCreatorsApi";



export const fetchAllUsersInAdmin = (manageuser,finalSearchUsername) => {
  return useQuery({
    queryKey: ["fetchAllUsersInAdmin",manageuser,finalSearchUsername],
    queryFn: ()=>fetchAllUsersInAdminApi(manageuser,finalSearchUsername),
    staleTime: 1000 * 60 * 60,
    gctime: 1000 * 60 * 120,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    retry: 2,
    enabled: manageuser !== null,

  });
};
