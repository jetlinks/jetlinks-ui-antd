import React, { useState, useEffect } from "react";
import { Chart, Axis, Geom } from "bizcharts";
import { Tooltip, message } from "antd";
import { ComponentProps } from "..";

interface Props extends ComponentProps {
    config: {
        title: string,
        data: object,
        cols: object,
    }
}

const LineChart = (props: Props) => {
    const defaultData = [
        {
            year: "1991",
            value: 3
        },
        {
            year: "1992",
            value: 4
        },
        {
            year: "1993",
            value: 3.5
        },
        {
            year: "1994",
            value: 5
        },
        {
            year: "1995",
            value: 4.9
        },
        {
            year: "1996",
            value: 6
        },
        {
            year: "1997",
            value: 7
        },
        {
            year: "1998",
            value: 9
        },
        {
            year: "1999",
            value: 13
        }
    ];
    const defaultCols = {
        value: {
            min: 0,
            range: [0, 0.93],
            alias: '次'
        },
        year: {
            range: [0, 0.9],
            alias: '时间'
        }
    };

    const [config] = useState(props.config && props.config.data ? props.config :
        {
            title: '折线图',
            data: defaultData,
            cols: defaultCols,
        });

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
        if (props.preview) {
            props.preview(() => 'https://www.baidu.com/link?url=kuSzeluGn9dkOqcDvPcvU5g1gh-DMms6auTTUACJkdPm559tFM6GRDYkHE7p8fSHDl-RSOc5KeDGQBCictIOZsdgBL5Ds_kDaZCu1qgx99BitlSq6ocOJp3htq0bW7IoATv4Y0I33tKGyQL-bBDOuAqHvqsLeQiWlDuR0KCJiA3u-SswRJhJQHgREuKPOHszUZ0L_9oieMXOwCY0HYUDGsIKBjIMNoV3x6CFP4h63kPC3rmMwKTs-0WtEa1VceLscigtzPQiQmqZqlctYr1JX1IWLbR6r6rNcvQvP2o8NqaHqfzcG0tTiE6y7fSgM9D2N1E9ON8yyBf8iRnPOIzjfc6p2FPMmuM6_Rc6cBFhhPC_ujQWj4kc_CveBLiapyLMDS4E1KVznYHYWSz_OiK-DZIvGqriXnBUCz5j25CgJFm_mMK-LrwLAXkHY_2BzRr4WQFBMoOzesktllvUaOmzlkircgLMGRVKQZRubOzkJ0ocCySDlUKSyNeIX01yGRGGOZ5EEBoPD6BVVUFCKKUUEEp6NEj-6vVN_Jihgk-_W1J--9a9PKRuXKuS0EbKjvySdY3f5ink5eax6jvSvv7GNywDh1E6slJqj8rHTBQO32niX9mPlD9vfLrbOxSUcTBO_GUmwK6K7OIZSCUChT3Lpuwv38Lr8vlFbuUdZIB2tSO1lDLjDshWgPlic54ECPb4TLsGMdlJg8p8q_BLL4Qdly75nte91d1jYcb3EbEbFViLVewOfeOspKTyimZFT-G0Qe15r1klAAZvt7dD5LBqu_Nh89uLs4_ZZ4jhQJKBSLm&timg=&click_t=1587465382772&s_info=1622_978&wd=&eqid=e5c3ddcc00000e74000000065e9ecca5')
        }
    }, []);
    return (
        <Chart
            height={height}
            data={config.data}
            scale={config.cols}
            forceFit>
            <Axis name="year" title={{
                position: 'end',
                offset: 15,
                textStyle: {
                    fontSize: '12',
                    textAlign: 'center',
                    fill: '#999',
                    fontWeight: 'bold',
                    rotate: 0,
                }
            }} />
            <Axis name="value" title={{
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