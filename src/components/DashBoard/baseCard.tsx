import type { HeaderProps } from './header';
import Header from './header';
import type { EchartsProps } from './echarts';
import Echarts from './echarts';
import Style from './index.less';
import classNames from 'classnames';
import React, { forwardRef, useEffect, useState } from 'react';
import { Empty } from '@/components';

interface BaseCardProps extends HeaderProps, EchartsProps {
  height: number;
  className?: string;
  echartsAfter?: React.ReactNode;
}

export default forwardRef((props: BaseCardProps, ref) => {
  const { height, className, options, ...formProps } = props;

  const [myOptions, setMyOptions] = useState(options);

  useEffect(() => {
    console.log('myOptions-change');
    setMyOptions(options);
  }, [options]);
  return (
    <div
      className={classNames(Style['dash-board'], className)}
      style={{
        height: height || 200,
      }}
    >
      <Header ref={ref} {...formProps} />
      <div className={Style['echarts-content']}>
        {!!myOptions?.series?.[0]?.data?.length ? (
          <Echarts options={myOptions} className={Style['echarts']} />
        ) : (
          <Empty />
        )}
        {props.echartsAfter}
      </div>
    </div>
  );
});
