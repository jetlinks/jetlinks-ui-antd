import React from 'react';
import './index.less';
import classNames from 'classnames';

interface ItemGroupProps {
  children?: React.ReactNode;
  compact?: boolean;
  style?: React.CSSProperties;
}

export default (props: ItemGroupProps) => {
  return (
    <div
      className={classNames('group-item-compact', {
        compact: 'compact' in props && props.compact !== false,
      })}
      style={props.style}
    >
      {props.children}
    </div>
  );
};
