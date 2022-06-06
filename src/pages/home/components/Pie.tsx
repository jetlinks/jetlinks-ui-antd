import Echarts from '@/components/DashBoard/echarts';
import { useEffect, useState } from 'react';
import type { EChartsOption } from 'echarts';

interface Props {
  value: number;
}

const Pie = (props: Props) => {
  const [options, setOptions] = useState<EChartsOption>({});

  useEffect(() => {
    setOptions({
      color: ['#2F54EB', '#979AFF'],
      series: [
        {
          type: 'pie',
          radius: ['100%', '50%'],
          center: ['50%', '50%'],
          width: 80,
          label: {
            show: false,
          },
          data: [props.value, 100 - props.value],
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
