import type { FormInstance } from 'antd';
import { Button, Checkbox, Col, Form, Row, Select } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useRequest } from 'umi';
import {
  queryMessageConfig,
  queryMessageTemplate,
  queryMessageTemplateDetail,
  queryMessageType,
} from './service';
import MessageContent from './messageContent';
import DeviceSelect, { MessageTypeEnum } from './device';
import WriteProperty from './device/WriteProperty';
import ReadProperty from './device/readProperty';
import FunctionCall from './device/functionCall';
import { InputNumber } from '../components';
import { DeleteOutlined } from '@ant-design/icons';
import { observer } from '@formily/reactive-react';
import ConditionalFiltering from './device/ConditionalFiltering';

interface ActionProps {
  restField: any;
  name: number;
  form: FormInstance;
  title?: string;
  triggerType: string;
  onRemove: () => void;
  actionItemData?: any;
  trigger?: any;
  parallel?: boolean;
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

  const [isFiltering, setIsFiltering] = useState(false);

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
      console.log('actions ', data);
      if (data.executor) {
        setType1(data.executor);
      }
      console.log(data.terms);
      if (data.terms) {
        // 显示过滤条件
        setIsFiltering(true);
      }

      if (data.notify) {
        // 消息通知
        setNotifyType(data.notify?.notifyType);
        setConfigId(data.notify?.notifierId);
        setTemplateId(data.notify?.templateId);
      }
    }
  }, []);

  useEffect(() => {
    handleInit(props.actionItemData);
  }, [props.actionItemData]);

  const MessageNodes = (
    <>
      <Col span={7}>
        <Form.Item
          {...props.restField}
          name={[name, 'notify', 'notifyType']}
          rules={[{ required: true, message: '请选择通知方式' }]}
        >
          <Select
            options={messageType}
            fieldNames={{ value: 'id', label: 'name' }}
            placeholder={'请选择通知方式'}
            style={{ width: '100%' }}
            onChange={async () => {
              setTemplateData(undefined);
              props.form.setFields([
                { name: ['actions', name, 'notify', 'notifierId'], value: undefined },
                { name: ['actions', name, 'notify', 'templateId'], value: undefined },
              ]);
            }}
          />
        </Form.Item>
      </Col>
      <Col span={7}>
        <Form.Item
          {...props.restField}
          name={[name, 'notify', 'notifierId']}
          rules={[{ required: true, message: '请选择通知配置' }]}
        >
          <Select
            options={messageConfig}
            loading={messageConfigLoading}
            fieldNames={{ value: 'id', label: 'name' }}
            onChange={() => {
              setTemplateData(undefined);
              props.form.setFields([
                { name: ['actions', name, 'notify', 'templateId'], value: undefined },
              ]);
            }}
            style={{ width: '100%' }}
            placeholder={'请选择通知配置'}
          />
        </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item
          {...props.restField}
          name={[name, 'notify', 'templateId']}
          rules={[{ required: true, message: '请选择通知模板' }]}
        >
          <Select
            options={messageTemplate}
            loading={messageTemplateLoading}
            fieldNames={{ value: 'id', label: 'name' }}
            style={{ width: '100%' }}
            placeholder={'请选择通知模板'}
          />
        </Form.Item>
      </Col>
    </>
  );

  const parallelNode = (
    <Col span={3}>
      {props.parallel === false ? (
        <Checkbox
          checked={isFiltering}
          onChange={(e) => {
            setIsFiltering(e.target.checked);
          }}
        >
          条件过滤
        </Checkbox>
      ) : null}
    </Col>
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
      <Row gutter={24}>
        <Col span={4}>
          <Form.Item
            {...props.restField}
            name={[name, 'executor']}
            rules={[{ required: true, message: '请选择执行条件' }]}
          >
            <Select
              options={[
                { label: '消息通知', value: 'notify' },
                { label: '设备输出', value: 'device' },
                { label: '延迟执行', value: 'delay' },
              ]}
              placeholder={'请选择执行条件'}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
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
            parallel={props.parallel}
          />
        )}
        {type1 === 'delay' && (
          <Col span={6}>
            <Form.Item name={[name, 'delay']}>
              <InputNumber />
            </Form.Item>
          </Col>
        )}
      </Row>

      {type1 === 'notify' && templateData ? (
        <MessageContent
          form={props.form}
          template={templateData}
          name={props.name}
          trigger={props.trigger}
          notifyType={notifyType}
          triggerType={props.triggerType}
          configId={configId}
          parallel={props.parallel}
        />
      ) : null}
      {type1 === 'device' &&
      deviceMessageType === MessageTypeEnum.WRITE_PROPERTY &&
      properties.length ? (
        <>
          <Row gutter={24}>
            <Col span={18}>
              <Form.Item
                name={[name, 'device', 'message', 'properties']}
                rules={[
                  {
                    validator: async (_: any, value: any) => {
                      if (value) {
                        if (!Object.values(value)[0]) {
                          return Promise.reject(new Error('请输入属性值'));
                        }
                      } else {
                        return Promise.reject(new Error('请选择属性'));
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <WriteProperty
                  name={name}
                  properties={properties}
                  type={props.triggerType}
                  form={props.form}
                  parallel={props.parallel}
                />
              </Form.Item>
            </Col>
            {parallelNode}
          </Row>
          {props.parallel === false && isFiltering && (
            <Row gutter={24}>
              <ConditionalFiltering
                name={name}
                form={props.form}
                data={props.actionItemData.terms}
              />
            </Row>
          )}
        </>
      ) : null}
      {type1 === 'device' &&
      deviceMessageType === MessageTypeEnum.READ_PROPERTY &&
      properties.length ? (
        <>
          <Row gutter={24}>
            <Col span={4}>
              <Form.Item
                name={[name, 'device', 'message', 'properties']}
                rules={[{ required: true, message: '请选择属性' }]}
              >
                <ReadProperty properties={properties} />
              </Form.Item>
            </Col>
            {parallelNode}
          </Row>
          {props.parallel === false && isFiltering && (
            <Row gutter={24}>
              <ConditionalFiltering
                name={name}
                form={props.form}
                data={props.actionItemData.terms}
              />
            </Row>
          )}
        </>
      ) : null}
      {type1 === 'device' &&
      deviceMessageType === MessageTypeEnum.INVOKE_FUNCTION &&
      functionList.length ? (
        <>
          <Form.Item
            name={[name, 'device', 'message', 'inputs']}
            rules={[{ required: true, message: '请输入功能值' }]}
          >
            <FunctionCall functionData={functionList} />
          </Form.Item>
          <Row gutter={24}>
            {parallelNode}
            {props.parallel === false && isFiltering && (
              <ConditionalFiltering
                name={name}
                form={props.form}
                data={props.actionItemData.terms}
              />
            )}
          </Row>
        </>
      ) : null}
    </div>
  );
});
