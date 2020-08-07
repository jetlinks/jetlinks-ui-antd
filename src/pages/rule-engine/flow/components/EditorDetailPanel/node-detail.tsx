import React from 'react';
import { Input, Button, Select, Radio } from 'antd';
import { FormItemConfig } from '@/utils/common';

const nodeConfigMap = new Map<string, FormItemConfig[]>();
nodeConfigMap.set('timer', [
  {
    label: 'cron表达式',
    key: 'config.cron',
    styles: {
      lg: { span: 24 },
      md: { span: 24 },
      sm: { span: 24 },
    },
    component: <Input />,
  },
  {
    label: '执行参数（JSON）',
    key: 'config.params',
    styles: {
      lg: { span: 24 },
      md: { span: 24 },
      sm: { span: 24 },
    },
    formStyle: {
      wrapperCol: { span: 24 },
      labelCol: { span: 24 },
    },
    component: <Input.TextArea rows={3} />,
  },
]);

nodeConfigMap.set('spring-event', [
  {
    label: '推送事件类型',
    key: 'config.cron',
    styles: {
      lg: { span: 24 },
      md: { span: 24 },
      sm: { span: 24 },
    },
    formStyle: {
      wrapperCol: { span: 24 },
      labelCol: { span: 24 },
    },
    component: <Input.TextArea rows={3} placeholder="类全名" />,
  },
  {
    label: '监听事件类型',
    key: 'config.params',
    styles: {
      lg: { span: 24 },
      md: { span: 24 },
      sm: { span: 24 },
    },
    formStyle: {
      wrapperCol: { span: 24 },
      labelCol: { span: 24 },
    },
    component: <Input.TextArea rows={3} placeholder="类全名" />,
  },
]);

nodeConfigMap.set('device-operation', [
  {
    label: '操作',
    key: 'config.operation',
    styles: {
      lg: { span: 24 },
      md: { span: 24 },
      sm: { span: 24 },
    },
    component: (
      <Select>
        <Select.Option value="ONLINE">上线</Select.Option>
        <Select.Option value="OFFLINE">下线</Select.Option>
        <Select.Option value="ENCODE">编码</Select.Option>
        <Select.Option value="DECODE">解码</Select.Option>
        <Select.Option value="SEND_MESSAGE">发送消息</Select.Option>
        <Select.Option value="HANDLE_MESSAGE">桥接发往设备的消息</Select.Option>
        <Select.Option value="REPLY_MESSAGE">回复平台设备消息</Select.Option>
      </Select>
    ),
  },
  {
    label: '传输协议',
    key: 'config.transport',
    styles: {
      lg: { span: 24 },
      md: { span: 24 },
      sm: { span: 24 },
    },
    component: (
      <Select>
        <Select.Option value="MQTT">MQTT</Select.Option>
        <Select.Option value="other">其他</Select.Option>
      </Select>
    ),
  },
  {
    label: '设备ID',
    key: 'config.deviceId',
    styles: {
      lg: { span: 24 },
      md: { span: 24 },
      sm: { span: 24 },
    },
    formStyle: {
      wrapperCol: { span: 24 },
      labelCol: { span: 24 },
    },
    component: <Input.TextArea rows={3} placeholder="${#deviceId}" />,
  },
]);

nodeConfigMap.set('mqtt-client', [
  {
    label: 'MQTT连接',
    key: 'config.clientId',
    styles: {
      lg: { span: 24 },
      md: { span: 24 },
      sm: { span: 24 },
    },
    component: (
      <Select>
        <Select.Option value="ONLINE">开发中</Select.Option>
      </Select>
    ),
  },
  {
    label: '操作',
    key: 'config.clientType',
    styles: {
      lg: { span: 24 },
      md: { span: 24 },
      sm: { span: 24 },
    },
    component: (
      <Select>
        <Select.Option value="consumer">接收消息</Select.Option>
        <Select.Option value="producer">发送消息</Select.Option>
      </Select>
    ),
  },
  {
    label: '消息体类型',
    key: 'config.payloadType',
    styles: {
      lg: { span: 24 },
      md: { span: 24 },
      sm: { span: 24 },
    },
    component: (
      <Select>
        <Select.Option value="JSON">JSON</Select.Option>
        <Select.Option value="STRING">字符串</Select.Option>
        <Select.Option value="BINARY">BINARY</Select.Option>
        <Select.Option value="HEX">16进制字符</Select.Option>
      </Select>
    ),
  },
  {
    label: '主题（Topic）',
    key: 'config.topics',
    styles: {
      lg: { span: 24 },
      md: { span: 24 },
      sm: { span: 24 },
    },
    formStyle: {
      wrapperCol: { span: 24 },
      labelCol: { span: 24 },
    },
    component: <Input.TextArea rows={2} />,
  },
  {
    label: '主题变量',
    key: 'config.topicVariables',
    styles: {
      lg: { span: 24 },
      md: { span: 24 },
      sm: { span: 24 },
    },
    formStyle: {
      wrapperCol: { span: 24 },
      labelCol: { span: 24 },
    },
    component: (
      <Input.TextArea
        rows={3}
        placeholder="接收消息时有效: 例:/topic/{deviceId}/{key},下游通过vars变量获取占位符对应的变量."
      />
    ),
  },
]);

