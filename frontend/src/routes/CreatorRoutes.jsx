import React from "react";
import { Route, Navigate } from "react-router-dom";
import { RoleBasedComponent } from "../utils/RoleBasedComponent";
import CreatorDashboard from "../creator/creator-components/CreatorDashboard";
import CreatorCreatePost from './../creator/creator-components/CreatorCreatePost';
import CreatorManageContent from "../creator/creator-components/CreatorManageContent";
import CreatorProfileManagement from './../creator/creator-components/CreatorProfileManagement';
import CreatorNavbar from './../creator/creator-components/CreatorNavbar';
import NotificationCenter from "../global-reusable-components/Notification.jsx";


export default function CreatorRoutes() {
  return (
    <>
      <Route element={<RoleBasedComponent allowedRoles={["creator"]} />}>
        <Route path="/creator" element={<CreatorNavbar />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<CreatorDashboard />} />
          <Route path="createpost" element={<CreatorCreatePost />} />
          <Route
            path="managecontent/allcontent"
            element={<CreatorManageContent statusfilter="All" />}
          />
          <Route
            path="managecontent/draft"
            element={<CreatorManageContent statusfilter="draft" />}
          />
          <Route
            path="managecontent/pending"
            element={<CreatorManageContent statusfilter="pending" />}
          />
          <Route
            path="managecontent/approved"
            element={<CreatorManageContent statusfilter="approved" />}
          />
          <Route
            path="managecontent/rejected"
            element={<CreatorManageContent statusfilter="rejected" />}
          />
          <Route path="profile" element={<CreatorProfileManagement />} />

          <Route path="notification" element={<NotificationCenter />} />

          <Route
            path="managecontent/allcontent/:editid/editpost"
            element={<CreatorCreatePost />}
          />
          <Route
            path="managecontent/draft/:editid/editpost"
            element={<CreatorCreatePost />}
          />
          <Route
            path="managecontent/pending/:editid/editpost"
            element={<CreatorCreatePost />}
          />
          <Route
            path="managecontent/approved/:editid/editpost"
            element={<CreatorCreatePost />}
          />
          <Route
            path="managecontent/rejected/:editid/editpost"
            element={<CreatorCreatePost />}
          />
        </Route>
      </Route>
    </>
  );
}
