import React from "react";
import AdminAnalysis from "./AdminAnalysis";
import TenantAnalysis from "./Tenant";

interface Props { }

const Analysis: React.FC<Props> = (props) => {
  const render = () => {
    const tenant = localStorage.getItem('tenants-admin');
    console.log(tenant, '租户身份');
    if (tenant === 'undefined' || tenant === null) {
      return <AdminAnalysis />
    } else {
      return <TenantAnalysis />
    }
  };
  return render();
};
export default Analysis;
