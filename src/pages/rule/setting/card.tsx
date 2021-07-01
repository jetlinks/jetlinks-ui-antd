import React from 'react';
import { Badge, Card, message, Switch, Tooltip } from 'antd';
import styles from './card.less';
import AliFont from '@/components/AliFont';
import AutoHide from "@/pages/device/location/info/autoHide";
import { ListData, start, stop } from '@/pages/rule-engine/instance/service';
import { useRequest } from 'ahooks';

export interface CardProps {
  onEdit: (data: ListData) => void
  onReboot: (data: ListData) => void
  onCopy: (data: ListData) => void
  onDelete: (data: ListData) => void
  onStop: (data: ListData) => void
  onStart: (data: ListData) => void
  data: ListData
  id?: string
}

function Cards(props: CardProps) {

  const logoMap = {
    'device_alarm': 'icon-touxiang5',
    'sql_rule': 'icon-shujuzhuanfa',
    'node-red': 'icon-touxiang2',
    'rule-scene': 'icon-touxiang'
  }

  const modelType = new Map();
  // modelType.set('device_alarm', '设备告警');
  // modelType.set('sql_rule', '数据转发');
  modelType.set('node-red', '规则实例');
  modelType.set('rule-scene', '场景联动');

  return (
    <Card
      hoverable
      bodyStyle={{
        height: 200
      }}
      actions={[
        <div onClick={() => { props.onEdit(props.data) }}>编辑</div>,
        <div onClick={() => { props.onReboot(props.data) }}>重启</div>,
        <div onClick={() => { props.onCopy(props.data) }}>复制</div>,
        <div onClick={() => {
          props.onDelete(props.data)
        }}>删除</div>,
      ]}

    >
      <Card.Meta
        avatar={<AliFont style={{ fontSize: 46 }} type={logoMap[props.data.modelType] || 'icon-touxiang5'} />}
        title={
          <div style={{ display: "flex", justifyContent: 'space-between' }}>
            <AutoHide title={`${props.data.name}`} style={{ flexGrow: 1, fontWeight: 600 }} />
            <Switch checked={props.data.state.value !== 'stopped'} onChange={(e) => {
              if (e) {
                props.onStart(props.data)
              } else {
                props.onStop(props.data)
              }
            }} />
          </div>
        }
        description={<AutoHide title={props.data.id || '123'} style={{ width: '95%' }} />}
      />
      <div className={styles.body}>
        <div className={styles.body_item}>
          <div className={styles.text} style={{ marginBottom: 6 }}>状态</div>
          <span className={styles.text_title} >
            <Badge color={props.data.state.value !== 'stopped' ? '#87d068' : '#f50'} dot />
            <span style={{ paddingLeft: 8 }}>{props.data.state.text || '已停止'}</span>

          </span>
        </div>
        <div className={styles.body_item}>
          <div className={styles.text} style={{ marginBottom: 6 }}>规则类型</div>
          <div className={styles.text_title}> {modelType.get(props.data.modelType)} </div>
        </div>
        <Tooltip placement='top' title={props.data.description} >
          <div className={styles.remark}>
            {props.data.description}
          </div>
        </Tooltip>
      </div>
    </Card>
  );
}

export default Cards;
