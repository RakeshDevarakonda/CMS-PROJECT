import { useQuery } from "@tanstack/react-query";
import { getAdminPostEditById } from "../admin-apis/GetAdminSinglePostApi";

export const useAdminSinglePostEditQuery = ({ editid, version, isAdmin }) => {
  return useQuery({
    queryKey: ["post-edit-admin", editid, version],
    queryFn: () => getAdminPostEditById({ editid, version }),
    enabled: !!editid && typeof editid === "string" && editid.trim() !== "",
    staleTime: 0,
    gctime: 0,
    refetchOnMount: true,
    retry: 1,
    // eslint-disable-next-line no-dupe-keys
    enabled: typeof editid === "string" && editid.trim() !== "" && isAdmin,
  });
};
