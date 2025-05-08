import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { globalReduxSelector } from "../global-redux/GlobalRedux";


export const RoleBasedComponent = ({ allowedRoles }) => {
  const { userDetails, isAuthChecked, isUserLoggedout } =
    useSelector(globalReduxSelector);

  if (!isAuthChecked) {
    return <div style={{ color: "red" }}>Checking authentication...</div>;
  }

  if (isUserLoggedout) {
    return <Navigate to="/signin" replace />;
  }

  if (!userDetails?.role || !allowedRoles.includes(userDetails?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