nodeConfigMap.set('sms-sender', [
  {
    label: '发信人',
    key: 'config.senderId',
    styles: {
      lg: { span: 24 },
      md: { span: 24 },
      sm: { span: 24 },
    },
    formStyle: {
      wrapperCol: { span: 24 },
      labelCol: { span: 24 },
    },
    component: <Input />,
  },
  {
    label: '收信人',
    key: 'config.sendTo',
    styles: {
      lg: { span: 24 },
      md: { span: 24 },
      sm: { span: 24 },
    },
    formStyle: {
      wrapperCol: { span: 24 },
      labelCol: { span: 24 },
    },
    component: <Input />,
  },
  {
    label: '短信模版',
    key: 'config.templateId',
    styles: {
      lg: { span: 24 },
      md: { span: 24 },
      sm: { span: 24 },
    },
    formStyle: {
      wrapperCol: { span: 24 },
      labelCol: { span: 24 },
    },
    component: <Input placeholder="短信模版和短信内容不能同时为空" />,
  },
  {
    label: '短信内容',
    key: 'config.text',
    styles: {
      lg: { span: 24 },
      md: { span: 24 },
      sm: { span: 24 },
    },
    formStyle: {
      wrapperCol: { span: 24 },
      labelCol: { span: 24 },
    },
    component: (
      <Input.TextArea
        rows={3}
        placeholder="变量描述：${#attr[error_stack]},${#attr[error_message]},${#attr[error_type]} "
      />
    ),
  },
]);

nodeConfigMap.set('data-mapping', [
  {
    label: '保留原字段',
    key: 'config.keepSourceData',
    styles: {
      lg: { span: 24 },
      md: { span: 24 },
      sm: { span: 24 },
    },
    formStyle: {
      wrapperCol: { span: 24 },
      labelCol: { span: 24 },
    },
    component: (
      <Radio.Group>
        <Radio value={true}>是</Radio>
        <Radio value={false}>否</Radio>
      </Radio.Group>
    ),
  },
  {
    label: '转换规则',
    key: 'config.keepSourceData',
    styles: {
      lg: { span: 24 },
      md: { span: 24 },
      sm: { span: 24 },
    },
    formStyle: {
      wrapperCol: { span: 24 },
      labelCol: { span: 24 },
    },
    component: <Button>编辑</Button>,
  },
]);

nodeConfigMap.set('device-message-consumer', [
  {
    label: '产品',
    key: 'config.deviceModelId',
    styles: {
      lg: { span: 24 },
      md: { span: 24 },
      sm: { span: 24 },
    },
    component: <Input />,
  },
]);

nodeConfigMap.set('event-restrict', [
  {
    label: '到期时间（秒）',
    key: 'config.expireTimeInterval',
    styles: {
      lg: { span: 24 },
      md: { span: 24 },
      sm: { span: 24 },
    },
    component: <Input />,
  },
  {
    label: '限流方式',
    key: 'config.restrictType',
    styles: {
      lg: { span: 24 },
      md: { span: 24 },
      sm: { span: 24 },
    },
    component: <Input />,
  },
]);

nodeConfigMap.set('http', [
  {
    label: 'HTTP地址',
    key: 'config.url',
    styles: {
      lg: { span: 24 },
      md: { span: 24 },
      sm: { span: 24 },
    },
    component: <Input />,
  },
  {
    label: '请求方式',
    key: 'config.method',
    styles: {
      lg: { span: 24 },
      md: { span: 24 },
      sm: { span: 24 },
    },
    component: <Input />,
  },
  {
    label: '请求头',
    key: 'config.headers',
    styles: {
      lg: { span: 24 },
      md: { span: 24 },
      sm: { span: 24 },
    },
    component: <Input />,
  },
  {
    label: '参数',
    key: 'config.params',
    styles: {
      lg: { span: 24 },
      md: { span: 24 },
      sm: { span: 24 },
    },
    component: <Input placeholder="填写json或者表达式${#data}" />,
  },
]);

nodeConfigMap.set('script', [
  {
    label: '脚本语言',
    key: 'config.lang',
    styles: {
      lg: { span: 24 },
      md: { span: 24 },
      sm: { span: 24 },
    },
    component: <Input />,
  },
  {
    label: '脚本',
    key: 'config.script',
    styles: {
      lg: { span: 24 },
      md: { span: 24 },
      sm: { span: 24 },
    },
    component: <Button>编辑</Button>,
  },
]);

export default nodeConfigMap;
