import React, { useState } from 'react';
import Form from 'antd/es/form';
import { FormComponentProps } from 'antd/lib/form';
import { Button, Card, Col, Icon, Input, Modal, Row, Switch, Tooltip, Select, message } from 'antd';
// import Service from '../service';
import Trigger from './alarm/trigger-scene';
import ActionAssembly from './alarm/action';
import Bind from '../../rule-engine/scene-save/bind';

interface Props extends FormComponentProps {
  close: Function;
  save: Function;
  data: any;
  deviceId: string;
}

interface State {
  instanceType: string;
  name: string;
  description: string;
  id: string;

  trigger: any[];
  action: any[];
  parallel: Boolean;
}

const Save: React.FC<Props> = props => {
  // const service = new Service('rule-engine-instance-save');
  const initState: State = {
    instanceType: '',
    description: '',
    name: '',
    id: '',

    trigger: [{ _id: 0 }],
    action: [{ _id: 0 }],
    parallel: false,
  };

  const [instanceType, setInstanceType] = useState(initState.instanceType);
  const [description, setDescription] = useState(initState.description);

  const [bindVisible, setBindVisible] = useState(false);
  const [trigger, setTrigger] = useState(initState.trigger);
  const [action, setAction] = useState(initState.action);

  const [name, setName] = useState(initState.name);
  const [parallel, setParallel] = useState(initState.parallel);
  const [id, setId] = useState(initState.id)

  const submitData = () => {
    if (instanceType === 'node-red') {
      let params = {
        instanceType: 'node-red',
        id: id,
        name: name,
        description: description
      }
      props.save({ ...params });
    }else if (instanceType === 'rule-scene') {
      if(action[0].executor){
        let tri = trigger.map(item => {
          if (item.trigger === 'scene') {
            return { scene: item.scene, trigger: 'scene' }
          } else if (item.trigger === 'manual') {
            return {
              trigger: 'manual'
            }
          } else if (item.trigger === 'timer') {
            return { cron: item.cron, trigger: 'timer' }
          } else {
            return { device: item.device, trigger: 'device' }
          }
        });
        let items = {
          id: id,
          name: name,
          triggers: tri,
          actions: action,
          parallel: parallel,
          instanceType: 'rule-scene'
        };
        props.save(items);
      }else{
        message.error('请输入执行动作')
      }
    }
  };

  const renderComponent = () => {
    switch (instanceType) {
      case 'node-red':
        return (
          <Row gutter={24} style={{ marginLeft: '0.1%' }}>
            <Col span={20}>
              <Form.Item key="description" label="说明" >
                <Input.TextArea rows={4} placeholder="请输入" onChange={(e) => {
                  setDescription(e.target.value);
                }} />
              </Form.Item>
            </Col>
          </Row>
        );
      case 'rule-scene':
        return (
          <>
            <Card style={{ marginBottom: 10 }} bordered={false} size="small">
              <p style={{ fontSize: 16 }}>触发条件
              <Tooltip title="触发条件满足条件中任意一个即可触发">
                  <Icon type="question-circle-o" style={{ paddingLeft: 10 }} />
                </Tooltip>
              </p>
              {trigger.length > 0 && trigger.map((item: any, index) => (
                <div key={index}>
                  <Trigger
                    save={(data: any) => {
                      trigger.splice(index, 1, data);
                    }}
                    deviceId={props.deviceId}
                    key={index + Math.random()}
                    trigger={item}
                    position={index}
                    remove={(position: number) => {
                      trigger.splice(position, 1);
                      let data = [...trigger];
                      setTrigger([...data]);
                    }}
                  />
                </div>
              ))}
              <Button icon="plus" type="link"
                onClick={() => {
                  setTrigger([...trigger, {
                    _id: Math.round(Math.random() * 100000), name: '', trigger: '', cron: '',
                    device: { shakeLimit: {}, filters: [], productId: '', deviceId: '', type: '', modelId: '' },
                    scene: {}
                  }]);
                }}
              >
                新增触发器
            </Button>
            </Card>
            <Card bordered={false} size="small">
              <p style={{ fontSize: 16 }}>
                <span>执行动作</span>
                <Switch key='parallel'
                  checkedChildren="并行执行" unCheckedChildren="串行执行"
                  defaultChecked={parallel || false}
                  style={{ marginLeft: 20, width: '100px' }}
                  onChange={(value: boolean) => {
                    setParallel(value)
                  }}
                />
              </p>
              {action.length > 0 && action.map((item: any, index) => (
                <div key={index}>
                  <ActionAssembly deviceId={props.deviceId} key={index + Math.random()} save={(actionData: any) => {
                    action.splice(index, 1, actionData);
                  }} action={item} position={index} remove={(position: number) => {
                    action.splice(position, 1);
                    setAction([...action]);
                  }} />
                </div>
              ))}
              <Button icon="plus" type="link"
                onClick={() => {
                  setAction([...action, { _id: Math.round(Math.random() * 100000) }]);
                }}
              >
                执行动作
            </Button>
            </Card>
          </>
        );
      default: null;
    }
  }

  return (
    <Modal
      title={`新建规则实例`}
      visible
      okText="确定"
      cancelText="取消"
      onOk={() => {
        submitData();
      }}
      style={{ marginTop: '-3%' }}
      width="65%"
      onCancel={() => props.close()}
    >
      <div style={{ maxHeight: 750, overflowY: 'auto', overflowX: 'hidden' }}>
        <Form wrapperCol={{ span: 22 }} labelCol={{ span: 2 }} key='addAlarmForm'>
          <Row gutter={24}
            style={{ marginLeft: '0.1%' }}>
              <Col span={20}>
              <Form.Item key="id" label="ID">
                <Input placeholder="id"
                  onBlur={event => {
                    setId(event.target.value);
                  }} />
              </Form.Item>
            </Col>
            <Col span={20}>
              <Form.Item key="name" label="名称">
                <Input placeholder="输入名称"
                  onBlur={event => {
                    setName(event.target.value);
                  }} />
              </Form.Item>
            </Col>
            <Col span={20}>
              <Form.Item key="instanceType" label="类型" >
                <Select placeholder="请选择" onChange={(value: string) => {
                  setInstanceType(value);
                }}>
                  <Select.Option key="node-red" value="node-red">规则实例</Select.Option>
                  <Select.Option key="rule-scene" value="rule-scene">场景联动</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          {renderComponent()}
        </Form>
      </div>
      {bindVisible && (
        <Bind selectionType='radio'
              close={() => {
                setBindVisible(false);
              }}
              deviceId={props.deviceId}
              save={(item: any) => {
                if (item[0]) {
                  setBindVisible(false);
                } else {
                  message.error('请勾选设备');
                  return;
                }
              }}
        />
      )}
    </Modal>
  );
};

export default Form.create<Props>()(Save);
