import Echarts from '@/components/DashBoard/echarts';
import { useEffect, useState } from 'react';
import type { EChartsOption } from 'echarts';

interface Props {
  value: number;
  color: array;
  image: string;
}

const Pie = (props: Props) => {
  const [options, setOptions] = useState<EChartsOption>({});
  useEffect(() => {
    setOptions({
      color: props.color || ['#D3ADF7', '#979AFF'],
      graphic: [
        {
          type: 'image',
          style: {
            image: props.image || '',
            width: 16,
            height: 16,
          },
          left: 'center',
          top: '41%',
        },
      ],
      series: [
        {
          type: 'pie',
          radius: ['100%', '60%'],
          center: ['50%', '50%'],
          label: {
            show: false,
          },
          data: [100 - props.value, props.value],
          itemStyle: {
            // borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
        },
      ],
    });
  }, [props.value]);

  return (
    <div style={{ width: '100%', height: 80 }}>
      <Echarts options={options} />
    </div>
  );
};

export default Pie;
