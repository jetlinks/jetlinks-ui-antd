import React from 'react';
import Form from 'antd/es/form';
import {FormComponentProps} from 'antd/lib/form';
import {Input, message, Modal, Select} from 'antd';
import Service from "@/pages/media/device/service";

interface Props extends FormComponentProps {
  close: Function;
  data: any;
}

const Update: React.FC<Props> = props => {

  const service = new Service('media/channel');

  const {
    form: {getFieldDecorator},
    form,
  } = props;

  const submitData = () => {
    form.validateFields((err, fileValue) => {
      if (err) return;

      fileValue.id = props.data.id;

      service.update(fileValue).subscribe(
        () => {
          message.success('保存成功');
          props.close();
        },
        () => {
          message.error("保存错误");
        },
        () => {
        });
    });
  };

  return (
    <Modal
      title={`编辑设备通道`}
      visible
      okText="确定"
      cancelText="取消"
      onOk={() => {
        submitData();
      }}
      onCancel={() => props.close()}
    >
      <Form labelCol={{span: 5}} wrapperCol={{span: 19}}>
        <Form.Item key="channelId" label="通道id">
          {getFieldDecorator('channelId', {
            initialValue: props.data.channelId,
          })(<Input readOnly/>)}
        </Form.Item>
        <Form.Item key="name" label="通道名称">
          {getFieldDecorator('name', {
            rules: [
              {required: true, message: '请输入通道名称'},
              {max: 200, message: '设备名称不超过200个字符'}
            ],
            initialValue: props.data.name,
          })(<Input placeholder="请输入设备名称"/>)}
        </Form.Item>
        <Form.Item key="address" label="安装地址">
          {getFieldDecorator('address', {
            rules: [
              {required: true, message: '请输入安装地址'},
              {max: 200, message: '安装地址不超过200个字符'}
            ],
            initialValue: props.data.address,
          })(<Input placeholder="请输入设备名称"/>)}
        </Form.Item>
        <Form.Item key="ptzType" label="云台类型">
          {getFieldDecorator('ptzType', {
            rules: [
              {required: true, message: '请选择云台类型'}
            ],
            initialValue: props.data?.ptzType.value || 0,
          })(
            <Select>
              <Select.Option value={0}>未知</Select.Option>
              <Select.Option value={1}>球体</Select.Option>
              <Select.Option value={2}>半球体</Select.Option>
              <Select.Option value={3}>固定枪机</Select.Option>
              <Select.Option value={4}>遥控枪机</Select.Option>
            </Select>
          )}
        </Form.Item>

        <Form.Item key="description" label="说明">
          {getFieldDecorator('description', {
            initialValue: props.data.description,
          })(<Input.TextArea rows={5} placeholder="请输入至少五个字符"/>)}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Form.create<Props>()(Update);
