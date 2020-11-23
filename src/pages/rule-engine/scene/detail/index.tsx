import React, { useEffect, useState } from 'react';
import Form from 'antd/es/form';
import { FormComponentProps } from 'antd/lib/form';
import { Card, Col, Icon, Input, Modal, Row, Switch, Tooltip } from 'antd';
import { SceneItem } from '../data';
import Triggers from './Triggers';
import Action from './action';
import apis from '@/services';

interface Props extends FormComponentProps {
  close: Function;
  data: Partial<SceneItem>;
}
const Detail: React.FC<Props> = props => {

  const [data, setData] = useState(props.data);

  useEffect(() => {
    if (props.data.id) {
      apis.scene.info(props.data.id).then(res => {
        if (res.status === 200) {
          setData(res.result)
        }
      })
    }
  }, []);

  return (
    <Modal
      title='查看场景联动'
      visible
      okText="确定"
      cancelText="取消"
      onOk={() => {
        props.close()
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
                  readOnly={true}
                  onBlur={event => {
                    data.id = event.target.value;
                  }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item key="name" label="场景联动名称">
                <Input placeholder="输入场景联动名称"
                  defaultValue={data.name}
                  readOnly={true}
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
            {data.triggers.length > 0 && data.triggers.map((item: any, index: number) => (
              <div key={index}>
                <Triggers
                  save={(data: any) => {
                    data.triggers.splice(index, 1, data);
                  }}
                  trigger={item}
                  position={index}
                />
              </div>
            ))}
          </Card>

          <Card bordered={false} size="small">
            <p style={{ fontSize: 16 }}>
              <span>执行动作</span>
              <Switch key='parallel'
                checkedChildren="并行执行" unCheckedChildren="串行执行"
                defaultChecked={data.parallel || false}
                style={{ marginLeft: 20, width: '100px'}}
                disabled
              />
            </p>
            {data.actions.length > 0 && data.actions.map((item: any, index: number) => (
              <div key={index}>
                <Action
                  action={item}
                  position={index}
                />
              </div>
            ))}
          </Card>
        </Form>
      </div>
    </Modal>
  );
};

export default Form.create<Props>()(Detail);
