import React, { useState, useRef, useEffect } from 'react';
import { unmountComponentAtNode } from 'react-dom';
import { useSize } from 'ahooks';
import Style from './index.less';
import classnames from 'classnames';
import { Tooltip } from 'antd';
import type { TooltipProps } from 'antd';

interface EllipsisProps {
  title?: string | number;
  maxWidth?: string | number;
  /**
   * 用于max-width的情况
   */
  limitWidth?: number;
  style?: React.CSSProperties;
  titleStyle?: React.CSSProperties;
  titleClassName?: string;
  showToolTip?: boolean;
  tooltip?: Omit<TooltipProps, 'title'>;
  /**
   * @default 1
   */
  row?: 1 | 2 | 3 | 4;
}

export default (props: EllipsisProps) => {
  const parentNode = useRef<HTMLDivElement | null>(null);
  const extraNode = useRef<HTMLDivElement | null>(null);
  const titleNode = useRef<HTMLDivElement | null>(null);
  const extraSize = useSize(extraNode.current);
  const [isEllipsis, setIsEllipsis] = useState(false);
  // const [show, setShow] = useState(false);

  useEffect(() => {
    if (extraNode.current && props.title) {
      extraNode.current.innerHTML = props.title as string;
      extraNode.current.setAttribute('style', 'display: block');
    }
  }, [props.title, extraNode.current]);

  useEffect(() => {
    if (extraNode.current && parentNode.current) {
      const extraWidth = window.getComputedStyle(extraNode.current).getPropertyValue('width');
      const parentWidth = window.getComputedStyle(parentNode.current).getPropertyValue('width');
      const extraWidthNumber = extraWidth ? Number(extraWidth.replace('px', '')) : 0;
      const parentWidthNumber = parentWidth ? Number(parentWidth.replace('px', '')) : 0;

      // console.log(extraWidthNumber, parentWidthNumber, props.title)
      if (extraWidthNumber && parentWidthNumber) {
        const _width = props.limitWidth
          ? props.limitWidth * (props.row || 1)
          : parentWidthNumber * (props.row || 1);
        if (extraWidthNumber >= _width) {
          setIsEllipsis(true);
        } else {
          setIsEllipsis(false);
        }
        if (extraNode.current) {
          unmountComponentAtNode(extraNode.current);
          extraNode.current.innerHTML = '';
          extraNode.current.setAttribute('style', 'display: none');
        }
      }
    }
  }, [extraSize, extraNode.current]);

  const ellipsisTitleClass = `ellipsis-${props.row || 1}`;

  const ellipsisNode = (
    <div
      ref={titleNode}
      className={classnames(
        'ellipsis-title',
        Style.ellipsis,
        Style[ellipsisTitleClass],
        props.titleClassName,
      )}
      style={{ ...props.titleStyle, width: props.maxWidth || '100%' }}
    >
      {props.title}
    </div>
  );

  return (
    <div className={Style['ellipsis-warp']} style={props.style} ref={parentNode}>
      {isEllipsis && props.showToolTip !== false ? (
        <Tooltip {...props.tooltip} title={props.title}>
          {ellipsisNode}
        </Tooltip>
      ) : (
        ellipsisNode
      )}
      <div
        className={classnames(props.titleClassName?.replace('ellipsis', ''), Style['ellipsis-max'])}
        style={props.titleStyle ? { ...props.titleStyle, width: 'max-content !important' } : {width: 'max-content !important'}}
        ref={extraNode}
      >
        {props.title}
      </div>
    </div>
  );
};
