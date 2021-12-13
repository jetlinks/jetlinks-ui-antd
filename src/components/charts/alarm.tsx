import React from "react";
import F2 from '@antv/f2';
import CanvasF2 from "../CanvasF2";

interface Props {
  data: any
}

const Alarm: React.FC<Props> = (props) => {

  const onInit = (config: any) => {
    const map = {};
    props.data.forEach((item: any) => {
      map[item.name] = item.percent;
    })
    const chart = new F2.Chart({
      ...config,
      padding: [20, 'auto']
    })
    
chart.source(props.data, {
    sales: {
      tickCount: 5
    }
  });
  chart.tooltip({
    showItemMarker: false,
    onShow: function onShow(ev) {
      const items = ev.items;
      items[0].name = null;
      items[0].name = items[0].title+'告警数';
      items[0].value = items[0].value;
    }
  });
  
  chart.interval()
    .position('year*sales')
    .color('l(90) 0:#1890ff 1:#70cdd0'); // 定义柱状图渐变色
    chart.render();
    return chart
  }
  return (
    <CanvasF2
      id='alarm'
      style={{ width: '100%', height: '100%' }}
      onInit={onInit}
    />
  )
}

export default Alarm;