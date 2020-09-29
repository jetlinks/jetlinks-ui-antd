import { Button, Input, Tabs, Tree } from "antd";
import React, { useEffect, useRef, useState } from "react";
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

    const cache = useRef<any[]>([]);
    useEffect(() => {
        service.sessions(data.id, 10000, 0)
            .subscribe(data => {
                cache.current = data;
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
            <Input.Search
                onSearch={(value) => {
                    const temp = cache.current.filter(i => i.id.indexOf(value) != -1);
                    setSessions(temp);
                }}
                style={{ width: 100, marginBottom: 10 }} />

            <Tabs
                style={{ height: 600 }}
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