import React, { useState } from 'react';
import { Modal, Form, Input, Select, Upload, Button, Icon, message } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { CertificateItem } from '../data.d';
import { getAccessToken } from '@/utils/authority';

interface Props extends FormComponentProps {
  close: Function;
  save: Function;
  data: Partial<CertificateItem>;
}
interface State {
  instance: string;
  keystoreBase64: string;
  trustKeyStoreBase64: string;
}
const Save: React.FC<Props> = props => {
  const {
    form: { getFieldDecorator, setFieldsValue },
    form,
  } = props;

  const initState: State = {
    instance: props.data?.instance || 'PEM',
    keystoreBase64: props.data?.configs?.keystoreBase64 || '',
    trustKeyStoreBase64: props.data?.configs?.trustKeyStoreBase64 || '',
  };

  const [instance, setInstance] = useState(initState.instance);
  const [keystoreBase64, setKeystoreBase64] = useState(initState.keystoreBase64);
  const [trustKeyStoreBase64, setTrustKeyStoreBase64] = useState(initState.trustKeyStoreBase64);
  // const [uploading, setUploading] = useState(initState.uploading);

  const submitData = () => {
    form.validateFields((err, fileValue) => {
      if (err) return;
      const { id } = props.data;
      props.save({ id, ...fileValue });
    });
  };

  return (
    <Modal
      visible
      title={`${props.data.id ? '编辑' : '新建'}证书`}
      onOk={() => {
        submitData();
      }}
      onCancel={() => {
        props.close();
      }}
      width={800}
    >
      <Form labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
        <Form.Item key="name" label="名称">
          {getFieldDecorator('name', {
            rules: [{ required: true }],
            initialValue: props.data?.name,
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item key="instance" label="类型">
          {getFieldDecorator('instance', {
            rules: [{ required: true }],
            initialValue: props.data?.instance || instance,
          })(
            <Select
              placeholder="请输入"
              onChange={(e: string) => {
                setInstance(e);
              }}
            >
              {[
                { id: 'PFX', text: 'PFX' },
                { id: 'JKS', text: 'JKS' },
                { id: 'PEM', text: 'PEM' },
              ].map(item => (
                <Select.Option value={item.id} key={item.id}>
                  {item.text}
                </Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item key="configs.keystoreBase64" label="密钥库">
          <Upload
            name="file"
            action="/jetlinks/network/certificate/upload"
            // showUploadList={false}
            headers={{
              'X-Access-Token': getAccessToken(),
            }}
            onChange={info => {
              if (info.file.status !== 'uploading') {
                // setUploading(true);
              }
              if (info.file.status === 'done') {
                const {
                  file: { response },
                } = info;
                if (response.status === 200) {
                  message.success('上传成功');
                  setKeystoreBase64(response.result);
                  setFieldsValue({ 'configs.keystoreBase64': response.result });
                }
                // setUploading(false)
              } else if (info.file.status === 'error') {
                // setUploading(false)
                // message.error(`${info.file.name} file upload failed.`);
              }
            }}
          >
            <Button style={{ width: '100%' }}>
              <Icon type="upload" />
              点击上传
            </Button>
          </Upload>
          {getFieldDecorator('configs.keystoreBase64', {
            // rules: [{ required: true }],
            initialValue: keystoreBase64,
          })(<Input.TextArea rows={3} />)}
        </Form.Item>
        {instance !== 'PEM' && (
          <Form.Item label="密钥库密码">
            {getFieldDecorator('configs.keystorePwd', {
              initialValue: props.data?.configs?.keystorePwd,
            })(<Input />)}
          </Form.Item>
        )}
        <Form.Item key="configs.trustKeyStoreBase64" label="信任库">
          <Upload
            name="file"
            action="/jetlinks/network/certificate/upload"
            // listType="picture"
            headers={{
              'X-Access-Token': getAccessToken(),
            }}
            // showUploadList={false}
            onChange={info => {
              if (info.file.status !== 'uploading') {
                // setUploading(true)
              }
              if (info.file.status === 'done') {
                const {
                  file: { response },
                } = info;
                if (response.status === 200) {
                  message.success('上传成功');
                  setTrustKeyStoreBase64(response.result);
                  setFieldsValue({ 'configs.trustKeyStoreBase64': response.result })
                }
                // setUploading(false)
              } else if (info.file.status === 'error') {
                // setUploading(false)
              }
            }}
          >
            <Button style={{ width: '100%' }}>
              <Icon type="upload" />
              点击上传
            </Button>
          </Upload>
          {getFieldDecorator('configs.trustKeyStoreBase64', {
            rules: [{ required: true }],
            initialValue: trustKeyStoreBase64,
          })(<Input.TextArea rows={3} />)}
        </Form.Item>
        {instance !== 'PEM' && (
          <Form.Item label="信任库密码">
            {getFieldDecorator('configs.trustKeyStorePwd', {
              initialValue: props.data?.configs?.trustKeyStorePwd,
            })(<Input />)}
          </Form.Item>
        )}
        <Form.Item key="description" label="描述">
          {getFieldDecorator('description', {
            rules: [{ required: true }],
            initialValue: props.data?.description,
          })(<Input.TextArea rows={3} />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default Form.create<Props>()(Save);
