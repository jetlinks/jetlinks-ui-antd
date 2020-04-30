import React, { useState, useEffect } from "react";
import { Chart, Axis, Geom, Tooltip } from "bizcharts";
import { message } from "antd";
import { ComponentProps } from "..";
import apis from "@/services";
import styles from '../index.less';

interface Props extends ComponentProps {
    config: any;
}

const LineChart = (props: Props) => {
    const { config } = props;
    const defaultData: any[] = [];

    const [data, setData] = useState<any[]>(defaultData);

    const defaultCols = {
        year: {
            min: 0,
            range: [0, 0.93],
            alias: config.x || '次',
            type: 'cat'
        },
        value: {
            range: [0, 0.9],
            alias: config.y || '时间'
        }
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
        let params: any[] = [];
        if (props.config.dimension === 'history') {
            params = [{
                "dashboard": 'device',
                "object": props.productId,
                "measurement": props.config.measurement, // 物模型属性ID
                "dimension": props.config.dimension, // 固定
                "params": { "history": 10, "deviceId": props.deviceId }
            }];

        } else if (props.config.dimension === 'agg') {
            params = [{
                "dashboard": 'device',
                "object": props.productId,
                "measurement": props.config.measurement, // 物模型属性ID
                "dimension": props.config.dimension, // 固定
                "params": {
                    "limit": props.config.limit,
                    "deviceId": props.deviceId,
                    "time": props.config.time,
                    "agg": props.config.agg, // 聚合方式
                    "format": props.config.format, // 时间格式
                    "from": props.config.from, // 时间从
                    "to": props.config.to // 时间止,不填就是当前时间.
                }
            }];
        }


        apis.visualization.getDashboardData(params).then(response => {
            if (response.status === 200) {
                const { result } = response;
                const tempData = result.map((item: any) => ({ year: item.data.timeString, value: item.data.value.value }));
                setData(tempData);
            }
        })
    }, [props.deviceId]);
    return (
        <Chart
            height={height}
            data={data}
            scale={defaultCols}
            forceFit
            placeholder
        >
            <h4 className={styles.subTitle}>
                {config.name || ''}
            </h4>
            <Axis name="year"
                label={{ autoRotate: false }}
                title={{
                    position: 'end',
                    offset: 15,
                    textStyle: {
                        fontSize: '12',
                        textAlign: 'center',
                        fill: '#999',
                        fontWeight: 'bold',
                        rotate: 0,
                        autoRotate: true
                    }
                }} />
            <Axis name="value"
                label={{ autoRotate: false }}
                title={{
                    position: 'end',
                    offset: 5.5,
                    textStyle: {
                        fontSize: '12',
                        textAlign: 'right',
                        fill: '#999',
                        fontWeight: 'bold',
                        rotate: 0
                    }
                }} />
            <Tooltip
                crosshairs={{
                    type: "y"
                }}
            />
            <Geom type="line" position="year*value" size={2}
                tooltip={['year*value', (year, value) => ({
                    name: '数值', // 要显示的名字
                    value,
                    title: year
                })]} />
            <Geom
                type="point"
                position="year*value"
                size={4}
                shape="circle"
                style={{
                    stroke: "#fff",
                    lineWidth: 1
                }}
                tooltip={['year*value', (year, value) => ({
                    name: '数值', // 要显示的名字
                    value,
                    title: year
                })]}
            />
        </Chart>
    );

}
export default LineChart;