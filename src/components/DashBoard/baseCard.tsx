import type { HeaderProps } from './header';
import Header from './header';
import type { EchartsProps } from './echarts';
import Echarts from './echarts';
import Style from './index.less';
import classNames from 'classnames';
import { forwardRef } from 'react';

interface BaseCardProps extends HeaderProps, EchartsProps {
  height: number;
  className?: string;
}

export default forwardRef((props: BaseCardProps, ref) => {
  const { height, className, options, ...formProps } = props;

  return (
    <div
      className={classNames(Style['dash-board'], className)}
      style={{
        height: height || 200,
      }}
    >
      <Header ref={ref} {...formProps} />
      <Echarts options={options} className={Style['echarts']} />
    </div>
  );
});
