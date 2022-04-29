import { Button, Select, Form } from 'antd';
import type { FormInstance } from 'antd';
import { useCallback, useEffect, useState } from 'react';
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
import { DeleteOutlined } from '@ant-design/icons';
import { observer } from '@formily/reactive-react';

interface ActionProps {
  restField: any;
  name: number;
  form: FormInstance;
  title?: string;
  triggerType: string;
  onRemove: () => void;
  actionItemData?: any;
}

export default observer((props: ActionProps) => {
  const { name } = props;
  const [type1, setType1] = useState('');
  // 消息通知
  const [notifyType, setNotifyType] = useState('');
  const [configId, setConfigId] = useState('');
  const [templateId, setTemplateId] = useState('');
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

  const handleNotifier = async (list: any[], data: any) => {
    if (data.notify.notifierId) {
      // 通知配置
      setConfigId(data.notify.notifierId);
      const notifierItem = list.find((item: any) => item.id === data.notify.notifierId);
      if (notifierItem) {
        await queryMessageTemplates({
          terms: [
            { column: 'type', value: data.notify.notifyType },
            { column: 'provider', value: notifierItem.provider },
          ],
        });
      }
    }
  };

  useEffect(() => {
    if (props.actionItemData && messageConfig) {
      handleNotifier(messageConfig, props.actionItemData);
    }
  }, [configId, messageConfig]);

  useEffect(() => {
    if (
      props.actionItemData &&
      props.actionItemData.notify &&
      props.actionItemData.notify.notifyType
    ) {
      queryMessageConfigs({
        terms: [{ column: 'type$IN', value: props.actionItemData.notify.notifyType }],
      }).then(async (resp) => {
        if (props.actionItemData.notify.notifierId) {
          await handleNotifier(resp, props.actionItemData);
        }
      });
    }
  }, [notifyType]);

  useEffect(() => {
    const data = props.actionItemData;
    if (data && data.notify && data.notify.templateId) {
      queryMessageTemplateDetail(data.notify.templateId).then((resp) => {
        if (resp.status === 200) {
          setTemplateData(resp.result);
        }
      });
    }
  }, [templateId]);

  const handleInit = useCallback(async (data: any) => {
    if (data) {
      if (data.executor) {
        setType1(data.executor);
      }

      if (data.notify) {
        // 消息通知
        if (data.notify.notifyType) {
          setNotifyType(data.notify.notifyType);
        }

        if (data.notify.notifierId) {
          setConfigId(data.notify.notifierId);
        }

        if (data.notify.templateId) {
          // 通知模板
          setTemplateId(data.notify.templateId);
        }
      }
    }
  }, []);

  useEffect(() => {
    handleInit(props.actionItemData);
  }, [props.actionItemData]);

  const MessageNodes = (
    <>
      <Form.Item {...props.restField} name={[name, 'notify', 'notifyType']}>
        <Select
          options={messageType}
          fieldNames={{ value: 'id', label: 'name' }}
          placeholder={'请选择通知方式'}
          style={{ width: 140 }}
          onChange={async () => {
            setTemplateData(undefined);
            props.form.resetFields([['actions', name, 'notify', 'notifierId']]);
            props.form.resetFields([['actions', name, 'notify', 'templateId']]);
          }}
        />
      </Form.Item>
      <Form.Item {...props.restField} name={[name, 'notify', 'notifierId']}>
        <Select
          options={messageConfig}
          loading={messageConfigLoading}
          fieldNames={{ value: 'id', label: 'name' }}
          onChange={() => {
            setTemplateData(undefined);
            props.form.resetFields([['actions', name, 'notify', 'templateId']]);
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
        <Button
          onClick={props.onRemove}
          danger
          style={{
            padding: '0 8px',
            margin: '0 0 12px 12px',
          }}
        >
          <DeleteOutlined />
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
          />
        </Form.Item>
        {type1 === 'notify' && MessageNodes}
        {type1 === 'device' && (
          <DeviceSelect
            value={props.actionItemData ? props.actionItemData.device : undefined}
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
});
