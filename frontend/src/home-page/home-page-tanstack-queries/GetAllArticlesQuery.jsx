import { useQuery } from "@tanstack/react-query";
import { getAllArticlesApi } from "../home-page-apis/GettAllArticlesApi";

export const getAllArticlesQuery = (currentPage,allarticles) => {
  return useQuery({
    queryKey: ["getallarticles",currentPage,allarticles],
    queryFn: ()=>getAllArticlesApi(currentPage,allarticles),
    staleTime: 1000 * 60 * 60,
    gctime: 1000 * 60 * 120,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    retry: 2,
  });
};
