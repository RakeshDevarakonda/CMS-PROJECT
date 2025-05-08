import { Navigate, Route } from "react-router-dom";
import React from "react";
import { RoleBasedComponent } from "../utils/RoleBasedComponent";
import AdminDashboard from "../admin/admin-components/AdminDashboard";
import AdminManageContent from "../admin/admin-components/AdminManageContent";
import AdminProfileManagement from "../admin/admin-components/AdminProfileManagement";
import AdminNavbar from "../admin/admin-components/AdminNavbar";
import AdminCreatePost from "../admin/admin-components/AdminCreatePost";
import NotificationCenter from './../global-reusable-components/Notification';

export default function adminRoutes() {
  return (
    <>
      <Route element={<RoleBasedComponent allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminNavbar />}>
          <Route index element={<Navigate to="dashboard/alldata" replace />} />
          <Route path="dashboard" element={<Navigate to="alldata" replace />} />
          <Route path="dashboard/alldata" element={<AdminDashboard />} />
          <Route path="dashboard/versiondata" element={<AdminDashboard />} />
          <Route path="createpost" element={<AdminCreatePost />} />

          <Route
            path="managecontent/allcontent/:editid/editpost"
            element={<AdminCreatePost />}
          />

          <Route
            path="managecontent/allcontent"
            element={<AdminManageContent statusfilter="All" />}
          />

          <Route
            path="managecontent/pending"
            element={<AdminManageContent statusfilter="pending" />}
          />
          <Route
            path="managecontent/approved"
            element={<AdminManageContent statusfilter="approved" />}
          />
          <Route
            path="managecontent/rejected"
            element={<AdminManageContent statusfilter="rejected" />}
          />
          <Route
            path="manageusers/creators"
            element={<AdminManageContent userDataType="creator" />}
          />
          <Route
            path="manageusers/moderators"
            element={<AdminManageContent userDataType="moderator" />}
          />

          <Route
            path="manageusers/admins"
            element={<AdminManageContent userDataType="admin" />}
          />

          <Route path="notification" element={<NotificationCenter />} />

          <Route path="profile" element={<AdminProfileManagement />} />
        </Route>
      </Route>
    </>
  );
}
