import React from "react";
import ManageContent from "../../global-reusable-components/ManageContent/ManageContent.jsx";

export default function AdminManageContent({ statusfilter ,userDataType}) {
  return <ManageContent statusfilter={statusfilter} userDataType={userDataType}/>;
}
