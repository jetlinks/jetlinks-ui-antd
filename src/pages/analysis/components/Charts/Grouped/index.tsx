import React from 'react';
import { Axis, Chart, Coord, Geom, Legend, Tooltip } from 'bizcharts';
import DataSet from '@antv/data-set';
import autoHeight from '@/pages/analysis/components/Charts/autoHeight';

export interface IGaugeProps {
  color?: string;
  height?: number;
  bgColor?: number;
  data: Array<{
    x: string;
    消息量: number;
  }>;
  forceFit?: boolean;
  style?: React.CSSProperties;
  formatter: (value: string) => string;
}

class Grouped  extends React.Component<IGaugeProps> {
    render() {
      const {
        data,
        height = 1,
      } = this.props;

    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.transform({
      type: "fold",
      fields: ["消息量"],
      // 展开字段集
      key: "type",
      // key字段
      value: "value" // value字段
    });
    return (
      <div>
        <Chart height={height} data={dv} forceFit>
          <Legend />
          <Coord transpose scale={[1, -1]} />
          <Axis
            name="label"
            label={{
              offset: 12
            }}
          />
          <Axis name="value" position={"right"} />
          <Tooltip />
          <Geom
            type="interval"
            position="label*value"
            color="type"
            adjust={[
              {
                type: "dodge",
                marginRatio: 1 / 32
              }
            ]}
          />
        </Chart>
      </div>
    );
  }
}

export default autoHeight()(Grouped);
