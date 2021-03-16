import React from 'react';
import { Form, Row, Col, Input, Select, Radio } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { PermissionAction, PermissionItem } from '../../data';
import Editable from './Editable';
import style from '../index.less';
import PubSub from 'pubsub-js';

interface Props extends FormComponentProps {
  data: Partial<PermissionItem>;
  save: Function;
}

const Basic: React.FC<Props> = props => {
  const {
    form: { getFieldDecorator },
    data,
    form,
  } = props;

  const permissionType = [
    { id: 'default', text: '默认' },
    { id: 'system', text: '系统' },
    { id: 'business', text: '业务功能' },
    { id: 'api', text: 'API接口' },
    { id: 'tenant', text: '多租户' },
  ];

  var defaultActionData: PermissionAction[] = [
    { action: 'query', describe: '查询列表', defaultCheck: true, name: '查询列表' },
    { action: 'get', describe: '查询明细', defaultCheck: true, name: '查询明细' },
    { action: 'add', describe: '新增', defaultCheck: true, name: '新增' },
    { action: 'update', describe: '修改', defaultCheck: true, name: '修改' },
    { action: 'delete', describe: '删除', defaultCheck: false, name: '删除' },
    { action: 'import', describe: '导入', defaultCheck: true, name: '导入' },
    { action: 'export', describe: '导出', defaultCheck: true, name: '导出' },
  ];

  PubSub.unsubscribe('permission-basic-save');
  PubSub.subscribe('permission-basic-save', (topic: any, data: any) => {
    form.validateFields((err, fieldValue) => {
      if (err) {
        data.callback('error');
      } else {
        // fieldValue.type = fieldValue.type.toString();
        data.callback(fieldValue);
      }
    });
  });

  return (
    <div>
      <Form labelAlign={'right'} className={style['ant-form-item']}>
        <Row>
          <Col span={12}>
            <Form.Item
              key="id"
              label="权限标识（ID）"
              labelCol={{ span: 12 }}
              wrapperCol={{ span: 12 }}
            >
              {getFieldDecorator('id', {
                initialValue: data.id,
                rules: [{ required: true, message: '请输入权限标识' }],
              })(
                <Input placeholder="只能由字母数字下划线组成" readOnly={data.id ? true : false} />,
              )}
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item key="name" label="权限名称" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
              {getFieldDecorator('name', {
                initialValue: data.name,
                rules: [{ required: true, message: '请输入权限名称' }],
              })(<Input />)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item key="status" label="状态" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
              {getFieldDecorator('status', {
                initialValue: data?.status,
                rules: [{ required: true, message: '请选择状态' }],
              })(
                <Radio.Group buttonStyle="solid">
                  <Radio.Button value={1}>启 用</Radio.Button>
                  <Radio.Button value={0}>禁 用</Radio.Button>
                </Radio.Group>,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              key="properties.type"
              label="分类"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 12 }}
            >
              {getFieldDecorator('properties.type', {
                initialValue: (data.properties || {}).type,
              })(
                <Select mode="multiple">
                  {permissionType.map(option => (
                    <Select.Option value={option.id} key={option.id}>
                      {option.text}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Editable
        data={data.id ? data.actions || [] : defaultActionData}
        save={(data: any) => {
          props.save(data);
        }}
      />
    </div>
  );
};
export default Form.create<Props>()(Basic);
