import { useQuery } from "@tanstack/react-query";
import { getAdminPostEditById } from "../admin-apis/GetAdminSinglePostApi";

export const useAdminSinglePostEditQuery = ({ editid, version, isAdmin }) => {
  return useQuery({
    queryKey: ["post-edit-admin", editid, version],
    queryFn: () => getAdminPostEditById({ editid, version }),
    staleTime: 0,
    gctime: 0,
    refetchOnMount: true,
    retry: 1,
    enabled: typeof editid === "string" && editid.trim() !== "" && isAdmin,
  });
};
