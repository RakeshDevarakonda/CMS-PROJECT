import { useMutation } from "@tanstack/react-query";
import { SignUpApi } from "../home-page-apis/SignUpApi";
import { useDispatch } from "react-redux";
import {
  setResetForm,

  setSignUpSubmitting,
} from "../home-page-redux/SignupSlice";
import { setErrorAndSuccesDialogMessage, toggleErrorAndSuccesDialog } from "../../global-redux/GlobalRedux";

export const SignUpMutation = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationKey: ["signup"],
    mutationFn: SignUpApi,
    onSuccess: (data) => {
      dispatch(toggleErrorAndSuccesDialog());
      dispatch(
        setErrorAndSuccesDialogMessage({
          message: "Signed Up Succesfully",
          type: "Success",
          buttonname: "Close",
          signedup:true
        })
      );
      dispatch(setSignUpSubmitting());
    },
    onError: (error) => {
      dispatch(setSignUpSubmitting());
      dispatch(toggleErrorAndSuccesDialog());
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
