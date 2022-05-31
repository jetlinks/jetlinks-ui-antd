import Header from './header';
import type { HeaderProps } from './header';
import Echarts from './echarts';
import type { EchartsProps } from './echarts';
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
      className={classNames(Style['dash-board-echarts'], className)}
      style={{
        height: height || 200,
      }}
    >
      <Header ref={ref} {...formProps} />
      <Echarts options={options} />
    </div>
  );
});
