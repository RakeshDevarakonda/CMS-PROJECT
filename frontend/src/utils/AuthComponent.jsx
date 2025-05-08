// AuthLoader.js
import { useDispatch, useSelector } from "react-redux";
import { GetAuthQuery } from "../home-page/home-page-tanstack-queries/GetAuthQuery.jsx";
import {
  setAuthChecked,
  setIsUserLogged,
  setUserDetails,
} from "../global-redux/GlobalRedux.jsx";
import { useEffect } from "react";
import { FullPageLoader } from "./FullPageLoader.jsx";
import { globalReduxSelector } from "../global-redux/GlobalRedux.jsx";

export const AuthComponent = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthChecked } = useSelector(globalReduxSelector);

  const { data: authData, isSuccess, isLoading, isError } = GetAuthQuery();


  useEffect(() => {
    if (isSuccess && authData) {
      dispatch(setIsUserLogged(true));
      dispatch(setUserDetails(authData));
      dispatch(setAuthChecked(true));
    } else if (isError) {
      dispatch(setAuthChecked(true));
      dispatch(setIsUserLogged(false));
      dispatch(setUserDetails(null));
    }
  }, [isSuccess, isError, authData, dispatch]);

  if (isLoading || !isAuthChecked)
    return <FullPageLoader text="Checking authentication..." />;

  return children;
};
