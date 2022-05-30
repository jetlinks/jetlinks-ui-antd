import { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import type { ECharts } from 'echarts';
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
} from 'echarts/components';

import { LineChart } from 'echarts/charts';
import { PieChart } from 'echarts/charts';
import { BarChart } from 'echarts/charts';

import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

import Style from './index.less';
import type { EChartsOption } from 'echarts';

export interface EchartsProps {
  options?: EChartsOption;
}

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
  BarChart,
  MarkLineComponent,
  PieChart,
]);

const DefaultOptions = {
  xAxis: {
    type: 'category',
    data: [0],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      data: [],
      type: 'line',
    },
  ],
};

export default (props: EchartsProps) => {
  const chartsRef = useRef<any>(null);

  const initEcharts = (dom: HTMLDivElement) => {
    chartsRef.current = echarts.init(dom);
    if (props.options) {
      chartsRef.current.setOption(props.options);
    } else {
      chartsRef.current.setOption(DefaultOptions);
    }
  };

  const updateSize = () => {
    if (chartsRef.current) {
      // 自适应屏幕变化
      (chartsRef.current as ECharts).resize();
    }
  };

  const updateOptions = () => {
    if (chartsRef.current && props.options) {
      chartsRef.current.setOption(props.options);
    }
  };

  useEffect(() => {
    (window as Window).addEventListener('resize', updateSize);

    return () => {
      (window as Window).removeEventListener('resize', updateSize);
    };
  }, []);

  useEffect(() => {
    updateOptions();
  }, [props.options, chartsRef.current]);

  return (
    <div
      className={Style.content}
      ref={(ref) => {
        if (ref) {
          setTimeout(() => {
            initEcharts(ref);
          }, 100);
        }
      }}
    />
  );
};
