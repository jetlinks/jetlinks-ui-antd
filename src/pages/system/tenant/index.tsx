import React from "react";
import UserTenant from "@/pages/system/tenant/userIndex";
import Detail from "@/pages/system/tenant/detail";
import Analysis from "@/pages/analysis";

interface Props {
}

class Tenant extends React.Component<Props> {
  render() {
    const render = () => {

      const tenant = localStorage.getItem('hsweb-autz');
      try {
        let tenantsList: any[] = JSON.parse(tenant as string).user.tenants;
        if (tenantsList.length > 0) {
          return tenantsList.map((item: any) => {
            if (item.mainTenant && item.adminMember) {
              return <Detail location={
                {
                  pathname: `/system/tenant/detail/${item.tenantId}`,
                  search: '',
                  hash: "",
                  query: {},
                  state: undefined,
                }
              } />
            } else {
              // return <Analysis />
              return null;
            }
          })
        } else {
          return <UserTenant />
        }
      } catch (error) {
        return false;
      }
    };
    return render();
  }
}

export default Tenant;
