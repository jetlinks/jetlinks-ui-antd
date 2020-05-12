import React, { useState, useEffect } from 'react';
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts';
import { message } from 'antd';
import { ComponentProps } from '..';
import apis from '@/services';
import { getWebsocket } from '@/layouts/GlobalWebSocket';

interface Props extends ComponentProps {
    config: any;
}

const ColumnCharts = (props: Props) => {

    const { config } = props;
    const defaultData: any[] = [];
    const [data, setData] = useState<any[]>(defaultData);


    const [height, setHeight] = useState<number>(300);

    useEffect(() => {
        const div = document.getElementById(props.id);
        if (div) {
            setHeight(div.offsetHeight - 50);
        }
    }, [props.ySize]);

    const defaultCols = {
        sold: {
            alias: config.x || '销售量',
            // range: [0, 1],
            tickCount: (config.history && config.history > 9) ? Math.ceil(config.history / 2) : 10,
        },
        genre: {
            alias: config.y || '游戏种类',
            type: "cat",
            range: [1 / (config.history - 1), 1 - 1 / (config.history - 1)],
            tickCount: 5,
        }
    }

    useEffect(() => {
        if (props.ready) {
            props.ready(() => {
                message.success(`更新。。。${props.id}`);
            });
        }
        if (props.edit) {
            props.edit(() => props.config);
        }
        if (props.preview) {
            props.preview(() => 'https://www.baidu.com/link?url=kuSzeluGn9dkOqcDvPcvU5g1gh-DMms6auTTUACJkdPm559tFM6GRDYkHE7p8fSHDl-RSOc5KeDGQBCictIOZsdgBL5Ds_kDaZCu1qgx99BitlSq6ocOJp3htq0bW7IoATv4Y0I33tKGyQL-bBDOuAqHvqsLeQiWlDuR0KCJiA3u-SswRJhJQHgREuKPOHszUZ0L_9oieMXOwCY0HYUDGsIKBjIMNoV3x6CFP4h63kPC3rmMwKTs-0WtEa1VceLscigtzPQiQmqZqlctYr1JX1IWLbR6r6rNcvQvP2o8NqaHqfzcG0tTiE6y7fSgM9D2N1E9ON8yyBf8iRnPOIzjfc6p2FPMmuM6_Rc6cBFhhPC_ujQWj4kc_CveBLiapyLMDS4E1KVznYHYWSz_OiK-DZIvGqriXnBUCz5j25CgJFm_mMK-LrwLAXkHY_2BzRr4WQFBMoOzesktllvUaOmzlkircgLMGRVKQZRubOzkJ0ocCySDlUKSyNeIX01yGRGGOZ5EEBoPD6BVVUFCKKUUEEp6NEj-6vVN_Jihgk-_W1J--9a9PKRuXKuS0EbKjvySdY3f5ink5eax6jvSvv7GNywDh1E6slJqj8rHTBQO32niX9mPlD9vfLrbOxSUcTBO_GUmwK6K7OIZSCUChT3Lpuwv38Lr8vlFbuUdZIB2tSO1lDLjDshWgPlic54ECPb4TLsGMdlJg8p8q_BLL4Qdly75nte91d1jYcb3EbEbFViLVewOfeOspKTyimZFT-G0Qe15r1klAAZvt7dD5LBqu_Nh89uLs4_ZZ4jhQJKBSLm&timg=&click_t=1587465382772&s_info=1622_978&wd=&eqid=e5c3ddcc00000e74000000065e9ecca5')
        }

    }, []);
    useEffect(() => {
        // 获取数据
        let params: any[] = [];
        let subs: any;
        const { dimension } = props.config;
        if (dimension === 'history') {
            params = [{
                "dashboard": 'device',
                "object": props.productId,
                "measurement": "temperature", // 物模型属性ID
                "dimension": dimension, // 固定
                "params": { "history": config.history, "deviceId": props.deviceId }
            }];

        } else if (dimension === 'agg') {
            params = [{
                "dashboard": 'device',
                "object": props.productId,
                "measurement": "temperature", // 物模型属性ID
                "dimension": dimension, // 固定
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
        } else if (dimension === 'realTime') {
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
                    data.push({ genre: payload.timestamp, sold: payload.value.value });
                    if (data.length > props.config.history) data.shift();
                    setData([...data]);
                }
            );
        }

        if (dimension !== 'realTime') {
            apis.visualization.getDashboardData(params).then(response => {
                if (response.status === 200) {
                    const { result } = response;
                    const tempData = result.map((item: any) => ({ genre: item.data.timeString, sold: item.data.value.value }));
                    setData(tempData);
                }
            });
        }
        return () => subs && subs.unsubscribe();
    }, []);
    return (
        <Chart
            height={height}
            data={data}
            renderer='svg'
            scale={defaultCols}
            forceFit>
            <Axis name="genre" title
                label={{
                    autoRotate: true,
                    formatter(text) {
                        return text;
                    },
                }} />
            <Axis name="sold" title />
            {/* <Legend position="top" /> */}
            <Tooltip />
            <Geom type="interval" position="genre*sold" color="genre" />
        </Chart>

    );
}

export default ColumnCharts;