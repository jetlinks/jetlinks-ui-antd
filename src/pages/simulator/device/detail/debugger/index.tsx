import { Input, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import Service from "../../service";
import Session from "./session";

interface Props {
    data: any
}
const Debugger: React.FC<Props> = props => {
    const { data } = props;
    const service = new Service('network/simulator');
    const [sessions, setSessions] = useState<any[]>([]);
    const [key, setkey] = useState<string>('');

    useEffect(() => {
        service.sessions(data.id, 1000, 0)
            .subscribe(data => {
                setSessions(data);
            })
        setkey(sessions.length > 0 ? sessions[0].id : '');
    }, []);

    useEffect(() => {
        if (sessions && sessions[0]) {
            setkey(sessions[0].id);
        }
    }, [sessions[0]])


    return (
        <>
            <Tabs
                tabBarExtraContent={(
                    <div >
                        <Input.Search />
                    </div>
                )}
                style={{ height: 500 }}
                tabPosition={"left"}
                defaultActiveKey={sessions.length > 0 ? sessions[0].id : ''}
                onChange={(key => setkey(key))}>
                {
                    sessions.map((item, index) =>
                        <Tabs.TabPane key={item.id} tab={item.id}>
                            {(key === item.id) && <Session item={item} data={data} />}
                        </Tabs.TabPane>)
                }
            </Tabs>
        </>
    )
}
export default Debugger;