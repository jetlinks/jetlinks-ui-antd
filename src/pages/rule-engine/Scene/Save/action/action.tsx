import { Button, InputNumber, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useRequest } from 'umi';
import { queryMessageType, queryMessageConfig, queryMessageTemplate } from './service';
import MessageContent from './messageContent';

interface ActionProps {
  title?: string;
  onRemove: () => void;
}

export default (props: ActionProps) => {
  const [type1, setType1] = useState('message');
  const [configValue, setConfigValue] = useState<string | undefined>(undefined);
  const [templateValue, setTemplateValue] = useState<string | undefined>(undefined);
  const [templateData, setTemplateData] = useState<any>(undefined);

  const { data: messageType, run: queryMessageTypes } = useRequest(queryMessageType, {
    manual: true,
    formatResult: (res) => res.result,
  });

  const {
    data: messageConfig,
    run: queryMessageConfigs,
    loading: messageConfigLoading,
  } = useRequest(queryMessageConfig, {
    manual: true,
    formatResult: (res) => res.result,
  });

  const {
    data: messageTemplate,
    run: queryMessageTemplates,
    loading: messageTemplateLoading,
  } = useRequest(queryMessageTemplate, {
    manual: true,
    formatResult: (res) => res.result,
  });

  const MessageNodes = (
    <>
      <Select
        options={messageType}
        fieldNames={{ value: 'id', label: 'name' }}
        placeholder={'请选择通知方式'}
        style={{ width: 140 }}
        onSelect={async (key: string) => {
          setConfigValue(undefined);
          setTemplateValue(undefined);
          setTemplateData(undefined);
          await queryMessageConfigs({
            terms: [{ column: 'type$IN', value: key }],
          });
        }}
      />
      <Select
        value={configValue}
        options={messageConfig}
        loading={messageConfigLoading}
        fieldNames={{ value: 'id', label: 'name' }}
        onSelect={async (key: string) => {
          setConfigValue(key);
          setTemplateValue(undefined);
          setTemplateData(undefined);
          await queryMessageTemplates({
            terms: [{ column: 'configId', value: key }],
          });
        }}
        style={{ width: 160 }}
        placeholder={'请选择通知配置'}
      />
      <Select
        value={templateValue}
        options={messageTemplate}
        loading={messageTemplateLoading}
        fieldNames={{ value: 'id', label: 'name' }}
        style={{ width: 160 }}
        placeholder={'请选择通知模板'}
        onSelect={async (key: string, nodeData: any) => {
          setTemplateData(nodeData);
          setTemplateValue(key);
        }}
      />
    </>
  );

  const DeviceNodes = (
    <>
      <Select options={[]} placeholder={'请选择产品'} style={{ width: 220 }} />
      <Select
        defaultValue={'1'}
        options={[
          { label: '固定设备', value: '1' },
          { label: '按标签', value: '2' },
          { label: '按关系', value: '3' },
        ]}
        style={{ width: 120 }}
      />
      <Select options={[]} placeholder={'请选择'} style={{ width: 180 }} />
      <Select
        defaultValue={'1'}
        options={[
          { label: '设置属性', value: '1' },
          { label: '功能调用', value: '2' },
          { label: '读取属性', value: '3' },
        ]}
        style={{ width: 120 }}
      />
    </>
  );

  useEffect(() => {
    if (type1 === 'message') {
      queryMessageTypes();
    }
  }, [type1]);

  const TimeTypeAfter = (
    <Select
      defaultValue={'second'}
      options={[
        { label: '秒', value: 'second' },
        { label: '分', value: 'minute' },
        { label: '小时', value: 'hour' },
      ]}
    />
  );

  return (
    <div className={'actions-item'}>
      <div className={'actions-item-title'}>
        执行动作 {props.title} <Button onClick={props.onRemove}>删除</Button>
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <Select
          options={[
            { label: '消息通知', value: 'message' },
            { label: '设备输出', value: 'device' },
            { label: '延迟执行', value: 'delay' },
          ]}
          value={type1}
          onSelect={(key: string) => {
            setType1(key);
          }}
          style={{ width: 100 }}
        />
        {type1 === 'message' && MessageNodes}
        {type1 === 'device' && DeviceNodes}
        {type1 === 'delay' && (
          <InputNumber addonAfter={TimeTypeAfter} style={{ width: 150 }} min={0} max={9999} />
        )}
      </div>
      {type1 === 'message' && <MessageContent {...props} template={templateData} />}
    </div>
  );
};
