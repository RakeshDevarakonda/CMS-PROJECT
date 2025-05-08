
import { useQuery } from "@tanstack/react-query";
import { GetAuthApi } from "../home-page-apis/GetAuthApi";

export const GetAuthQuery = () => {
  return useQuery({
    queryKey: ["authStatus"],
    queryFn: GetAuthApi,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
