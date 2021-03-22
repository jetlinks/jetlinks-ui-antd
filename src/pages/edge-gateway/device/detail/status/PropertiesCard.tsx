import React, { memo, useState, useEffect } from "react";
import ChartCard from "@/pages/analysis/components/Charts/ChartCard";
import { Tooltip, Icon, Spin } from "antd";
import AutoHide from "@/pages/device/location/info/autoHide";
import { MiniArea } from "@/pages/analysis/components/Charts";
import Service from "@/pages/device/instance/editor/service";

interface Props {
    item: {
        name?: string,
        expands?: {
            readOnly: string | boolean,
        },
        id: string,
        valueType: {
            type: string,
            unit: string,
        },
        list: {
            timeString: string,
            timestamp: number,
            formatValue: string,
            property: string,
            value: number,
        }[],
        formatValue?: string,
        value?: string | number,
        visitData: any[],
        subscribe: Function
    };
    device: any;
}
const PropertiesCard: React.FC<Props> = props => {
    const service = new Service();

    const { item, device } = props;
    const [loading, setLoading] = useState<boolean>(false);
    const getValue = () => {
        if (item?.list) {
            const length = item?.list.length;
            const value = item.list[length - 1];
            const dataType = typeof (value.formatValue);
            if (dataType === 'object') {
                item.formatValue = JSON.stringify(value.formatValue) || '/';
            } else {
                item.formatValue = value.formatValue || '/';
                item.value = value.value || 0;
            }

            // 特殊类型
            const valueType = item.valueType.type;
            if (valueType === 'int' || valueType === 'float' || valueType === 'double' || valueType === 'long') {
                const visitData: any[] = [];
                item.list.forEach(data => {
                    visitData.push({
                        'x': data.timeString,
                        'y': Math.floor(Number(data.value) * 100) / 100,
                    });
                });
                item.visitData = visitData;
            }
        }
        return item;
    };

    const [data, setData] = useState(getValue);

    useEffect(() => {
        item.subscribe((resp: any) => {
            const value = resp.value.value;
            const type = typeof (value);
            if (type === 'number') {
                if ((data.visitData || []).length > 14) {
                    data.visitData.shift();
                }
                if (!data.visitData) {
                    data.visitData = [];
                }
                data.visitData.push({ x: resp.timeString, y: resp.value.value });
            }
            setData({
                ...data,
                ...resp.value,
            });
            setLoading(false);
        })
    }, []);

    const refreshProperty = (item: any) => {
        setLoading(true);
        // 刷新数据
        service.getProperty(device.id, item.id).subscribe(() => { }, () => { }, () => { setLoading(false) });
    };

    return (
        <>
            <Spin spinning={loading}>
                <ChartCard
                    title={item.name}
                    contentHeight={46}
                    action={
                        <div>
                            <Tooltip placement="top" title="从设备端获取属性值">
                                <Icon
                                    title="刷新"
                                    style={{ marginLeft: '10px' }}
                                    type="sync"
                                    onClick={() => refreshProperty(item)}
                                />
                            </Tooltip>
                        </div>
                    }
                    total={
                        <AutoHide title={typeof (data.formatValue) === 'object' ? JSON.stringify(data.formatValue) : data.formatValue || '/'} style={{ width: '100%' }} />
                    }
                >
                    <MiniArea height={40} color="#975FE4" data={data.visitData} />
                </ChartCard >
            </Spin>
        </>
    );
};
export default memo(PropertiesCard);
