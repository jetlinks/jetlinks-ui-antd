import React from "react";
import AdminAnalysis from "./AdminAnalysis";
import TenantAnalysis from "./Tenant";

interface Props { }

const Analysis: React.FC<Props> = (props) => {
  const render = () => {
    const tenant = localStorage.getItem('tenants-admin');
    if (tenant !== 'undefined') {
      return <TenantAnalysis />
    } else {
      return <AdminAnalysis />
    }
  }
  return render();
}
export default Analysis;