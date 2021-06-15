import React, { useEffect, useState } from 'react';
import { Chart, Facet } from 'bizcharts';
import DataSet from '@antv/data-set';
import styles from './Echarts.less';

interface EchartsProps {
  value?: number
  color?: string
  title?: string
}

function Echarts(props: EchartsProps) {

  const { value, color, title } = props

  const [data, setData] = useState([
    { type: '使用率', value: 0.0 }
  ])

  useEffect(() => {
    data[0].value = value || 0
    setData(data)
  }, [value])

  const { DataView } = DataSet

  return (
    <div className={styles.echarts}>
      <div className={styles.content}>
        <Chart
          forceFit
          height={112}
          width={112}
          data={data}
          padding={'auto'}
        >
          <Facet
            type="rect"
            eachView={(view, facet) => {
              const _data = facet.data;
              console.log('facet.data', _data);
              const dv = new DataView();
              let _color = color || '#FF4D4F'
              _data.push({
                type: '其他',
                value: (100 - _data[0].value)
              })
              console.log(_data[0].value, (100 - _data[0].value));
              dv.source(_data).transform({
                type: "percent",
                field: "value",
                dimension: "type",
                as: "percent"
              });
              view.source(dv);
              view.coord("theta", {
                innerRadius: 0.6
              });
              view
                .intervalStack()
                .position("percent")
                .color("type", [_color, '#eceef1'])
            }}
          />
        </Chart>
      </div>
      <div className={styles.right}>
        <div className={styles.title}>{title}</div>
        <h2 className={styles.value}>{value || '/'}</h2>
      </div>
    </div>
  );
}

export default Echarts;
