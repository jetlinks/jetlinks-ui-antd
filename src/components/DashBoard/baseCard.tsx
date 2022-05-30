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
  return (
    <div
      className={classNames(Style['dash-board-echarts'], props.className)}
      style={{
        height: props.height || 200,
      }}
    >
      <Header
        title={props.title}
        onParamsChange={props.onParamsChange}
        extraParams={props.extraParams}
        initialValues={props.initialValues}
      />
      <Echarts options={props.options} />
    </div>
  );
};
