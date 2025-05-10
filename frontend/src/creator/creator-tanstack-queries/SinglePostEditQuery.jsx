import { useQuery } from "@tanstack/react-query";
import { getPostEditById } from "../creator-apis/GetPostByIdApi";

export const useSinglePostEditQuery = ({ editid, version, isCreator }) => {
  console.log(editid, version);
  return useQuery({
    queryKey: ["post-edit", editid, version],
    queryFn: () => getPostEditById({ editid, version }),
    staleTime: 0,
    gctime: 0,
    refetchOnMount: true,
    retry: 1,
    enabled: typeof editid === "string" && editid.trim() !== "" && isCreator,
  });
};


