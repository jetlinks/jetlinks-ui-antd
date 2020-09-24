import { Chart, Coord, Geom, Label, Tooltip } from "bizcharts";
import React, { useEffect, useState } from "react";

interface Props {
    failed: number,
    failedTypeCounts: any
}
const Error: React.FC<Props> = props => {
    const { failedTypeCounts } = props;
    const [data, setData] = useState<any[]>([]);
    useEffect(() => {
        let t: any[] = [];
        Object.keys(failedTypeCounts || {}).forEach(i => t.push({ name: i, value: failedTypeCounts[i] }));
        setData(t);
    }, [failedTypeCounts])


    return (
        <Chart
            height={200}
            data={data}
            forceFit
        >
            <span className='sub-title' style={{ marginLeft: 40, fontWeight: 700 }}>
                失败类型统计
             </span>
            <Coord type="theta" />
            <Tooltip showTitle={false} />
            <Geom
                type="intervalStack"
                position="value"
                color="name"
            >
                <Label content="name" />
            </Geom>
        </Chart>
    )
}
export default Error;