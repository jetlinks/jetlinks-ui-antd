import { Axis, Chart, Geom, Tooltip } from "bizcharts";
import React from "react";

const Time: React.FC = props => {
    const data = [
        {
            year: "1951 年",
            sales: 38
        },
        {
            year: "1952 年",
            sales: 52
        },
        {
            year: "1956 年",
            sales: 61
        },
        {
            year: "1957 年",
            sales: 145
        },
        {
            year: "1958 年",
            sales: 48
        },
        {
            year: "1959 年",
            sales: 38
        },
        {
            year: "1960 年",
            sales: 38
        },
        {
            year: "1962 年",
            sales: 38
        }
    ];
    const cols = {
        sales: {
            tickInterval: 20
        }
    };
    return (
        <Chart height={200} data={data} scale={cols} forceFit>
            <span className='sub-title' style={{ marginLeft: 40, fontWeight: 700 }}>
                时间分布
             </span>
            <Axis name="year" />
            <Axis name="sales" />
            <Tooltip
            // crosshairs用于设置 tooltip 的辅助线或者辅助框
            // crosshairs={{
            //  type: "y"
            // }}
            />
            <Geom type="interval" position="year*sales" />
        </Chart>
    )
}
export default Time;