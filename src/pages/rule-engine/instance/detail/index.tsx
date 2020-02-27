import { Tabs, Drawer, Row, Col } from 'antd';
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

  const graphConfig = {
    mode: 'readOnly',
    modes: {
      readOnly: [
        'panBlank',
        'hoverGroupActived',
        'keydownCmdWheelZoom',
        'clickEdgeSelected',
        'clickNodeSelected',
        'clickCanvasSelected',
        'clickGroupSelected',
        'hoverNodeActived',
        'hoverEdgeActived',
        'hoverButton',
      ],
    },
  };
  return (
    <Drawer title="规则实例详情" onClose={() => props.close()} visible width="70VW">
      <Row style={{ padding: 5 }}>
        <Col span={4}>
          <b>基本信息</b>:{props.data?.id}
        </Col>
        <Col span={4}>
          <b>模型名称</b>:{props.data?.name}
        </Col>
        <Col span={16}>
          <b>说明</b>:{props.data.description}
        </Col>
      </Row>

      <Tabs
        defaultActiveKey={activeTab}
        onChange={key => {
          setActiveTab(key);
        }}
      >
        <Tabs.TabPane tab="模型" key="model">
          <GGEditor className={styles.editor}>
            <Flow
              graph={graphConfig}
              className={styles.flow}
              data={JSON.parse(props.data.modelMeta)}
            />
          </GGEditor>
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
