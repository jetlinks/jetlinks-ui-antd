import React from 'react';
import './index.less';

interface ItemGroupProps {
  children?: React.ReactNode;
}

export default (props: ItemGroupProps) => {
  return <div className={'group-item-compact'}>{props.children}</div>;
};
