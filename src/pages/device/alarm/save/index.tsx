import React, { useEffect, useState } from 'react';
import Form from 'antd/es/form';
import { FormComponentProps } from 'antd/lib/form';
import { Button, Card, Col, Icon, Input, Modal, Row, Radio, Switch, Tooltip, message } from 'antd';
import { alarm } from '../data';
import Triggers from '@/pages/device/alarm/save/triggers/index';
import ActionAssembly from '@/pages/device/alarm/save/actions/index';
import styles from './index.less';
import SchemaForm, { createFormActions, Field } from '@formily/antd';
import { ArrayTable, Input as FInput } from '@formily/antd-components';
interface Props extends FormComponentProps {
  close: Function;
  save: Function;
  data: Partial<alarm>;
  target: string;
  targetId?: string;
  metaData?: string;
  name?: string;
  productName?: string;
  productId?: string;
}

interface State {
  properties: any[];
  data: Partial<alarm>;
  trigger: any[];
  action: any[];
  shakeLimit: any;
}

const actions = createFormActions();

const Save: React.FC<Props> = props => {
  const initState: State = {
    properties: [],
    data: props.data,
    trigger: [],
    action: [],
    shakeLimit: {},
  };

  const [data] = useState(initState.data);
  const [properties, setProperties] = useState(initState.properties);
  const [trigger, setTrigger] = useState(initState.trigger);
  const [action, setAction] = useState(initState.action);
  const [shakeLimit, setShakeLimit] = useState(initState.shakeLimit);

  const submitData = async () => {
    if (!data.name) {
      message.error('请输入告警名称！');
      return;
    }
    const result = await actions.submit();

    data.name = props.data.name;
    data.target = props.target;
    data.targetId = props.targetId;
    if (props.target === 'device') {
      data.alarmRule = {
        name: props.name,
        deviceId: props.targetId,
        deviceName: props.name,
        triggers: trigger,
        actions: action,
        // properties: properties,
        properties: result.values?.properties,
        productId: props.productId,
        productName: props.productName,
        shakeLimit: shakeLimit,
      };
    } else {
      data.alarmRule = {
        name: props.name,
        productId: props.targetId,
        productName: props.name,
        triggers: trigger,
        actions: action,
        properties: properties,
        shakeLimit: shakeLimit,
      };
    }
    props.save({ ...data });
  };

  useEffect(() => {
    if (props.data.alarmRule) {
      setShakeLimit(
        props.data.alarmRule.shakeLimit
          ? props.data.alarmRule.shakeLimit
          : {
              enabled: false,
              time: undefined,
              threshold: undefined,
              alarmFirst: true,
            },
      );
      setTrigger(
        props.data.alarmRule.triggers.length > 0
          ? [...props.data.alarmRule.triggers]
          : [{ _id: 0 }],
      );
      setAction(
        props.data.alarmRule.actions.length > 0 ? [...props.data.alarmRule.actions] : [{ _id: 0 }],
      );
      // setProperties(
      //   props.data.alarmRule?.properties.length > 0
      //     ? [...props.data.alarmRule?.properties]
      //     : [{ _id: 0 }],
      // );
    } else {
      setTrigger([{ _id: 0 }]);
      setAction([{ _id: 0 }]);
      setProperties([{ _id: 0 }]);
    }
  }, []);

  return (
    <Modal
      title={`${props.data?.id ? '编辑' : '新建'}告警`}
      visible
      okText="确定"
      cancelText="取消"
      onOk={() => {
        submitData();
      }}
      style={{ marginTop: '-3%' }}
      width="70%"
      onCancel={() => props.close()}
    >
      <div style={{ maxHeight: 750, overflowY: 'auto', overflowX: 'hidden' }}>
        <Form wrapperCol={{ span: 20 }} labelCol={{ span: 4 }} key="addAlarmForm">
          <Row gutter={16} style={{ marginLeft: '0.1%' }}>
            <Col span={12}>
              <Form.Item required key="name" label="告警名称">
                <Input
                  placeholder="输入告警名称"
                  defaultValue={props.data.name}
                  onBlur={event => {
                    props.data.name = event.target.value;
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Card style={{ marginBottom: 10 }} bordered={false} size="small">
            <p style={{ fontSize: 16 }}>
              触发条件
              <Tooltip title="触发条件满足条件中任意一个即可触发">
                <Icon type="question-circle-o" style={{ paddingLeft: 10 }} />
              </Tooltip>
              <Switch
                key="shakeLimit.enabled"
                checkedChildren="开启防抖"
                unCheckedChildren="关闭防抖"
                defaultChecked={shakeLimit.enabled ? shakeLimit.enabled : false}
                style={{ marginLeft: 20 }}
                onChange={(value: boolean) => {
                  shakeLimit.enabled = value;
                  setShakeLimit({ ...shakeLimit });
                }}
              />
              {shakeLimit.enabled && (
                <>
                  <Input
                    style={{ width: 80, marginLeft: 3 }}
                    size="small"
                    key="shakeLimit.time"
                    defaultValue={shakeLimit.time}
                    onBlur={event => {
                      shakeLimit.time = event.target.value;
                    }}
                  />
                  秒内发生
                  <Input
                    style={{ width: 80 }}
                    size="small"
                    key="shakeLimit.threshold"
                    defaultValue={shakeLimit.threshold}
                    onBlur={event => {
                      shakeLimit.threshold = event.target.value;
                    }}
                  />
                  次及以上时，处理
                  <Radio.Group
                    defaultValue={shakeLimit.alarmFirst}
                    key="shakeLimit.alarmFirst"
                    size="small"
                    buttonStyle="solid"
                    onChange={event => {
                      shakeLimit.alarmFirst = Boolean(event.target.value);
                    }}
                  >
                    <Radio.Button value={true}>第一次</Radio.Button>
                    <Radio.Button value={false}>最后一次</Radio.Button>
                  </Radio.Group>
                </>
              )}
            </p>
            {trigger.map((item: any, index) => (
              <div key={index}>
                <Triggers
                  save={(data: any) => {
                    trigger.splice(index, 1, data);
                  }}
                  trigger={item}
                  key={`trigger_${Math.round(Math.random() * 100000)}`}
                  metaData={props.metaData}
                  position={index}
                  remove={(position: number) => {
                    trigger.splice(position, 1);
                    let data = [...trigger];
                    setTrigger([...data]);
                  }}
                />
              </div>
            ))}
            <Button
              icon="plus"
              type="link"
              onClick={() => {
                setTrigger([...trigger, { _id: Math.round(Math.random() * 100000) }]);
              }}
            >
              新增触发器
            </Button>
          </Card>
          <div className={styles.convert}>
            <p style={{ fontSize: 16, marginLeft: 10 }}>
              转换
              <Tooltip title="将内置的结果字段转换为自定义字段，例如：deviceId 转为 id">
                <Icon type="question-circle-o" style={{ paddingLeft: 10 }} />
              </Tooltip>
              <SchemaForm
                components={{ ArrayTable, FInput }}
                initialValues={{
                  properties: props.data?.alarmRule?.properties,
                }}
                actions={actions}
              >
                <Field name="properties" type="array" x-component="ArrayTable">
                  <Field type="object">
                    <Field name="property" x-component="FInput" title="属性" />
                    <Field name="alias" x-component="FInput" title="别名" />
                  </Field>
                </Field>
              </SchemaForm>
            </p>
          </div>
         

          <Card bordered={false} size="small">
            <p style={{ fontSize: 16 }}>执行动作</p>
            {action.map((item: any, index) => (
              <ActionAssembly
                save={(actionData: any) => {
                  action.splice(index, 1, actionData);
                }}
                key={`action_${Math.round(Math.random() * 100000)}`}
                action={item}
                position={index}
                remove={(position: number) => {
                  action.splice(position, 1);
                  let data = [...action];
                  setAction([...data]);
                }}
              />
            ))}
            <Button
              icon="plus"
              type="link"
              onClick={() => {
                setAction([...action, { _id: Math.round(Math.random() * 100000) }]);
              }}
            >
              执行动作
            </Button>
          </Card>
        </Form>
      </div>
    </Modal>
  );
};

export default Form.create<Props>()(Save);
