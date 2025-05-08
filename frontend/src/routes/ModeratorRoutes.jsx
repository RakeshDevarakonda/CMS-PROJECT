import { Navigate, Route } from "react-router-dom";
import React from "react";
import { RoleBasedComponent } from "../utils/RoleBasedComponent";
import ModeratorNavbar from "../moderator/moderator-components/ModeratorNavbar";
import ModeratorDashboard from "./../moderator/moderator-components/ModeratorDashboard";
import ModeratorManageContent from "./../moderator/moderator-components/ModeratorManageContent";
import ModeratorProfileManagement from "../moderator/moderator-components/ModeratorProfileManagement";
import NotificationCenter from "../global-reusable-components/Notification.jsx";

export default function moderatorRoutes() {
  return (
    <>
      <Route element={<RoleBasedComponent allowedRoles={["moderator"]} />}>
        <Route path="/moderator" element={<ModeratorNavbar />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ModeratorDashboard />} />

          <Route
            path="managecontent/allcontent"
            element={<ModeratorManageContent statusfilter="All" />}
          />

          <Route
            path="managecontent/pending"
            element={<ModeratorManageContent statusfilter="pending" />}
          />
          <Route
            path="managecontent/approved"
            element={<ModeratorManageContent statusfilter="approved" />}
          />
          <Route
            path="managecontent/rejected"
            element={<ModeratorManageContent statusfilter="rejected" />}
          />
          <Route path="profile" element={<ModeratorProfileManagement />} />

          <Route path="notification" element={<NotificationCenter />} />

        </Route>
      </Route>
    </>
  );
}
