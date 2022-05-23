import { Spin } from 'antd';
import * as echarts from 'echarts';
import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';

interface Props {
  data: any[];
  min: any;
  max: any;
}

const Charts = (props: Props) => {
  const myChart: any = useRef(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    if ((props?.data || []).length > 2) {
      const dom = document.getElementById('charts');
      if (dom) {
        const option = {
          dataZoom: [
            {
              type: 'inside',
              start: 0,
              end: 10,
            },
            {
              start: 0,
              end: 10,
            },
          ],
          tooltip: {
            trigger: 'axis',
            position: function (pt: any) {
              return [pt[0], '10%'];
            },
          },
          xAxis: {
            type: 'category',
            data: _.map(props?.data, (item) => {
              return echarts.format.formatTime('yyyy-MM-dd\nhh:mm:ss', item.year, false);
            }),
            name: '时间',
          },
          yAxis: {
            type: 'value',
            name: props?.data[0].type,
          },
          series: [
            {
              data: _.map(props?.data, 'value'),
              type: 'line',
              areaStyle: {},
            },
          ],
        };
        myChart.current = myChart.current || echarts.init(dom);
        myChart.current.setOption(option);
        setLoading(false);
      }
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 5000);
    }
  }, [props.data]);

  return (
    <Spin spinning={loading}>
      <div id="charts" style={{ width: '100%', height: 500 }}></div>
    </Spin>
  );
};

export default Charts;
