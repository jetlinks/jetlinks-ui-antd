import React from "react";
import F2 from '@antv/f2';
import CanvasF2 from "../CanvasF2";

interface Props {
    data:any
}

const Pie: React.FC<Props> = (props) => {

    const onInit = (config:any) =>{
        const chart = new F2.Chart({
            ...config
        })
        chart.source(props.data, {
            cpu: {
              max: 100,
              min: 0
            }
          });
          chart.axis(false);
          chart.tooltip({
            alwaysShow: false,
          });
          chart.coord('polar', {
            transposed: true,
            innerRadius: 0.8,
            radius: 0.85
          });
          chart.guide().arc({
            start: [ 0, 0 ],
            end: [ 1, 99.98 ],
            top: false,
            style: {
              lineWidth: 20,
              stroke: '#ccc'
            }
          });
          chart.guide().text({
            position: [ '50%', '50%' ],
            content: `CPU使用率${props.data[0].cpu}%`,
            style: {
              fill: '#1890FF'
            }
          });
          chart.interval()
            .position('x*cpu')
            .size(20)
            .animate({
              appear: {
                duration: 1200,
                easing: 'cubicIn'
              }
            });
          chart.render();
          return chart
    }
    return (
        <CanvasF2
            id='pie'
            style={{width:'100%',height:'100%'}}
            onInit={onInit}
         />
    )
}

export default Pie;