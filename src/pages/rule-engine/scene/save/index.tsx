import React, { useEffect, useState } from 'react';
import Form from 'antd/es/form';
import { FormComponentProps } from 'antd/lib/form';
import { Button, Card, Col, Icon, Input, Modal, Row, Tooltip } from 'antd';
import { SceneItem } from '../data';
import Triggers from './Triggers';
import ActionAssembly from './action';
import apis from '@/services';

interface Props extends FormComponentProps {
  close: Function;
  save: Function;
  data: Partial<SceneItem>;
}

interface State {
  properties: any[];
  data: Partial<SceneItem>;
  triggers: any[];
  action: any[];
}

const Save: React.FC<Props> = props => {

  const initState: State = {
    properties: [],
    data: props.data,
    triggers: props.data.triggers && props.data.triggers.length > 0 ? props.data.triggers :
      [
        {
          _id: Math.round(Math.random() * 100000),
          trigger: '', cron: '',
          device: { shakeLimit: { enabled: false }, filters: [{ _id: Math.round(Math.random() * 100000), key: '', value: '', operator: '' }], productId: '', deviceId: '', type: '', modelId: '' },
          scene: { sceneIds: [] }
        }
      ],
    action: props.data.actions && props.data.actions.length > 0 ? props.data.actions : [
      { executor: '' }
    ]
  };

  const [data, setData] = useState(initState.data);
  const [triggers, setTriggers] = useState(initState.triggers);
  const [action, setAction] = useState(initState.action);

  const submitData = () => {
    let tri = triggers.map(item => {
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
    })
    let items = {
      name: data.name,
      id: data.id,
      triggers: tri,
      actions: action
    }
    props.save({ ...items });
  };

  useEffect(() => {
    if (props.data.id) {
      apis.scene.info(props.data.id).then(res => {
        setData(res.result)
      })
    }
  }, []);

  return (
    <Modal
      title={data.id ? '编辑场景联动' : '新增场景联动'}
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
        <Form wrapperCol={{ span: 20 }} labelCol={{ span: 4 }} key='addAlarmForm'>
          <Row gutter={16}
            style={{ marginLeft: '0.1%' }}>
            <Col span={12}>
              <Form.Item key="name" label="场景联动ID">
                <Input placeholder="输入场景联动ID"
                  defaultValue={data.id}
                  onBlur={event => {
                    data.id = event.target.value;
                  }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item key="name" label="场景联动名称">
                <Input placeholder="输入场景联动名称"
                  defaultValue={data.name}
                  onBlur={event => {
                    data.name = event.target.value;
                  }} />
              </Form.Item>
            </Col>
          </Row>
          <Card style={{ marginBottom: 10 }} bordered={false} size="small">
            <p style={{ fontSize: 16 }}>触发条件
              <Tooltip title="触发条件满足条件中任意一个即可触发">
                <Icon type="question-circle-o" style={{ paddingLeft: 10 }} />
              </Tooltip>
            </p>
            {triggers.length > 0 && triggers.map((item: any, index) => (
              <div key={index}>
                <Triggers
                  save={(data: any) => {
                    triggers.splice(index, 1, data);
                  }}
                  trigger={item}
                  position={index}
                  remove={(position: number) => {
                    triggers.splice(position, 1);
                    setTriggers([...triggers]);
                  }}
                />
              </div>
            ))}
            <Button icon="plus" type="link"
              onClick={() => {
                setTriggers([...triggers, {
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
            <p style={{ fontSize: 16 }}>执行动作</p>
            {action.length > 0 && action.map((item: any, index) => (
              <div key={index}>
                <ActionAssembly save={(actionData: any) => {
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
        </Form>
      </div>
    </Modal>
  );
};

export default Form.create<Props>()(Save);
