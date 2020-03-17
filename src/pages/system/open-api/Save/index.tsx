import { Form, Modal, Input, Radio } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import React, { useState } from 'react';
import { OpenApiItem } from '../data';
import { randomString } from '@/utils/utils';

interface Props extends FormComponentProps {
  close: Function;
  save: Function;
  data: Partial<OpenApiItem>;
}
const Save: React.FC<Props> = props => {
  const {
    form: { getFieldDecorator },
    form,
  } = props;
  // const [data, setData] = useState(props.data);
  //const password = randomString(16);
  const [id, setId] = useState(randomString(16));
  const [secureKey, setSecureKey] = useState(randomString(24));
  const submitData = () => {
    form.validateFields((err, fileValue) => {
      if (err) return;
      if (!props.data.id) {
        fileValue.status = 1;
      }
      /*if (password === fileValue.password) {
                fileValue.password = undefined;
            }*/
      props.save(fileValue);
    });
  };

  return (
    <Modal
      title={`${props.data.id ? '编辑' : '新建'}客户端`}
      visible
      okText="确定"
      cancelText="取消"
      width={640}
      onOk={() => {
        submitData();
      }}
      onCancel={() => props.close()}
    >
      <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Form.Item key="id" label="clientId">
          {getFieldDecorator('id', {
            rules: [{ required: true }],
            initialValue: props.data.id ? props.data.id : id,
          })(<Input placeholder="请输入" disabled="true" />)}
        </Form.Item>
        <Form.Item key="clientName" label="名称">
          {getFieldDecorator('clientName', {
            rules: [{ required: true }],
            initialValue: props.data.clientName,
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item key="secureKey" label="secureKey">
          {getFieldDecorator('secureKey', {
            rules: [{ required: true }],
            initialValue: props.data.id ? props.data.secureKey : secureKey,
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        {
          props.data.id?(<Form.Item key="username" label="用户名">
            {getFieldDecorator('username', {
              initialValue: props.data.username,
            })(<Input placeholder="请输入" disabled="true"/>)}
          </Form.Item>):(<Form.Item key="username" label="用户名">
            {getFieldDecorator('username', {
              rules: [{ required: true }],
              initialValue: props.data.username,
            })(<Input placeholder="请输入" />)}
          </Form.Item>)
        }
        {
          props.data.id?(<Form.Item key="password" label="密码">
            {getFieldDecorator('password', {
            })(<Input.Password placeholder="请输入" disabled="true"/>)}
          </Form.Item>):(<Form.Item key="password" label="密码">
            {getFieldDecorator('password', {
              rules: [{ required: true }],
            })(<Input.Password placeholder="请输入" />)}
          </Form.Item>)
        }

        <Form.Item key="signature" label="签名方式">
          {getFieldDecorator('signature', {
            rules: [{ required: true }],
            initialValue: props.data.signature ? props.data.signature : 'MD5',
          })(
            <Radio.Group buttonStyle="solid">
              <Radio.Button value="MD5">MD5</Radio.Button>
              <Radio.Button value="SHA256">SHA256</Radio.Button>
            </Radio.Group>,
          )}
        </Form.Item>

        <Form.Item key="ipWhiteList" label="IP白名单">
          {getFieldDecorator('ipWhiteList', {
            initialValue: props.data.ipWhiteList,
          })(<Input.TextArea rows={3} placeholder="请输入" />)}
        </Form.Item>

        <Form.Item key="description" label="描述">
          {getFieldDecorator('description', {
            initialValue: props.data.description,
          })(<Input.TextArea rows={3} />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default Form.create<Props>()(Save);
