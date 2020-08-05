import React from "react";
import {Axis, Chart, Geom, Legend, Tooltip} from "bizcharts";
import autoHeight from '../autoHeight';
import DataSet from "@antv/data-set";

export interface IGaugeProps {
  data: Array<{
    year: string;
    value: number;
    type: string
  }>;
  ticks: any[];
  height: number;
  display: string;
}

class Withnegative extends React.Component<IGaugeProps> {
  render() {
    const {
      data,
      height,
      ticks,
      display
    } = this.props;
    const {DataView} = DataSet;

    const dv = new DataView().source(data);
    dv.transform({
      type: "fold",
      fields: [display],
      // 展开字段集
      key: "type",
      // key字段
      value: display // value字段
    });
    const cols = {
      year: {
        range: [0, 1],
        ticks
      },
    };
    return (
      <div>
        <Chart height={height} data={dv} scale={cols} forceFit>
          <Axis name="year"/>
          <Axis
            name="value"
            label={{
              formatter: val => parseFloat(val).toLocaleString()
            }}
          />
          <Legend/>
          <Tooltip />
          <Geom type="area" position="year*value" color="type"/>
          <Geom type="line" position="year*value" size={2} color="type"/>
        </Chart>
      </div>
    );
  }
}

export default autoHeight()(Withnegative);
