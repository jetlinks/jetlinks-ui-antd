import { Button, Select, Form } from 'antd';
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
import DeviceSelect, { MessageTypeEnum } from './device';
import WriteProperty from './device/WriteProperty';
import ReadProperty from './device/readProperty';
import FunctionCall from './device/functionCall';
import { InputNumber } from '../components';

interface ActionProps {
  restField: any;
  name: number;
  form: FormInstance;
  title?: string;
  triggerType: string;
  onRemove: () => void;
}

const ActionItem = (props: ActionProps) => {
  const { name } = props;
  const [type1, setType1] = useState('');
  // 消息通知
  const [notifyType, setNotifyType] = useState('');
  const [configId, setConfigId] = useState('');
  const [templateData, setTemplateData] = useState<any>(undefined);
  // 设备输出
  const [deviceMessageType, setDeviceMessageType] = useState('WRITE_PROPERTY');
  const [properties, setProperties] = useState([]); // 物模型-属性
  const [functionList, setFunctionList] = useState([]); // 物模型-功能

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
            setNotifyType(key);
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
          onChange={async (key: string, node: any) => {
            setConfigId(key);
            setTemplateData(undefined);
            props.form.resetFields([['actions', name, 'notify', 'templateId']]);

            await queryMessageTemplates({
              terms: [
                { column: 'type', value: notifyType },
                { column: 'provider', value: node.provider },
              ],
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

  useEffect(() => {
    if (type1 === 'notify') {
      queryMessageTypes();
    }
  }, [type1]);

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
              { label: '消息通知', value: 'notify' },
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
        {type1 === 'notify' && MessageNodes}
        {type1 === 'device' && (
          <DeviceSelect
            name={props.name}
            form={props.form}
            triggerType={props.triggerType}
            onProperties={setProperties}
            onMessageTypeChange={setDeviceMessageType}
            onFunctionChange={setFunctionList}
            restField={props.restField}
          />
        )}
        {type1 === 'delay' && (
          <Form.Item name={[name, 'delay']}>
            <InputNumber />
          </Form.Item>
        )}
      </div>
      {type1 === 'notify' && templateData ? (
        <MessageContent
          form={props.form}
          template={templateData}
          name={props.name}
          notifyType={notifyType}
          triggerType={props.triggerType}
          configId={configId}
        />
      ) : null}
      {type1 === 'device' &&
      deviceMessageType === MessageTypeEnum.WRITE_PROPERTY &&
      properties.length ? (
        <Form.Item name={[name, 'device', 'message', 'properties']}>
          <WriteProperty properties={properties} type={props.triggerType} form={props.form} />
        </Form.Item>
      ) : null}
      {type1 === 'device' &&
      deviceMessageType === MessageTypeEnum.READ_PROPERTY &&
      properties.length ? (
        <Form.Item name={[name, 'device', 'message', 'properties']}>
          <ReadProperty properties={properties} />
        </Form.Item>
      ) : null}
      {type1 === 'device' &&
      deviceMessageType === MessageTypeEnum.INVOKE_FUNCTION &&
      functionList.length ? (
        <Form.Item name={[name, 'device', 'message', 'inputs']}>
          <FunctionCall functionData={functionList} />
        </Form.Item>
      ) : null}
    </div>
  );
};

export default ActionItem;
