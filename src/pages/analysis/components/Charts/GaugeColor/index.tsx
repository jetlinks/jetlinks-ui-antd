import React from 'react';
import { Chart, Axis, Coord, Geom, Guide, Shape } from 'bizcharts';

import autoHeight from '../autoHeight';

const { Html, Arc } = Guide;

export interface IGaugeProps {
  height?: number;
  percent: number;
}

// 自定义Shape 部分
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

const color = ['#4ECB73', '#FFBF00', '#F5222D'];
const cols = {
  value: {
    min: 0,
    max: 10,
    tickInterval: 1,
    nice: false,
  },
};

class GaugeColor extends React.Component<IGaugeProps> {

  render() {
    const {
      percent,
      height = 1,
    } = this.props;

    const renderHtml = () => `
    <div style="width: 300px;text-align: center;font-size: 12px!important;">
      <p style="font-size: 24px;color: rgba(0,0,0,0.85);margin: 0;">
        ${(data[0].value * 10).toFixed(1)}%
      </p>
    </div>`;
    const data = [{ value: percent / 10 }];
    const textStyle: {
      fontSize: number;
      fill: string;
      textAlign: 'center';
    } = {
      fontSize: 12,
      fill: 'rgba(0, 0, 0, 0.65)',
      textAlign: 'center',
    };
    const val = data[0].value;
    return (
      <Chart height={height} data={data} scale={cols} padding={[26, 0, 0, 0]} forceFit>
        <Coord type="polar" startAngle={-9 / 8 * Math.PI} endAngle={1 / 8 * Math.PI} radius={0.75} />
        <Axis name="1" line={null} />
        <Axis
          line={null}
          tickLine={undefined}
          subTickLine={undefined}
          name="value"
          zIndex={2}
          label={{
            offset: -12,
            textStyle: textStyle,
          }}
        />
        <Guide>
          <Arc
            zIndex={0}
            start={[0, 0.965]}
            end={[10, 0.965]}
            style={{ // 底灰色
              stroke: 'rgba(0, 0, 0, 0.09)',
              lineWidth: 10,
            }}
          />
          {val >= 5 && <Arc
            zIndex={1}
            start={[0, 0.965]}
            end={[val, 0.965]}
            style={{ // 底灰色
              stroke: color[0],
              lineWidth: 10,
            }}
          />}
          { val >= 8 &&
          <Arc
            zIndex={1}
            start={[5, 0.965]}
            end={[8, 0.965]}
            style={{ // 底灰色
              stroke: color[1],
              lineWidth: 10,
            }}
          />}
          { val >= 8 && val < 10 &&
          <Arc
            zIndex={1}
            start={[8, 0.965]}
            end={[val, 0.965]}
            style={{ // 底灰色
              stroke: color[2],
              lineWidth: 10,
            }}
          />}
          { val >= 5 && val < 8 &&
          <Arc
            zIndex={1}
            start={[5, 0.965]}
            end={[val, 0.965]}
            style={{ // 底灰色
              stroke: color[1],
              lineWidth: 10,
            }}
          />}
          { val < 5 &&
          <Arc
            zIndex={1}
            start={[0, 0.965]}
            end={[val, 0.965]}
            style={{ // 底灰色
              stroke: color[0],
              lineWidth: 10,
            }}
          />}
          <Html
            position={['50%', '95%']}
            html={renderHtml()}
          />
        </Guide>
        <Geom
          type="point"
          position="value*1"
          shape="pointer"
          color="#1890FF"
          active={false}
          style={{ stroke: '#fff', lineWidth: 1 }}
        />
      </Chart>
    );
  }
}

export default autoHeight()(GaugeColor);
