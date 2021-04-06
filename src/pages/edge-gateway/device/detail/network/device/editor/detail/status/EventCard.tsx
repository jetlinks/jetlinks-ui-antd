import { ChartCard } from "@/pages/analysis/components/Charts";
import { Tooltip, Icon, Badge, Spin } from "antd";
import React, { memo, useEffect, useState, useRef } from "react";
import AutoHide from "@/pages/device/location/info/autoHide";
import Service from "../../service";
import EventLog from "@/pages/device/instance/editor/detail/event-log/EventLog";

interface Props {
    item: any;
    device: any;
}
const eventLevel = new Map();
eventLevel.set('ordinary', <Badge status="processing" text="普通" />);
eventLevel.set('warn', <Badge status="warning" text="警告" />);
eventLevel.set('urgent', <Badge status="error" text="紧急" />);

const EventCard: React.FC<Props> = props => {
    const { item, device } = props;

    const service = new Service();

    const [count, setCount] = useState<number>(0);
    const countRef = useRef(count);
    const [visible, setVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const getEventData = () => {
        setLoading(true);
        service.eventCount(device.id, item.id).subscribe((res) => {
            setCount(res);
            countRef.current = res;
            setLoading(false);
        });
    }
    useEffect(() => {
        getEventData();
        item.subscribe((resp: any) => {
            if (resp) {
                const c = countRef.current + 1;
                countRef.current = c;
                setCount(c);
            }
        });
    }, [item.id]);

    return (
        <Spin spinning={loading}>
            <ChartCard
                bordered={false}
                title={item.name}
                contentHeight={46}
                action={
                    <Tooltip title="刷新">
                        <Icon type="sync" onClick={() => { getEventData() }} />
                    </Tooltip>
                }
                total={<AutoHide title={`${count || 0}次`} style={{ width: '100%' }} />}
            >
                <span>
                    {eventLevel.get(item?.expands?.level || 'warn')}
                    <a
                        style={{ float: 'right' }}
                        onClick={() => { setVisible(true) }}>
                        查看详情
                </a>
                </span>
            </ChartCard>
            {visible &&
                <EventLog
                    item={item}
                    close={() => { setVisible(false) }}
                    type={props.device.productId}
                    deviceId={props.device.id}
                />}
        </Spin>
    );
}
export default memo(EventCard);