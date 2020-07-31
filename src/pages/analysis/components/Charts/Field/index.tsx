import React from 'react';

import styles from './index.less';
import Styles from "@/pages/device/location/info/index.less";
import {Tooltip} from "antd";

export interface IFieldProps {
  label: React.ReactNode;
  value: React.ReactNode;
  style?: React.CSSProperties;
}

const Field: React.SFC<IFieldProps> = ({ label, value, ...rest }) => (
  <div className={styles.field} {...rest}>
    <span className={styles.label}>{label}</span>
    <Tooltip placement="topLeft" title={value} style={{ lineHeight: 17 }}>
      <span className={styles.number}>{value}</span>
    </Tooltip>
  </div>
);

export default Field;
