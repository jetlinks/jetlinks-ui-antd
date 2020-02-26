import { Col, Row, Drawer } from 'antd';
import GGEditor, { Flow } from 'gg-editor';

import React from 'react';
import { FlowContextMenu } from './components/EditorContextMenu';
import { FlowDetailPanel } from './components/EditorDetailPanel';
import { RuleItemPanel } from './components/EditorItemPanel';
import { FlowToolbar } from './components/EditorToolbar';
import styles from './index.less';
import EditorConsole from './components/EditorConsole';
import SaveFlow from './SaveFlow';

interface Props {
  close: Function;
  data?: any;
  save: Function;
}

// interface State {
// modelData: any;
// }
const RuleFlow: React.FC<Props> = props => {
  // const initState: State = {
  //     modelData: props.data
  // }
  // const [modelData] = useState(initState.modelData);

  const saveModel = (item: any) => {
    const flowData = window.editor.getData();
    props.save({
      ...item,
      modelMeta: JSON.stringify({ ...item, ...flowData }),
      modelType: 'antv.g6',
    });
  };
  const renderTitle = () => {
    const action = props.data.option;
    switch (action) {
      case 'update':
        return '编辑规则模型';
      case 'copy':
        return '复制规则模型';
      default:
        return '新增规则模型';
    }
  };
  return (
    <Drawer
      title={renderTitle()}
      width="80vw"
      placement="right"
      visible
      onClose={() => props.close()}
    >
      <GGEditor className={styles.editor}>
        <Row type="flex" className={styles.editorHd}>
          <Col span={24}>
            <FlowToolbar />
          </Col>
        </Row>
        <Row type="flex" className={styles.editorBd}>
          <Col span={4} className={styles.editorSidebar}>
            <RuleItemPanel />
          </Col>
          <Col span={16} className={styles.editorContent}>
            <Flow
              // onClick={() => { message.success('点击1') }}
              className={styles.flow}
              data={props.data}
              // data={{ "nodes": [{ "type": "node", "size": "120*48", "shape": "flow-rect", "color": "#1890FF", "label": "短信通知", "executor": "sms-sender", "x": 90.625, "y": 167.5, "id": "9c4991a5", "nodeId": "9c4991a5", "config": { "senderId": "test", "sendTo": "18502314099", "templateId": "1193111382586462208", "text": "", "senderName": "测试", "templateName": "测试" }, "index": 6, "executorName": "短信通知" }, { "type": "node", "size": "150*48", "shape": "flow-rect", "color": "#1890FF", "label": "接收平台发往设备到消息", "executor": "device-operation", "x": 117.25, "y": 376, "id": "beab3173", "executorName": "操作设备", "nodeId": "beab3173", "config": { "operation": "HANDLE_MESSAGE", "transport": "MQTT", "deviceId": "" }, "index": 7 }, { "type": "node", "size": "120*48", "shape": "flow-rect", "color": "#1890FF", "label": "编码消息", "executor": "device-operation", "x": 326.625, "y": 376, "id": "b689f759", "executorName": "操作设备", "nodeId": "b689f759", "config": { "operation": "ENCODE", "transport": "MQTT", "deviceId": "${#deviceId}" }, "index": 10 }, { "type": "node", "size": "120*48", "shape": "flow-rect", "color": "#1890FF", "label": "发送MQTT消息", "executor": "mqtt-client", "x": 517.75, "y": 375.5, "id": "82405a9a", "executorName": "MQTT客户端", "nodeId": "82405a9a", "config": { "clientId": "1193833468349403136", "clientName": "测试MQTT客户端", "clientType": "producer", "payloadType": "JSON", "topics": "/test", "topicVariables": "" }, "index": 11 }, { "type": "node", "size": "120*48", "shape": "flow-rect", "color": "#1890FF", "label": "订阅MQTT", "executor": "mqtt-client", "x": 265.625, "y": 41.5, "id": "58fc116d", "nodeId": "58fc116d", "config": { "clientId": "1193833468349403136", "clientName": "测试MQTT客户端", "clientType": "consumer", "payloadType": "JSON", "topics": "/chiefdata/push/#", "topicVariables": "/chiefdata/push/fire_alarm/department/{department}/area/{areaId}/dev/{deviceId}" }, "index": 13, "executorName": "订阅MQTT" }, { "type": "node", "size": "120*48", "shape": "flow-rect", "color": "#1890FF", "label": "解码消息", "executor": "device-operation", "x": 524.125, "y": 42.5, "id": "2f35bf4a", "nodeId": "2f35bf4a", "config": { "operation": "DECODE", "transport": "MQTT", "deviceId": "${#payload[devid]}" }, "index": 14, "executorName": "解码消息" }, { "type": "node", "size": "120*48", "shape": "flow-rect", "color": "#1890FF", "label": "处理默认消息", "executor": "spring-event", "x": 706.125, "y": 42.5, "id": "3a4088d8", "nodeId": "3a4088d8", "config": { "publishClass": "org.jetlinks.core.message.Message", "subscribeClass": "" }, "index": 15, "executorName": "处理默认消息" }, { "type": "node", "size": "120*48", "shape": "flow-rect", "color": "#1890FF", "label": "测试发送消息", "executor": "mqtt-client", "x": 855.125, "y": 177.5, "id": "c9a2d7fd", "executorName": "MQTT客户端", "nodeId": "c9a2d7fd", "config": { "clientId": "test", "clientName": "测试", "clientType": "producer", "payloadType": "JSON", "topics": "/chiefdata/push/fire_alarm/department/1/area/2/dev/3", "topicVariables": "" }, "index": 18 }, { "type": "node", "size": "120*48", "shape": "flow-rect", "color": "#1890FF", "label": "设置设备在线", "executor": "device-operation", "x": 178.25, "y": 281.5, "id": "96670420", "executorName": "操作设备", "nodeId": "96670420", "config": { "operation": "ONLINE", "transport": "MQTT", "deviceId": "${#payload[dno]}" }, "index": 19 }, { "type": "node", "size": "120*48", "shape": "flow-rect", "color": "#1890FF", "label": "判断设备状态", "executor": "route", "x": 265.125, "y": 168, "id": "e21c7c7c", "executorName": "路由", "nodeId": "e21c7c7c", "config": {}, "index": 20 }, { "type": "node", "size": "120*48", "shape": "flow-rect", "color": "#1890FF", "label": "回复平台", "executor": "device-operation", "x": 472.625, "y": 168.5, "id": "5fbc182d", "executorName": "操作设备", "nodeId": "5fbc182d", "config": { "operation": "REPLY_MESSAGE", "transport": "MQTT", "deviceId": "${#deviceId}" }, "index": 21 }, { "type": "node", "size": "120*48", "shape": "flow-rect", "color": "#1890FF", "label": "设置设备离线", "executor": "device-operation", "x": 368.625, "y": 282, "id": "5dd3eac9", "executorName": "操作设备", "nodeId": "5dd3eac9", "config": { "operation": "OFFLINE", "transport": "MQTT", "deviceId": "${#payload[dno]}" }, "index": 22 }, { "type": "node", "size": "120*48", "shape": "flow-rect", "color": "#1890FF", "label": "模拟回复数据", "executor": "script", "x": 551.625, "y": 281, "id": "1a8f85ed", "executorName": "动态脚本", "nodeId": "1a8f85ed", "config": { "script": "handler.onMessage({ruleData ->\n    \n    \n     return [\n        \"messageType\":\"READ_PROPERTY_REPLY\",\n        \"deviceId\":ruleData.data.payload.deviceId,\n        \"messageId\":ruleData.data.payload.messageId,\n        \"success\":true,\n        \"properties\":[name:\"test\"]\n    ]\n});", "lang": "groovy" }, "index": 23 }, { "type": "node", "size": "140*48", "shape": "flow-rect", "color": "#1890FF", "label": "订阅平台发往设备的消息", "executor": "mqtt-client", "x": 784.125, "y": 281, "id": "41531d76", "executorName": "MQTT客户端", "nodeId": "41531d76", "config": { "clientId": "1193833468349403136", "clientName": "测试MQTT客户端", "clientType": "consumer", "payloadType": "JSON", "topics": "/test", "topicVariables": "" }, "index": 24 }], "edges": [{ "source": "58fc116d", "sourceAnchor": 1, "target": "2f35bf4a", "id": "97d2b81b", "targetAnchor": 3, "_type": "link", "label": "全部设备事件", "type": "", "description": "", "event": "", "script": "return !data.topic.startsWith(\"/chiefdata/push/device_online_status\");", "index": 0, "condition": { "type": "script", "configuration": { "lang": "js", "script": "return !data.topic.startsWith(\"/chiefdata/push/device_online_status\");" } } }, { "source": "2f35bf4a", "sourceAnchor": 1, "target": "3a4088d8", "targetAnchor": 3, "id": "ffb3f335", "index": 1, "_type": "link", "label": "", "type": "", "description": "", "event": "", "script": "" }, { "source": "58fc116d", "sourceAnchor": 2, "target": "9c4991a5", "id": "a811edd8", "_type": "link", "label": "火警消息", "type": "", "description": "", "event": "", "script": "return data.topic.startsWith(\"/chiefdata/push/fire_alarm\");", "condition": { "type": "script", "configuration": { "lang": "js", "script": "return data.topic.startsWith(\"/chiefdata/push/fire_alarm\");" } }, "targetAnchor": 0, "index": 2, "color": "red" }, { "source": "58fc116d", "sourceAnchor": 2, "target": "e21c7c7c", "id": "7e388436", "_type": "link", "label": "设备状态变更消息", "type": "", "description": "", "event": "", "script": "return data.topic.startsWith(\"/chiefdata/push/device_online_status\");", "condition": { "type": "script", "configuration": { "lang": "js", "script": "return data.topic.startsWith(\"/chiefdata/push/device_online_status\");" } }, "targetAnchor": 0, "index": 3 }, { "source": "e21c7c7c", "sourceAnchor": 2, "target": "96670420", "targetAnchor": 0, "id": "a4a05fe5", "_type": "link", "label": "设备上线", "type": "", "description": "", "event": "", "script": "return data.payload.status==1;", "condition": { "type": "script", "configuration": { "lang": "js", "script": "return data.payload.status==1;" } }, "index": 4 }, { "source": "e21c7c7c", "sourceAnchor": 2, "target": "5dd3eac9", "targetAnchor": 0, "id": "28db78d7", "_type": "link", "label": "设备离线", "type": "", "description": "", "event": "", "script": "return data.payload.status!=1;", "condition": { "type": "script", "configuration": { "lang": "js", "script": "return data.payload.status!=1;" } }, "index": 5 }, { "source": "beab3173", "sourceAnchor": 1, "target": "b689f759", "id": "873b9dec", "targetAnchor": 3, "index": 8 }, { "source": "b689f759", "sourceAnchor": 1, "target": "82405a9a", "targetAnchor": 3, "id": "859cf98d", "index": 9 }, { "source": "58fc116d", "sourceAnchor": 2, "target": "5fbc182d", "id": "ffecc6ba", "_type": "link", "label": "回复消息", "type": "", "description": "", "event": "", "script": "return data.topic.startsWith(\"/chiefdata/push/reply\");", "condition": { "type": "script", "configuration": { "lang": "js", "script": "return data.topic.startsWith(\"/chiefdata/push/reply\");" } }, "index": 12, "targetAnchor": 0 }, { "source": "41531d76", "sourceAnchor": 3, "target": "1a8f85ed", "id": "cf161a39", "targetAnchor": 1, "index": 16 }, { "source": "1a8f85ed", "sourceAnchor": 3, "target": "5fbc182d", "targetAnchor": 2, "id": "9c6f952e", "index": 17 }, { "source": "1a8f85ed", "sourceAnchor": 0, "target": "3a4088d8", "targetAnchor": 2, "id": "961c9613", "index": 25 }], "id": "test", "name": "新建模型", "description": "", "runMode": "CLUSTER" }}
              // data={{ "nodes": [{ "type": "node", "size": "72*72", "shape": "flow-circle", "color": "#FA8C16", "label": "启动任务", "executor": "timer", "x": 423.84375, "y": 167, "id": "67a26f33", "remark": "测试Timer", "config": { "cron": "0 1-2 * * * ? ", "defaultData": "dsfsfs" }, "index": 0 }, { "type": "node", "size": "80*48", "shape": "flow-capsule", "color": "#B37FEB", "label": "Querys", "executor": "sql", "x": 419.84375, "y": 296, "id": "c289e872", "remark": "测试查询sdf", "config": { "dataSourcedId": "mysql", "stream": true, "transaction": true, "script": "select * from table;" }, "index": 1 }, { "type": "node", "size": "120*48", "shape": "flow-rect", "color": "#1890FF", "label": "数据转换", "executor": "dataMapping", "x": 576.84375, "y": 353, "id": "cdd8828a", "index": 3, "remark": "sdfs", "config": { "mappings": [{ "key": "0", "source": "12312", "target": "31231", "type": "132" }], "keepSourceData": true } }], "edges": [{ "source": "67a26f33", "sourceAnchor": 2, "target": "c289e872", "targetAnchor": 0, "id": "9e1baa72", "index": 2 }, { "source": "c289e872", "sourceAnchor": 1, "target": "cdd8828a", "targetAnchor": 0, "id": "501d68ca", "index": 4 }] }}
            />
          </Col>
          <Col span={4} className={styles.editorSidebar}>
            <FlowDetailPanel
              data={props.data}
              save={(item: any) => {
                saveModel(item);
              }}
            />
            {/* <EditorMinimap /> */}

            <SaveFlow
            // 不能注释掉。页面不显示，。只用于加载Flow方法，此处只使用了保存方法。
            />
          </Col>
        </Row>
        <Col span={24}>
          <EditorConsole />
        </Col>
        <FlowContextMenu />
      </GGEditor>
    </Drawer>
  );
};
export default RuleFlow;
