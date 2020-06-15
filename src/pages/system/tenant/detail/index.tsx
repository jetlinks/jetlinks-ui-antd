import React, { useState, useEffect } from "react";
import { Tabs, Card } from "antd";
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import BasicInfo from "../components/basicInfo";
import Assets from "../components/assets";
import Member from "../components/member";
import Permission from "../components/permission";
import { TenantItem } from "../data";
import Service from "../service";

interface Props {
    location: Location
}
export const TenantContext = React.createContext({});

const Detail = (props: Props) => {
    const service = new Service('tenant');
    const [data, setData] = useState<Partial<TenantItem>>({});

    const { location: { pathname } } = props;
    useEffect(() => {
        if (pathname.indexOf('detail') > 0) {
            const list = pathname.split('/');
            service.queryById(list[list.length - 1]).subscribe(d => {
                console.log(d);
                setData(d);
            });
        }
    }, []);

    return (
        <PageHeaderWrapper title="租户管理">
            <Card>
                <TenantContext.Provider value={data}>
                    <Tabs defaultActiveKey="1" >
                        <Tabs.TabPane tab="基本信息" key="basicinfo">
                            <BasicInfo data={data} />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="资产信息" key="assets">
                            <Assets data={data} />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="成员管理" key="member">
                            <Member data={data} />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="查看权限" key="permission">
                            <Permission data={data} />
                        </Tabs.TabPane>
                    </Tabs>
                </TenantContext.Provider>

            </Card>

        </PageHeaderWrapper>
    )
}
export default Detail;