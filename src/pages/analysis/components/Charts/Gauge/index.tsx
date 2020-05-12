import React from 'react';
import { Chart, Geom, Axis, Coord, Guide, Shape } from 'bizcharts';
import autoHeight from '../autoHeight';

const { Arc, Html, Line } = Guide;

export interface IGaugeProps {
  color?: string;
  height?: number;
  bgColor?: number;
  percent: number;
  memoryMax: number;
  forceFit?: boolean;
  style?: React.CSSProperties;
  formatter: (value: string) => string;
}

Shape.registerShape!('point', 'pointer', {
  drawShape(cfg: any, group: any) {
    let point = cfg.points[0];
    point = (this as any).parsePoint(point);
    const center = (this as any).parsePoint({
      x: 0,
      y: 0,
    });
    group.addShape('line', {
      attrs: {
        x1: center.x,
        y1: center.y,
        x2: point.x,
        y2: point.y,
        stroke: cfg.color,
        lineWidth: 2,
        lineCap: 'round',
      },
    });
    return group.addShape('circle', {
      attrs: {
        x: center.x,
        y: center.y,
        r: 6,
        stroke: cfg.color,
        lineWidth: 3,
        fill: '#fff',
      },
    });
  },
});

class Gauge extends React.Component<IGaugeProps> {
  render() {
    const {
      height = 1,
      percent,
      memoryMax,
      forceFit = true,
      color = '#2F9CFF',
      bgColor = '#F0F2F5',
    } = this.props;
    const cols = {
      value: {
        min: 0,
        max: memoryMax / 1024,
        tickInterval: 1,
        nice: false,
      },
    };
    const renderHtml = () => `
    <div style="width: 300px;text-align: center;font-size: 12px!important;">

      <p style="font-size: 24px;color: rgba(0,0,0,0.85);margin: 0;">
        ${(data[0].value).toFixed(2)} G
      </p>
    </div>`;
    const data = [{ value: percent / 1024 }];
    const textStyle: {
      fontSize: number;
      fill: string;
      textAlign: 'center';
    } = {
      fontSize: 12,
      fill: 'rgba(0, 0, 0, 0.65)',
      textAlign: 'center',
    };
    return (
      <Chart height={height} data={data} scale={cols} padding={[26, 0, 0, 0]} forceFit={forceFit}>
        <Coord type="polar" startAngle={-9 / 8 * Math.PI} endAngle={1 / 8 * Math.PI} radius={0.75}/>
        <Axis name="1" line={null}/>
        <Axis
          line={null}
          tickLine={undefined}
          subTickLine={undefined}
          name="value"
          zIndex={2}
          label={{
            offset: -12,
            textStyle,
          }}
        />
        <Guide>
          <Line
            start={[3, 0.905]}
            end={[3, 0.85]}
            lineStyle={{
              stroke: color,
              lineDash: undefined,
              lineWidth: 2,
            }}
          />
          <Line
            start={[5, 0.905]}
            end={[5, 0.85]}
            lineStyle={{
              stroke: color,
              lineDash: undefined,
              lineWidth: 3,
            }}
          />
          <Line
            start={[7, 0.905]}
            end={[7, 0.85]}
            lineStyle={{
              stroke: color,
              lineDash: undefined,
              lineWidth: 3,
            }}
          />
          <Arc
            start={[0, 0.965]}
            end={[memoryMax / 1024, 0.965]}
            style={{
              stroke: bgColor,
              lineWidth: 10,
            }}
          />
          <Arc
            start={[0, 0.965]}
            end={[data[0].value, 0.965]}
            style={{
              stroke: color,
              lineWidth: 10,
            }}
          />
          <Html position={['50%', '95%']} html={renderHtml()}/>
        </Guide>
        <Geom
          line={false}
          type="point"
          position="value*1"
          shape="pointer"
          color={color}
          active={false}
        />
      </Chart>
    );
  }
}

export default autoHeight()(Gauge);
