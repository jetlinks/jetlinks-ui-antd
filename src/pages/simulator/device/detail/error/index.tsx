import DataSet from "@antv/data-set";
import { Axis, Chart, Coord, Geom, Guide, Label, Legend, Tooltip } from "bizcharts";
import React from "react";

const Error: React.FC = props => {
    const { DataView } = DataSet;
    const { Html } = Guide;
    const data = [
        {
            item: "事例一",
            count: 40
        },
        {
            item: "事例二",
            count: 21
        },
        {
            item: "事例三",
            count: 17
        },
    ];
    const dv = new DataView();
    dv.source(data).transform({
        type: "percent",
        field: "count",
        dimension: "item",
        as: "percent"
    });
    const cols = {
        percent: {
            formatter: val => {
                val = val * 100 + "%";
                return val;
            }
        }
    };
    return (
        <Chart
            height={200}
            data={dv}
            scale={cols}
            padding={[80, 100, 80, 80]}
            forceFit
        >
            <span className='sub-title' style={{ marginLeft: 40, fontWeight: 700 }}>
                失败类型 <span className='sub-title' style={{ marginLeft: 40, fontWeight: 700 }}>
                    消息统计
             </span>统计
             </span>
            <Coord type={"theta"} radius={0.75} innerRadius={0.6} />
            <Axis name="percent" />
            <Legend
                position="bottom"
            />
            <Tooltip
                showTitle={false}
                itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
            />
            <Guide>
                <Html
                    position={["50%", "50%"]}
                    html="<div style=&quot;color:#8c8c8c;font-size:1.16em;text-align: center;width: 10em;&quot;>主机<br><span style=&quot;color:#262626;font-size:2.5em&quot;>200</span>台</div>"
                    alignX="middle"
                    alignY="middle"
                />
            </Guide>
            <Geom
                type="intervalStack"
                position="percent"
                color="item"
                tooltip={[
                    "item*percent",
                    (item, percent) => {
                        percent = percent * 100 + "%";
                        return {
                            name: item,
                            value: percent
                        };
                    }
                ]}
                style={{
                    lineWidth: 1,
                    stroke: "#fff"
                }}
            >
                <Label
                    content="percent"
                    formatter={(val, item) => {
                        return item.point.item + ": " + val;
                    }}
                />
            </Geom>
        </Chart>
    )
}
export default Error;