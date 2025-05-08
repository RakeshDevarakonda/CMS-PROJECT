import { useQuery } from "@tanstack/react-query";
import { getSinglePostApi } from "../home-page-apis/GetSinglePostApi";

export const getSinglePostQuery = (id) => {
  return useQuery({
    queryKey: ["getSinglePostQuery",id],
    queryFn: ()=>getSinglePostApi(id),
    staleTime: 1000 * 60 * 60,
    gctime: 1000 * 60 * 120,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    retry: 2,
    enabled: !!id
  });
};
