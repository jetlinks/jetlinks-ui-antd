import React from 'react';
import { Badge, Card, Switch, Tooltip } from 'antd';
import styles from './card.less';
import AliFont from '@/components/AliFont';
import AutoHide from "@/pages/device/location/info/autoHide";

export interface CardProps {
  onEdit: (data: any) => void
  onReboot: (data: any) => void
  onCopy: (data: any) => void
  onDelete: (data: any) => void
  data: any
}

function Cards(props: CardProps) {

  const logoMap = {
    'device_alarm': 'icon-touxiang5',
    'sql_rule': 'icon-shujuzhuanfa',
    'node-red': 'icon-touxiang2',
    'rule-scene': 'icon-touxiang'
  }

  const modelType = new Map();
  modelType.set('device_alarm', '设备告警');
  modelType.set('sql_rule', '数据转发');
  modelType.set('node-red', '规则编排');
  modelType.set('rule-scene', '场景联动');

  return (
    <Card
      hoverable
      actions={[
        <div onClick={() => { props.onEdit(props.data) }}>编辑</div>,
        <div onClick={() => { props.onReboot(props.data) }}>重启</div>,
        <div onClick={() => { props.onCopy(props.data) }}>复制</div>,
        <div onClick={() => {
          console.log('删除', props.data);
          props.onDelete(props.data)
        }}>删除</div>,
      ]}

    >
      <Card.Meta
        avatar={<AliFont style={{ fontSize: 46 }} type={logoMap[props.data.modelType] || 'icon-touxiang5'} />}
        title={
          <div style={{ display: "flex", justifyContent: 'space-between' }}>
            <AutoHide title='这是测试文字这是测试文字这是测试文字这是测试文字' style={{ flexGrow: 1, fontWeight: 600 }} />
            <Switch />
          </div>
        }
        description={<AutoHide title={props.data.id || '123'} style={{ width: '95%' }} />}
      />
      <div className={styles.body}>
        <div className={styles.body_item}>
          <div className={styles.text} style={{ marginBottom: 6 }}>状态</div>
          <span className={styles.text_title} >
            <Badge color='#f50' dot />
            已启动
          </span>
        </div>
        <div className={styles.body_item}>
          <div className={styles.text} style={{ marginBottom: 6 }}>规则类型</div>
          <div className={styles.text_title}> {modelType.get(props.data.modelType)} </div>
        </div>
        <Tooltip placement='top' title='这是描述这是描述这是描述这是描述这是描述这是描述这是描述' >
          <div className={styles.remark}>
            这是描述这是描述这是描述这是描述这是描述这是描述这是描述
          </div>
        </Tooltip>
      </div>
    </Card>
  );
}

export default Cards;
