import React from "react";
import "./index.css";
import "./App.css";
import PublicRoutes from "./routes/PublicRoutes";
import CreatorRoutes from "./routes/CreatorRoutes";
import ErrorRoutes from "./routes/ErrorRoutes";
import { useSelector } from "react-redux";
import { AuthComponent } from "./utils/AuthComponent";
import { globalReduxSelector } from "./global-redux/GlobalRedux.jsx";
import ErrorAndSuccesDialog from "./utils/ErrorAndSuccesDialog";
import { Routes } from "react-router-dom";
import moderatorRoutes from "./routes/ModeratorRoutes.jsx";
import adminRoutes from "./routes/AdminRoutes.jsx";
import ErrorBoundary from "./utils/ErrorBoundary.jsx";

export default function App() {
  const { errorAndSuccesDialog } = useSelector(globalReduxSelector);

  return (
    <>
      <ErrorBoundary>
        <AuthComponent>
          <Routes>
            {PublicRoutes()}
            {CreatorRoutes()}
            {moderatorRoutes()}
            {adminRoutes()}
            {ErrorRoutes()}
          </Routes>

          {errorAndSuccesDialog && <ErrorAndSuccesDialog />}
        </AuthComponent>
      </ErrorBoundary>
    </>
  );
}
