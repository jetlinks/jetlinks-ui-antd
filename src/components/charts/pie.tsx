import React, { useEffect, useState } from "react";
import F2 from '@antv/f2';
import CanvasF2 from "../CanvasF2";
const {
  Shape,
  G,
  Util,
  Global
} = F2;
const Vector2 = G.Vector2;
Shape.registerShape('interval', 'polar-tick', {
  draw: function draw(cfg, container) {
    const points = this.parsePoints(cfg.points);
    const style = Util.mix({
      stroke: cfg.color
    }, Global.shape.interval, cfg.style);

    let newPoints = points.slice(0);
    if (this._coord.transposed) {
      newPoints = [points[0], points[3], points[2], points[1]];
    }

    const center = cfg.center;
    const x = center.x,
      y = center.y;


    const v = [1, 0];
    const v0 = [newPoints[0].x - x, newPoints[0].y - y];
    const v1 = [newPoints[1].x - x, newPoints[1].y - y];
    const v2 = [newPoints[2].x - x, newPoints[2].y - y];

    let startAngle = Vector2.angleTo(v, v1);
    let endAngle = Vector2.angleTo(v, v2);
    const r0 = Vector2.length(v0);
    const r = Vector2.length(v1);

    if (startAngle >= 1.5 * Math.PI) {
      startAngle = startAngle - 2 * Math.PI;
    }

    if (endAngle >= 1.5 * Math.PI) {
      endAngle = endAngle - 2 * Math.PI;
    }

    const lineWidth = r - r0;
    const newRadius = r - lineWidth / 2;

    return container.addShape('Arc', {
      className: 'interval',
      attrs: Util.mix({
        x,
        y,
        startAngle,
        endAngle,
        r: newRadius,
        lineWidth,
        lineCap: 'round',
      }, style)
    });
  }
});
interface Props {
  data: any
  title: string
  id: string
}

const Pie: React.FC<Props> = (props) => {

  const onInit = (config: any) => {
    const chart = new F2.Chart({
      ...config
    })
    // charts=chart
    chart.source(props.data, {
      y: {
        max: 100,
        min: 0
      }
    });
    chart.axis(false);
    chart.tooltip(false);
    chart.coord('polar', {
      transposed: true,
      innerRadius: 0.8,
      radius: 0.85
    });
    chart.guide().arc({
      start: [0, 0],
      end: [1, 99.98],
      top: false,
      style: {
        lineWidth: 14,
        stroke: '#ccc'
      }
    });
    chart.guide().text({
      position: ['50%', '50%'],
      content: `${props.title}\n${props.data[0].y}%`,
      style: {
        fill: '#1890FF'
      }
    });
    chart.interval()
      .position('x*y')
      .size(14)
      .shape('polar-tick')
      .color('l(90) 0:#1890ff 1:#70cdd0')
      .animate({
        appear: {
          duration: 1200,
          easing: 'cubicIn'
        }
      });

    chart.render();
    return chart
  }
  useEffect(() => {
    // console.log(onInit)
  }, [props.data])
  return (
    <CanvasF2
      id={props.id}
      style={{ width: '100%', height: '100%' }}
      onInit={onInit}
    />
  )
}

export default Pie;