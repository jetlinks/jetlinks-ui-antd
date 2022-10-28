import { Form, Input, message, Modal, Select } from 'antd';
import { useEffect } from 'react';

import { service } from './index';
import { useRequest } from 'ahooks';
import { OperatorList, TypeList } from '@/pages/iot-card/data';

type SaveType = {
  type: 'add' | 'edit';
  data?: any;
  onCancel: () => void;
  onOk: () => void;
};

const Save = (props: SaveType) => {
  const [form] = Form.useForm();

  const { data: platformList, run: platformRun } = useRequest(service.queryPlatformNoPage, {
    manual: true,
    formatResult(result) {
      return result.result;
    },
  });

  useEffect(() => {
    platformRun({
      sorts: [{ name: 'createTime', order: 'desc' }],
      terms: [{ column: 'state', value: 'enabled' }],
    });
    if (props.type === 'edit' && form) {
      form.setFieldsValue(props.data);
    }
  }, []);

  const submit = async () => {
    const formData = await form.validateFields();
    if (formData) {
      const resp =
        props.type === 'add' ? await service.save(formData) : await service.update(formData);

      if (resp.status === 200) {
        message.success('操作成功');
        props?.onOk();
      }
    }
  };
  return (
    <Modal
      title={props.type === 'add' ? '新增' : '编辑'}
      visible={true}
      width={600}
      onCancel={props.onCancel}
      onOk={submit}
    >
      <Form
        form={form}
        labelCol={{
          style: { width: 100 },
        }}
        layout={'vertical'}
      >
        <Form.Item
          label={'卡号'}
          name={'id'}
          required
          rules={[
            { required: true, message: '请输入卡号' },
            { max: 64, message: '最多可输入64个字符' },
          ]}
        >
          <Input placeholder={'请输入卡号'} disabled={props.type === 'edit'} />
        </Form.Item>
        <Form.Item
          label={'ICCID'}
          name={'iccId'}
          required
          rules={[
            { required: true, message: '请输入ICCID' },
            { max: 64, message: '最多可输入64个字符' },
          ]}
        >
          <Input placeholder={'请输入ICCID'} disabled={props.type === 'edit'} />
        </Form.Item>
        <Form.Item
          label={'平台对接'}
          name={'platformConfigId'}
          required
          rules={[{ required: true, message: '请选择平台对接' }]}
        >
          <Select
            showSearch
            placeholder={'请选择平台对接'}
            disabled={props.type === 'edit'}
            fieldNames={{ label: 'name', value: 'id' }}
            options={platformList}
            filterOption={(input, option) => {
              if (option?.name) {
                return option.name.includes(input);
              }
              return false;
            }}
          />
        </Form.Item>
        <Form.Item label={'运营商'} name={'operatorName'}>
          <Select
            showSearch
            placeholder={'请选择运营商'}
            options={OperatorList}
            filterOption={(input, option) => {
              if (option?.label) {
                return option.label.includes(input);
              }
              return false;
            }}
          />
        </Form.Item>
        <Form.Item
          label={'类型'}
          name={'cardType'}
          required
          rules={[{ required: true, message: '请选择类型' }]}
        >
          <Select
            showSearch
            placeholder={'请选择类型'}
            disabled={props.type === 'edit'}
            options={TypeList}
            filterOption={(input, option) => {
              if (option?.label) {
                return option.label.includes(input);
              }
              return false;
            }}
          />
        </Form.Item>
        <Form.Item label={'说明'} name={'describe'}>
          <Input.TextArea showCount maxLength={200} placeholder="请输入说明" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Save;
