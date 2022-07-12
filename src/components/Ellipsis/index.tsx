import { useState, useRef, useEffect } from 'react';
import { unmountComponentAtNode } from 'react-dom';
import { useSize } from 'ahooks';
import Style from './index.less';
import classnames from 'classnames';
import { Tooltip } from 'antd';

interface EllipsisProps {
  title?: string;
  maxWidth?: string | number;
  titleStyle?: CSSStyleSheet;
  titleClassName?: string;
  showToolTip?: boolean;
  /**
   * @default 1
   */
  row?: 1 | 2 | 3 | 4;
}

export default (props: EllipsisProps) => {
  const parentNode = useRef<HTMLDivElement | null>(null);
  const extraNode = useRef<HTMLDivElement | null>(null);
  const titleNode = useRef<HTMLDivElement | null>(null);
  const parentSize = useSize(parentNode.current);
  const extraSize = useSize(extraNode.current);
  const [isEllipsis, setIsEllipsis] = useState(false);
  // const [show, setShow] = useState(false);

  useEffect(() => {
    if (extraSize.width && parentSize.width) {
      if (extraSize.width > parentSize.width * (props.row || 1)) {
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
  }, [props.title, extraSize]);

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
    <div className={Style['ellipsis-warp']} ref={parentNode}>
      {isEllipsis && props.showToolTip !== false ? (
        <Tooltip title={props.title}>{ellipsisNode}</Tooltip>
      ) : (
        ellipsisNode
      )}
      <div
        className={classnames(props.titleClassName, Style['ellipsis-max'])}
        style={{ ...props.titleStyle, width: 'max-content !important' }}
        ref={extraNode}
      >
        {props.title}
      </div>
    </div>
  );
};
