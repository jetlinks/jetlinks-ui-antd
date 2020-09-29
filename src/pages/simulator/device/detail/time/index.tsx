import { Axis, Chart, Geom, Tooltip } from "bizcharts";
import React, { useEffect, useState } from "react";
import { Observable } from "rxjs";
import { filter, map, mergeMap, toArray, windowCount } from "rxjs/operators";

interface Props {
    time: any
}
const Time: React.FC<Props> = props => {

    const { time } = props;
    const [data, setData] = useState<any>([]);
    useEffect(() => {
        // 后端提供了distTimeList字段，可直接取。
        new Observable(sink => {
            Object.keys(time || {}).forEach(e => sink.next({ time: e, value: time[e] }));
            sink.complete();
        }).pipe(
            windowCount(2, 1),
            mergeMap(i => i.pipe(toArray())),
            filter(arr => arr.length > 0),
            map((arr: any[]) => ({
                label: arr.length === 1 ?
                    `>=${arr[0].time}` :
                    arr.map(i => i.time).join('~'), value: arr[0].value
            })),
            toArray(),
        ).subscribe((result) => { setData(result) })

    }, [time]);

    const cols = {
        label: {
            min: 0,
            max: 100,
            alias: 'ms'
        },
        value: {
            alias: '次',
            min: 0,
            ticks: [0, 40, 80, 120, 160]
        }
    };
    // x :ms 
    // y :个
    return (
        <Chart height={350} data={data} scale={cols} forceFit>

            <span className='sub-title' style={{ marginLeft: 40, fontWeight: 700 }}>
                连接时间分布
             </span>
            <Axis name="label"
                label={{ autoRotate: false }}
                title={{
                    autoRotate: false,
                    position: 'end',
                    offset: 15,
                    textStyle: {
                        fontSize: '12',
                        textAlign: 'center',
                        fill: '#999',
                        fontWeight: 'bold',
                        // rotate: 0,
                    }
                }} />
            <Axis name="value"
                label={{ autoRotate: false }}
                title={{
                    autoRotate: false,
                    position: 'center',
                    offset: 40,
                    textStyle: {
                        fontSize: '12',
                        textAlign: 'right',
                        fill: '#999',
                        fontWeight: 'bold',
                        rotate: 0,
                    }
                }} />
            <Tooltip
                crosshairs={{
                    type: "y"
                }}
            />
            <Geom type="interval" position="label*value" />
        </Chart>
    )
}
export default Time;