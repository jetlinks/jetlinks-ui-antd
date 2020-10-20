import {Col, Form, Input, Modal, Radio, Row} from 'antd';
import {FormComponentProps} from 'antd/es/form';
import React, {useState} from 'react';
import {OpenApiItem} from '../data';
import {randomString} from '@/utils/utils';

interface Props extends FormComponentProps {
  close: Function;
  save: Function;
  data: Partial<OpenApiItem>;
}

const Save: React.FC<Props> = props => {
  const {
    form: {getFieldDecorator},
    form,
  } = props;

  const [id] = useState(randomString(16));
  const [secureKey] = useState(randomString(24));
  const [enableOAuth2, setEnableOAuth2] = useState(props.data.enableOAuth2);
  const submitData = () => {
    form.validateFields((err, fileValue) => {
      if (err) return;

      fileValue.signature = "MD5";
      if (!props.data.id) {
        fileValue.status = 1;
      }
      props.save(fileValue);
    });
  };

  const renderConfig = () => {

    if (enableOAuth2) {
      return (
        <div>
          <Form.Item label="redirectUrl" key='redirectUrl'>
            {getFieldDecorator('redirectUrl', {
              initialValue: props.data.redirectUrl,
            })(<Input/>)}
          </Form.Item>
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <Modal
      title={`${props.data.id ? '编辑' : '新建'}客户端`}
      visible
      okText="确定"
      cancelText="取消"
      width={800}
      onOk={() => {
        submitData();
      }}
      onCancel={() => props.close()}
    >
      <Form labelCol={{span: 4}} wrapperCol={{span: 20}}>
        <Form.Item key="clientName" label="名称">
          {getFieldDecorator('clientName', {
            rules: [{required: true}],
            initialValue: props.data.clientName,
          })(<Input placeholder="请输入"/>)}
        </Form.Item>
        <Row>
          <Col span={12}>
            <Form.Item key="id" label="clientId" labelCol={{span: 8}} wrapperCol={{span: 16}}>
              {getFieldDecorator('id', {
                rules: [{required: true}],
                initialValue: !props.data.id ? id : props.data.id,
              })(<Input placeholder="请输入" disabled={true}/>)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item key="secureKey" label="secureKey" labelCol={{span: 8}} wrapperCol={{span: 16}}>
              {getFieldDecorator('secureKey', {
                rules: [{required: true}],
                initialValue: props.data.id ? props.data.secureKey : secureKey,
              })(<Input placeholder="请输入"/>)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item key="username" label="用户名" labelCol={{span: 8}} wrapperCol={{span: 16}}>
              {getFieldDecorator('username', {
                rules: [{required: true}],
                initialValue: props.data.username,
              })(<Input placeholder="请输入" disabled={!!props.data.id}/>)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item key="password" label="密码" labelCol={{span: 8}} wrapperCol={{span: 16}}>
              {getFieldDecorator('password', {
                rules: [{required: !props.data.id}],
                initialValue: props.data.password,
              })(<Input.Password placeholder="请输入" disabled={!!props.data.id}/>)}
            </Form.Item>
          </Col>
        </Row>
        {/*<Form.Item key="signature" label="签名方式">
          {getFieldDecorator('signature', {
            rules: [{required: true}],
            initialValue: props.data.signature ? props.data.signature : 'MD5',
          })(
            <Radio.Group buttonStyle="solid">
              <Radio.Button value="MD5">MD5</Radio.Button>
              <Radio.Button value="SHA256">SHA256</Radio.Button>
            </Radio.Group>,
          )}
        </Form.Item>*/}
        <Form.Item key="enableOAuth2" label="开启OAuth2">
          {getFieldDecorator('enableOAuth2', {
            initialValue: !props.data.enableOAuth2 ? false : props.data.enableOAuth2,
          })(
            <Radio.Group buttonStyle="solid" onChange={(e) => {
              setEnableOAuth2(e.target.value);
            }}>
              <Radio.Button value={true}>开启</Radio.Button>
              <Radio.Button value={false}>关闭</Radio.Button>
            </Radio.Group>,
          )}
        </Form.Item>
        {renderConfig()}
        <Form.Item key="ipWhiteList" label="IP白名单">
          {getFieldDecorator('ipWhiteList', {
            initialValue: props.data.ipWhiteList,
          })(<Input.TextArea rows={3} placeholder="请输入"/>)}
        </Form.Item>

        <Form.Item key="description" label="描述">
          {getFieldDecorator('description', {
            initialValue: props.data.description,
          })(<Input.TextArea rows={3}/>)}
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default Form.create<Props>()(Save);
