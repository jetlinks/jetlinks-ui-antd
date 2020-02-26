import { Tabs, Drawer, Row, Descriptions, Col } from 'antd';
import React, { useState } from 'react';
import GGEditor, { Flow } from 'gg-editor';
import styles from '../../flow/index.less';
import Log from './log';
import Event from './event';

interface Props {
  close: Function;
  data: any;
  save: Function;
}
interface State {
  activeTab: string;
}
const Detail: React.FC<Props> = props => {
  const initState: State = {
    activeTab: 'model',
  };
  const [activeTab, setActiveTab] = useState(initState.activeTab);
  return (
    <Drawer title="规则实例详情" onClose={() => props.close()} visible width="70VW">
      <Tabs
        defaultActiveKey={activeTab}
        onChange={key => {
          setActiveTab(key);
        }}
      >
        <Tabs.TabPane tab="模型" key="model">
          <Row>
            <Col span={20}>
              <GGEditor className={styles.editor}>
                <Flow className={styles.flow} data={JSON.parse(props.data.modelMeta)} />
              </GGEditor>
            </Col>
            <Col span={4}>
              <Descriptions title="基本信息" layout="vertical" bordered>
                <Descriptions.Item span={3} label="ID">
                  {props.data?.id}
                </Descriptions.Item>
                <Descriptions.Item span={3} label="模型名称">
                  {props.data?.name}
                </Descriptions.Item>
                <Descriptions.Item span={3} label="运行方式">
                  集群
                </Descriptions.Item>
                <Descriptions.Item span={3} label="说明">
                  {props.data?.description}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </Tabs.TabPane>

        <Tabs.TabPane tab="日志" key="log">
          <Log data={props.data} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="事件" key="event">
          <Event data={props.data} />
        </Tabs.TabPane>
      </Tabs>
    </Drawer>
  );
};
export default Detail;
