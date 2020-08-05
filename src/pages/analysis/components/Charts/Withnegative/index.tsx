import React from "react";
import {Axis, Chart, Geom, Legend, Tooltip} from "bizcharts";
import autoHeight from '../autoHeight';

export interface IGaugeProps {
  data: Array<{
    type: string;
    year: string;
    value: number;
  }>;
  ticks?: any[];
  height: number;
  lineSize: number;
  color: string;
}

class Withnegative extends React.Component<IGaugeProps> {
  render() {
    const {
      data,
      height,
      lineSize,
      color,
      ticks
    } = this.props;

    const cols = {
      year: {
        range: [0, 1],
        ticks,
      },
    };
    return (
      <div>
        <Chart
          height={height}
          data={data}
          scale={cols}
          forceFit
        >
          <Axis name="year"/>
          <Axis name="value" label={{
            formatter: val => parseFloat(val).toLocaleString()
          }}/>
          <Legend/>
          <Tooltip crosshairs={{type: 'y'}}/>
          <Geom type="line" position="year*value" size={lineSize} color='type'/>
          <Geom
            type="area"
            position="year*value"
            shape={'circle'}
            color='type'
          />
        </Chart>
      </div>
    );
  }
}

export default autoHeight()(Withnegative);
