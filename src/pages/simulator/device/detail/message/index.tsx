import React from "react";
import {
    Chart,
    Tooltip,
    Axis,
    Legend, Geom
} from 'bizcharts';
import DataSet from '@antv/data-set';

interface Props {
    runtimeHistory: {
        time: string,
        totalDownstream: number,
        totalDownstreamBytes: number,
        totalUpstream: number,
        totalUpstreamBytes: number
    }[]
}
const Message: React.FC<Props> = props => {
    const { runtimeHistory } = props;
    const { DataView } = DataSet;
    console.log((runtimeHistory || []).map(e => ({
        totalDownstream: -e.totalDownstream,
        totalDownstreamBytes: -(e.totalDownstreamBytes / 1024).toFixed(2),
        totalUpstream: e.totalUpstream,
        totalUpstreamBytes: (e.totalUpstreamBytes / 1024)
    })))
    const dv = new DataView().source((runtimeHistory || []).map(e => ({
        time: e.time,
        totalDownstream: -e.totalDownstream,
        totalDownstreamBytes: -(e.totalDownstreamBytes / 1024).toFixed(2),
        totalUpstream: e.totalUpstream,
        totalUpstreamBytes: Number((e.totalUpstreamBytes / 1024).toFixed(2))
    })));
    dv.transform({
        type: "fold",
        fields: ["totalDownstream", "totalDownstreamBytes", "totalUpstream", "totalUpstreamBytes"],
        // 展开字段集
        key: "type",
        // key字段
        value: "value" // value字段
    });
    const cols = {
        time: {
            range: [0, 1]
        }
    };
    return (
        <Chart height={250} data={dv} scale={cols} forceFit>
            <span className='sub-title' style={{ marginLeft: 40, fontWeight: 700 }}>
                消息统计
             </span>
            <Axis name="time" />
            <Axis
                name="value"
            // label={{
            //     formatter: val => {
            //         return (val / 10000).toFixed(1);
            //     }
            // }}
            />
            <Legend />
            <Tooltip
                crosshairs={{
                    type: "line"
                }}
            />
            <Geom type="area" position="time*value" color="type" />
            <Geom type="line" position="time*value" size={2} color="type" />
        </Chart>
    )

}
export default Message;