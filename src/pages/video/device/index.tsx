import React, { useState } from 'react';
import styles from './index.less';
import Left from './left';
import Right from './right';

function Device() {

  return (
    <div className={styles.device}>
      <Left />
      <Right />
    </div>
  );
}

export default Device;
