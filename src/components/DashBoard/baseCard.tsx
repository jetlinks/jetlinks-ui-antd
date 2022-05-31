import Header from './header';
import type { HeaderProps } from './header';
import Echarts from './echarts';
import type { EchartsProps } from './echarts';
import Style from './index.less';
import classNames from 'classnames';

interface BaseCardProps extends HeaderProps, EchartsProps {
  height: number;
  className?: string;
}

export default (props: BaseCardProps) => {
  const { height, className, options, ...formProps } = props;
  return (
    <div
      className={classNames(Style['dash-board-echarts'], className)}
      style={{
        height: height || 200,
      }}
    >
      <Header {...formProps} />
      <Echarts options={options} />
    </div>
  );
};
