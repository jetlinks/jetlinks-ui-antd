import React, { useState, useEffect } from 'react';
import { Chart, Axis, Coord, Geom, Guide } from 'bizcharts';
import { ComponentProps } from '..';
import { message } from 'antd';
import apis from '@/services';
import { getWebsocket } from '@/layouts/GlobalWebSocket';

const { Html, Arc } = Guide;
interface Props extends ComponentProps {
    config: any;
}
const GaugeChart = (props: Props) => {
    const { config } = props;
    const defaultData: any[] = [
        { value: 0, formatValue: 0 },
    ];

    const [data, setData] = useState<any[]>(defaultData);

    const cols = {
        value: {
            min: config.min || 0,
            max: config.max || 10,
            tickInterval: config.max / 10 || 1,
            nice: false,
        },
    };

    // 修改高度
    const [height, setHeight] = useState<number>(300);
    useEffect(() => {
        const div = document.getElementById(props.id);
        if (div) {
            setHeight(div.offsetHeight - 50);
        }
    }, [props.ySize]);

    // 注册方法
    useEffect(() => {
        if (props.ready) {
            props.ready(() => {
                message.success(`更新。。。${props.id}`);
            });
        }
        if (props.edit) {
            props.edit(() => props.config);
        }

    }, []);

    useEffect(() => {
        // 获取数据
        const { dimension } = props.config;
        let subs: any;
        if (dimension === 'history') {
            const params = [{
                "dashboard": 'device',
                "object": props.productId,
                "measurement": props.config.measurement, // 物模型属性ID
                "dimension": 'history', // 固定
                "params": { "history": 1, "deviceId": props.deviceId }
            }];
            apis.visualization.getDashboardData(params).then(response => {
                if (response.status === 200) {
                    const { result } = response;
                    const tempData = result.map((item: any) => ({ value: item.data.value.value, formatValue: item.data.value.formatValue }));
                    setData(tempData);
                }
            })
        } else {
            subs = getWebsocket(
                `${props.id}-${props.productId}-${props.deviceId}-${props.config.measurement}`,
                `/dashboard/device/${props.productId}/${props.config.measurement}/realTime`,
                {
                    "deviceId": props.deviceId,
                    "history": props.config.history
                }
            ).subscribe(
                (resp: any) => {
                    const { payload } = resp;
                    setData([{ formatValue: payload.value.formatValue, value: payload.value.value }]);
                }
            );
        }
        return () => subs && subs.unsubscribe();
    }, []);

    return (


        <Chart
            height={height}
            data={data}
            scale={cols}
            padding="auto"
            forceFit
            placeholder
            style={{ overflow: 'hidden' }}
        >
            <Coord type="polar" startAngle={-9 / 8 * Math.PI} endAngle={1 / 8 * Math.PI} radius={0.75} />
            <Axis
                name="value"
                zIndex={2}
                line={null}
                label={{
                    offset: -16,
                    textStyle: {
                        fontSize: 18,
                        textAlign: 'center',
                        textBaseline: 'middle',
                    },
                }}
                subTickCount={4}
                subTickLine={{
                    length: -8,
                    stroke: '#fff',
                    strokeOpacity: 1,
                }}
                tickLine={{
                    length: -18,
                    stroke: '#fff',
                    strokeOpacity: 1,
                }}
            />
            <Axis name="1" visible={false} />
            <Guide>
                <Arc
                    zIndex={0}
                    start={[config.min || 0, 0.965]}
                    end={[config.max || 10, 0.965]}
                    style={{ // 底灰色
                        stroke: '#CBCBCB',
                        lineWidth: 18,
                    }}
                />
                <Arc
                    zIndex={1}
                    start={[0, 0.965]}
                    end={[data[0].value, 0.965]}
                    style={{
                        stroke: '#1890FF',
                        lineWidth: 18,
                    }}
                />
                <Html
                    position={['50%', '90%']}
                    html={`<div style="width: 300px;text-align: center;font-size: 12px!important;"><p style="font-size: 1.75em; color: rgba(0,0,0,0.43);margin: 0;">${config.name}</p><p style="font-size: 3em;color: rgba(0,0,0,0.85);margin: 0;">${data[0].formatValue}</p></div>`}
                />
            </Guide>
            <Geom
                type="point"
                position="value*1"
                shape="pointer"
                color="#1890FF"
                active={false}
                style={{ stroke: '#fff', lineWidth: 1 }}
            />
        </Chart>

    )
}
export default GaugeChart;