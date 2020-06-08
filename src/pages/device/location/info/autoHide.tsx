import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import Styles from './index.less';

export default class AutoHide extends PureComponent {
  static propTypes = {
    title: PropTypes.any,
    style: PropTypes.any,
  };

  render() {
    const { title, style } = this.props;
    return (
      <Tooltip placement="topLeft" title={title} style={{ lineHeight: 17 }}>
        <span className={Styles.col} style={style}>
          {title}
        </span>
      </Tooltip>
    );
  }
}
