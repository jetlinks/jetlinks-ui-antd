import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import Styles from './index.less';

export default class LineWrap extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    height: PropTypes.number
  };

  render() {
    const { title,height } = this.props;
    return (
      <Tooltip placement="topLeft" title={title} style={{lineHeight: 17}}>
        <span className={Styles.col} style={{height: height}}>
          {title}
        </span>
      </Tooltip>
    );
  }
}
