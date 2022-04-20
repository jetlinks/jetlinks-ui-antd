import { useEffect, useState } from 'react';
import { service } from '../index';
import { useRequest } from 'umi';
import { Form, Input, message, Modal } from 'antd';
import ProviderItem from './ProviderSelect';

interface SaveProps {
  visible: boolean;
  reload: (id: string, data: any) => void;
  type: string;
  close?: () => void;
}

export default (props: SaveProps) => {
  const { visible, close, reload } = props;
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const { data: providerList, run: getProviderList } = useRequest(service.queryProvider, {
    manual: true,
    formatResult: (response) => response.result.data,
  });

  useEffect(() => {
    if (visible) {
      getProviderList({
        sorts: [{ name: 'createTime', order: 'desc' }],
        terms: [{ column: 'provider', value: props.type }],
        pageSize: 100,
      });
    }
  }, [visible]);

  useEffect(() => {
    if (form) {
      form.setFieldsValue({ accessProvider: props.type });
    }
  }, [props.type]);

  const onClose = () => {
    form.resetFields();
    if (close) {
      close();
    }
  };

  const onSubmit = async () => {
    const formData = await form.validateFields();
    if (formData) {
      formData.deviceType = 'device';
      setLoading(true);
      const resp = await service.saveProduct(formData);
      if (resp.status === 200) {
        //  新增成功之后 发布产品
        const deployResp = await service.deployProductById(resp.result.id);
        setLoading(false);
        if (deployResp.status === 200) {
          if (reload) {
            reload(resp.result.id, resp.result.name);
          }
          onClose();
        } else {
          message.error('新增失败');
        }
      } else {
        setLoading(false);
        message.error('新增失败');
      }
    }
  };

  return (
    <Modal
      maskClosable={false}
      mask={false}
      visible={visible}
      width={660}
      confirmLoading={loading}
      title={'快速添加'}
      onOk={onSubmit}
      onCancel={onClose}
    >
      <Form
        form={form}
        layout={'vertical'}
        labelCol={{
          style: { width: 100 },
        }}
      >
        <Form.Item
          name={'name'}
          label={'产品名称'}
          required
          rules={[
            { required: true, message: '请输入产品名称' },
            { max: 64, message: '最多可输入64个字符' },
          ]}
        >
          <Input placeholder={'请输入产品名称'} />
        </Form.Item>
        <Form.Item
          name={'accessId'}
          label={'接入网关'}
          required
          rules={[{ required: true, message: '请选择接入网关' }]}
        >
          <ProviderItem
            options={providerList}
            type={props.type}
            onSelect={(_, rowData) => {
              form.setFieldsValue({
                accessName: rowData.name,
                protocolName: rowData.protocolDetail.name,
                messageProtocol: rowData.protocolDetail.id,
                transportProtocol: rowData.transportDetail.id,
                accessProvider: rowData.provider,
              });
            }}
          />
        </Form.Item>
        <Form.Item name={'accessName'} hidden>
          <Input />
        </Form.Item>
        <Form.Item name={'messageProtocol'} hidden>
          <Input />
        </Form.Item>
        <Form.Item name={'protocolName'} hidden>
          <Input />
        </Form.Item>
        <Form.Item name={'transportProtocol'} hidden>
          <Input />
        </Form.Item>
        <Form.Item name={'accessProvider'} hidden>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};
