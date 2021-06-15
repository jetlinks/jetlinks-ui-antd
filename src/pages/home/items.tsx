import React, { memo } from 'react';
import styles from './index.less';

interface ItemsProps {
  title?: string
  children?: React.ReactNode
  style?: React.CSSProperties
  className?: string
  contentClass?: string
}

function Items(props: ItemsProps) {
  const { title, style, className, contentClass } = props

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        ...style
      }}
      className={`${styles.itemContent} ${className || ''}`}>
      {
        title ? <div className={styles.title}>{title}</div> : null
      }
      <div className={`${styles.content} ${contentClass || ''}`}>
        {props.children}
      </div>
    </div>
  );
}

export default memo(Items);
