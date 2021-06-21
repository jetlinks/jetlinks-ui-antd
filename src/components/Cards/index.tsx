import React, { useState } from 'react';
import { Radio, Icon } from 'antd';
import Table, { ColumnProps } from 'antd/lib/table';
import styles from './index.less';

interface CardsProps {
  title: string
  columns: ColumnProps<any>[]
  dataSource: any[]
  col?: number
  toolNode?: React.ReactNode
  extraTool?: React.ReactNode
}

function Cards(props: CardsProps) {
  const [type, setType] = useState('card')

  return (
    <div className={styles.cards}>
      <div className={styles.header}>
        <span>{props.title}</span>
        <div>
          <div>
            {props.toolNode}
          </div>
          <Radio.Group value={type} onChange={e => {
            setType(e.target.value)
          }}>
            <Radio.Button value='table'>
              <Icon type="unordered-list" />
            </Radio.Button>
            <Radio.Button value='card'>
              <Icon type="appstore" />
            </Radio.Button>
          </Radio.Group>
        </div>
      </div>
      {
        props.extraTool ? <div>{props.extraTool}</div> : null
      }
      <div className={styles.content}>
        {
          type === 'card' ?
            props.dataSource.map(item => <div style={{ flex: `1 0 ${100 / (props.col || 4)}%` }}>{item.component}</div>) :
            <Table
              columns={props.columns}
              dataSource={props.dataSource}
            />
        }
      </div>
    </div>
  );
}

export default Cards;
