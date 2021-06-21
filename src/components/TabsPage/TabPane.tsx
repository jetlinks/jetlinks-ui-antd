import React from 'react';
import styles from './tabpane.less';

export interface TabPaneProps {
  title: string
  International?: string | React.ReactNode
  img?: string
  children: React.ReactNode;
  tabKey?: string
  className?: string
  active?: boolean;
  forceRender?: boolean
}

function TabPane({
  children,
  className,
  active,
}: TabPaneProps) {

  const mergedStyle: React.CSSProperties = {};
  if (!active) {
    mergedStyle.display = 'none';
  }

  return (
    <div
      tabIndex={active ? 0 : -1}
      aria-hidden={!active}
      style={{ ...mergedStyle }}
      className={`${styles.tabpanel} ${active && styles.active} ${className || ''}`}
    >
      {active && children}
    </div>
  );
}

export default TabPane;
