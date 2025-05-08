import { useQuery } from "@tanstack/react-query";
import { getCommentsApi } from "../home-page-apis/GetCommentsApi";

export const getCommentstQuery= (id) => {
  return useQuery({
    queryKey: ["getCommentsQuery",id],
    queryFn: ()=>getCommentsApi(id),
    staleTime: 1000 * 60 * 60,
    gctime: 1000 * 60 * 120,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    retry: 2,
    enabled: !!id
  });
};
