import { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import type { ECharts, EChartsOption } from 'echarts';
import {
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
} from 'echarts/components';

import { BarChart, LineChart, PieChart } from 'echarts/charts';

import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

import Style from './index.less';
import classNames from 'classnames';

export interface EchartsProps {
  options?: EChartsOption;
  className?: string;
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

export { echarts };

export default (props: EchartsProps) => {
  const chartsRef = useRef<any>(null);

  const initEcharts = (dom: HTMLDivElement) => {
    chartsRef.current = chartsRef.current || echarts.init(dom);
    // chartsRef.current.clear()
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

  useEffect(() => {
    setTimeout(() => (window as Window).addEventListener('resize', updateSize), 100);
    return () => {
      (window as Window).removeEventListener('resize', updateSize);
      if (chartsRef.current) {
        // chartsRef.current.clear();
        chartsRef.current.dispose();
        chartsRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (chartsRef.current && props.options) {
      // chartsRef.current.clear()
      chartsRef.current.setOption(props.options);
    }
  }, [props.options, chartsRef.current]);

  return (
    <div
      className={classNames(Style['content'], props.className)}
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
