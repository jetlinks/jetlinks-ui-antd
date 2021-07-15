import React, { useState } from 'react';
import styles from './index.less';
import Left from './left';
import Right from './right';

function Device() {

  const [rowData, setRowData] = useState(null)

  return (
    <div className={styles.device}>
      <Left onRowClick={(data) => {
        setRowData(data)
      }} />
      <Right
        rowData={rowData}
      />
    </div>
  );
}

export default Device;
