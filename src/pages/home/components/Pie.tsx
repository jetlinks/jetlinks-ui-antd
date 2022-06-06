import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';

interface Props {
  value: number;
}

const Pie = (props: Props) => {
  const myChart: any = useRef(null);

  useEffect(() => {
    const dom = document.getElementById('charts');
    if (dom) {
      const option = {
        series: [
          {
            type: 'pie',
            radius: [20, 40],
            top: 0,
            height: 70,
            left: 'center',
            width: 70,
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 1,
            },
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            data: [props.value, 100 - props.value],
          },
        ],
      };
      myChart.current = myChart.current || echarts.init(dom);
      myChart.current.setOption(option);
    }
  }, [props.value]);
  return <div id="charts" style={{ width: '100%', height: 80 }}></div>;
};

export default Pie;
