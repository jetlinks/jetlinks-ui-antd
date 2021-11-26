import React from "react";
import F2 from '@antv/f2';
import CanvasF2 from "../CanvasF2";

interface Props {
  data: any
}

const DevicePie: React.FC<Props> = (props) => {

  const onInit = (config: any) => {
    const map = {};
    props.data.forEach((item: any) => {
      map[item.name] = item.percent + '%';
    })
    const chart = new F2.Chart({
      ...config,
      padding: [20, 'auto']
    })
    chart.source(props.data, {
      percent: {
        formatter: function formatter(val) {
          return val + '%';
        }
      }
    });
    chart.tooltip(false);
    chart.legend({
      position: 'right',
      itemFormatter: function itemFormatter(val) {
        return val + '    ' + map[val];
      }
    });
    chart.coord('polar', {
      transposed: true,
      innerRadius: 0.7,
      radius: 0.85
    });
    chart.axis(false);
    chart.interval()
      .position('a*percent')
      .color('name', ['#3ba1ff', '#4fcb74', '#fbd438'])
      .adjust('stack');

    chart.guide().text({
      position: ['50%', '50%'],
      content:
        `总在线数:1`,
      style: {
        fill: '#1890FF'
      }
    });
    // chart.guide().html({
    //   position: [ '50%', '45%' ],
    //   html: `<div style="width: 250px;height: 40px;text-align: center;">
    //       <div style="font-size: 16px">总资产</div>
    //       <div style="font-size: 24px">133.08 亿</div>
    //     </div>`
    // });
    chart.render();
    return chart
  }
  return (
    <CanvasF2
      id='device'
      style={{ width: '100%', height: '100%' }}
      onInit={onInit}
    />
  )
}

export default DevicePie;