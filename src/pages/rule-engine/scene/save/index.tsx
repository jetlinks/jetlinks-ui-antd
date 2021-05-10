import React, {useEffect, useState} from 'react';
import Form from 'antd/es/form';
import {FormComponentProps} from 'antd/lib/form';
import {Button, Card, Col, Icon, Input, message, Modal, Row, Switch, Tooltip} from 'antd';
import {SceneItem} from '../data';
import Triggers from './Triggers';
import ActionAssembly from './action';
import apis from '@/services';

interface Props extends FormComponentProps {
  close: Function;
  save: Function;
  data: Partial<SceneItem>;
}

interface State {
  data: Partial<SceneItem>;
  triggers: any[];
  action: any[];
  parallel: Boolean;
}

const Save: React.FC<Props> = props => {

  const initState: State = {
    data: {},
    parallel: false,
    triggers: [],
    action: []
  };

  const [data, setData] = useState(initState.data);
  const [triggers, setTriggers] = useState(initState.triggers);
  const [action, setAction] = useState(initState.action);
  const [parallel, setParallel] = useState(initState.parallel);

  const submitData = () => {
    let tri = triggers.filter(item=>item.trigger!="").map(item => {
      if (item.trigger === 'scene') {
        return {scene: item.scene, trigger: 'scene'}
      } else if (item.trigger === 'manual') {
        return {
          trigger: 'manual'
        }
      } else if (item.trigger === 'timer') {
        return {cron: item.cron, trigger: 'timer'}
      } else {
        return {device: item.device, trigger: 'device'}
      }
    });
    let items = {
      name: data.name,
      id: data.id,
      triggers: tri,
      actions: action,
      parallel: parallel
    };

    if(data.name!=''&&data.id!=''&&triggers?.length>0){
      apis.scene.save({...items}).then(res => {
        if (res.status === 200) {
          props.save();
        }
      });
    }else{
      message.error('请完善所有参数');
    }
  };

  useEffect(() => {
    if (props.data.id) {
      apis.scene.info(props.data.id).then(res => {
        let result = res.result;
        setData(result);
        setParallel(result.parallel || false);
        if (result.triggers && result.triggers.length > 0) {
          setTriggers(result.triggers)
        } else {
          setTriggers(
            [
              {
                _id: Math.round(Math.random() * 100000),
                trigger: '', cron: '',
                device: {
                  shakeLimit: {enabled: false},
                  filters: [{_id: Math.round(Math.random() * 100000), key: '', value: '', operator: ''}],
                  productId: '',
                  deviceId: '',
                  type: '',
                  modelId: ''
                },
                scene: {sceneIds: []}
              }
            ],
          )
        }
        if (result.actions && result.actions.length > 0) {
          setAction(result.actions)
        } else {
          setAction(
            [
              {executor: ''}
            ]
          )
        }
      })
    } else {
      setData({id: '', name: ''});
      setParallel(false);
      setTriggers(
        [
          {
            _id: Math.round(Math.random() * 100000),
            trigger: '', cron: '',
            device: {
              shakeLimit: {enabled: false},
              filters: [{_id: Math.round(Math.random() * 100000)}],
              productId: '',
              deviceId: '',
              type: '',
              modelId: ''
            },
            scene: {sceneIds: []}
          }
        ],
      );
      setAction(
        [
          {executor: ''}
        ]
      )
    }
  }, []);

  return (
    <Modal
      title={props.data.id ? '编辑场景联动' : '新增场景联动'}
      visible
      okText="确定"
      cancelText="取消"
      onOk={() => {
        submitData();
      }}
      style={{marginTop: '-3%'}}
      width="70%"
      onCancel={() => props.close()}
    >
      <div style={{maxHeight: 750, overflowY: 'auto', overflowX: 'hidden'}}>
        <Form wrapperCol={{span: 20}} labelCol={{span: 4}} key='addAlarmForm'>
          <Row gutter={16}
               style={{marginLeft: '0.1%'}}>
            <Col span={12}>
              <Form.Item key="id" label="场景联动ID">
                <Input placeholder="输入场景联动ID"
                       defaultValue={props.data.id}
                       readOnly={!!props.data.id}
                       onBlur={event => {
                         setData({...data, id: event.target.value})
                       }}/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item key="name" label="场景联动名称">
                <Input placeholder="输入场景联动名称"
                       defaultValue={props.data.name}
                       onBlur={event => {
                         setData({...data, name: event.target.value})
                       }}/>
              </Form.Item>
            </Col>
          </Row>
          <Card style={{marginBottom: 10}} bordered={false} size="small">
            <p style={{fontSize: 16}}>触发条件
              <Tooltip title="触发条件满足条件中任意一个即可触发">
                <Icon type="question-circle-o" style={{paddingLeft: 10}}/>
              </Tooltip>
            </p>
            {triggers.length > 0 && triggers.map((item: any, index) => (
              <div key={index}>
                <Triggers
                  save={(data: any) => {
                    triggers.splice(index, 1, data);
                  }}
                  key={index + Math.random()}
                  trigger={item}
                  position={index}
                  remove={(position: number) => {
                    triggers.splice(position, 1);
                    let data = [...triggers];
                    setTriggers([...data]);
                  }}
                />
              </div>
            ))}
            <Button icon="plus" type="link"
                    onClick={() => {
                      setTriggers([...triggers, {
                        _id: Math.round(Math.random() * 100000), name: '', trigger: '', cron: '',
                        device: {shakeLimit: {}, filters: [], productId: '', deviceId: '', type: '', modelId: ''},
                        scene: {}
                      }]);
                    }}
            >
              新增触发器
            </Button>
          </Card>

          <Card bordered={false} size="small">
            <p style={{fontSize: 16}}>
              <span>执行动作</span>
              <Switch key='parallel'
                      checkedChildren="并行执行" unCheckedChildren="串行执行"
                      defaultChecked={parallel || false}
                      style={{marginLeft: 20, width: '100px'}}
                      onChange={(value: boolean) => {
                        setParallel(value)
                      }}
              />
            </p>
            {action.length > 0 && action.map((item: any, index) => (
              <div key={index}>
                <ActionAssembly key={index + Math.random()} save={(actionData: any) => {
                  action.splice(index, 1, actionData);
                }} action={item} position={index} remove={(position: number) => {
                  action.splice(position, 1);
                  setAction([...action]);
                }}/>
              </div>
            ))}
            <Button icon="plus" type="link"
                    onClick={() => {
                      setAction([...action, {_id: Math.round(Math.random() * 100000)}]);
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
