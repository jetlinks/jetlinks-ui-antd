import { Button, InputNumber, Select, Form } from 'antd';
import type { FormInstance } from 'antd';
import { useEffect, useState } from 'react';
import { useRequest } from 'umi';
import {
  queryMessageType,
  queryMessageConfig,
  queryMessageTemplate,
  queryMessageTemplateDetail,
} from './service';
import MessageContent from './messageContent';

interface ActionProps {
  restField: any;
  name: number;
  form: FormInstance;
  title?: string;
  onRemove: () => void;
}

const ActionItem = (props: ActionProps) => {
  const { name } = props;
  const [type1, setType1] = useState('');
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
      <Form.Item {...props.restField} name={[name, 'notify', 'type']}>
        <Select
          options={messageType}
          fieldNames={{ value: 'id', label: 'name' }}
          placeholder={'请选择通知方式'}
          style={{ width: 140 }}
          onChange={async (key: string) => {
            setTemplateData(undefined);
            props.form.resetFields([['actions', name, 'notify', 'notifierId']]);
            props.form.resetFields([['actions', name, 'notify', 'templateId']]);
            await queryMessageConfigs({
              terms: [{ column: 'type$IN', value: key }],
            });
          }}
        />
      </Form.Item>
      <Form.Item {...props.restField} name={[name, 'notify', 'notifierId']}>
        <Select
          options={messageConfig}
          loading={messageConfigLoading}
          fieldNames={{ value: 'id', label: 'name' }}
          onChange={async (key: string) => {
            setTemplateData(undefined);
            props.form.resetFields([['actions', name, 'notify', 'templateId']]);
            await queryMessageTemplates({
              terms: [{ column: 'configId', value: key }],
            });
          }}
          style={{ width: 160 }}
          placeholder={'请选择通知配置'}
        />
      </Form.Item>
      <Form.Item {...props.restField} name={[name, 'notify', 'templateId']}>
        <Select
          options={messageTemplate}
          loading={messageTemplateLoading}
          fieldNames={{ value: 'id', label: 'name' }}
          style={{ width: 160 }}
          placeholder={'请选择通知模板'}
          onChange={async (key: string) => {
            const resp = await queryMessageTemplateDetail(key);
            if (resp.status === 200) {
              setTemplateData(resp.result);
            }
          }}
        />
      </Form.Item>
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
        执行动作 {props.name + 1}
        <Button type={'link'} onClick={props.onRemove}>
          删除
        </Button>
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <Form.Item {...props.restField} name={[name, 'executor']}>
          <Select
            options={[
              { label: '消息通知', value: 'message' },
              { label: '设备输出', value: 'device' },
              { label: '延迟执行', value: 'delay' },
            ]}
            placeholder={'请选择动作方式'}
            style={{ width: 140 }}
            onSelect={(key: string) => {
              setType1(key);
            }}
          />
        </Form.Item>
        {type1 === 'message' && MessageNodes}
        {type1 === 'device' && DeviceNodes}
        {type1 === 'delay' && (
          <InputNumber addonAfter={TimeTypeAfter} style={{ width: 150 }} min={0} max={9999} />
        )}
      </div>
      {type1 === 'message' && templateData ? (
        <MessageContent form={props.form} template={templateData} name={props.name} />
      ) : null}
    </div>
  );
};

export default ActionItem;
