// home-page-hooks/LogoutMutation.js
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { LogoutApi } from "../home-page-apis/LogoutApi";
import {
  setIsUserLogged,
  setJustLoggedOut,
  setUserDetails,
} from "../../global-redux/GlobalRedux.jsx";
import { useNavigate } from "react-router-dom";

export const LogoutMutation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["logout"],
    mutationFn: LogoutApi,
    onSuccess: (data) => {
      dispatch(setIsUserLogged(false));
      dispatch(setUserDetails(null));
      dispatch(setJustLoggedOut(true));

      navigate("/signin");

      setTimeout(() => dispatch(setJustLoggedOut(false)), 3000);
    },
    onError: (error) => {
      dispatch(setIsUserLogged(false));
      dispatch(setUserDetails(null));

      toast.error(error.message || "Logout error");
    },
  });
};
