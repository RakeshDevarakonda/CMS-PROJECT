import { useMutation } from "@tanstack/react-query";

import { useDispatch } from "react-redux";
import { SignInApi } from "../home-page-apis/SignInApi";
import { setIsSignInSubmitting } from "../home-page-redux/SignInSlice";
import {
  setIsUserLogged,
  setJustLoggedOut,
  setUserDetails,
} from "../../global-redux/GlobalRedux.jsx";
import { setErrorAndSuccesDialogMessage, toggleErrorAndSuccesDialog } from "../../global-redux/GlobalRedux";

export const SignInMutation = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationKey: ["signin"],
    mutationFn: SignInApi,
    onSuccess: (data) => {
      dispatch(setIsSignInSubmitting());
      dispatch(setIsUserLogged(true));
      dispatch(setUserDetails(data.payload));
      dispatch(setJustLoggedOut(false));
    },
    onError: (error) => {
      dispatch(toggleErrorAndSuccesDialog());
      dispatch(setIsSignInSubmitting());

      dispatch(
        setErrorAndSuccesDialogMessage({
          message: error.message,
          type: "Error",
          buttonname: "Try Again",
        })
      );
    },
  });
};
