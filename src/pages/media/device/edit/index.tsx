import React from 'react';
import Form from 'antd/es/form';
import {FormComponentProps} from 'antd/lib/form';
import {Input, message, Modal, Radio} from 'antd';
import Service from "@/pages/media/device/service";

interface Props extends FormComponentProps {
  close: Function;
  data: any;
}

const Update: React.FC<Props> = props => {

  const service = new Service('media/device');

  const {
    form: {getFieldDecorator},
    form,
  } = props;

  const submitData = () => {
    form.validateFields((err, fileValue) => {
      if (err) return;

      service.update(fileValue).subscribe(
        () => {
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
      title={`编辑设备`}
      visible
      okText="确定"
      cancelText="取消"
      onOk={() => {
        submitData();
      }}
      onCancel={() => props.close()}
    >
      <Form labelCol={{span: 6}} wrapperCol={{span: 18}}>
        <Form.Item key="id" label="设备编码">
          {getFieldDecorator('id', {
            initialValue: props.data.id,
          })(<Input placeholder="请输入设备id" readOnly={!!props.data.id}/>)}
        </Form.Item>
        <Form.Item key="name" label="设备名称">
          {getFieldDecorator('name', {
            rules: [
              {required: true, message: '请输入设备名称'},
              {max: 200, message: '设备名称不超过200个字符'}
            ],
            initialValue: props.data.name,
          })(<Input placeholder="请输入设备名称"/>)}
        </Form.Item>
        <Form.Item key="streamMode" label="流传输模式">
          {getFieldDecorator('streamMode', {
            rules: [
              {required: true, message: '请输入设备名称'},
              {max: 200, message: '设备名称不超过200个字符'}
            ],
            initialValue: props.data.streamMode,
          })(
            <Radio.Group buttonStyle="solid">
              <Radio.Button value="UDP">UDP</Radio.Button>
              {/* <Radio.Button value="TCP_ACTIVE">TCP主动</Radio.Button> */}
              <Radio.Button value="TCP_PASSIVE">TCP被动</Radio.Button>
            </Radio.Group>
          )}
        </Form.Item>

        <Form.Item key="describe" label="说明">
          {getFieldDecorator('describe', {
            initialValue: props.data.describe,
          })(<Input.TextArea rows={5} placeholder="请输入至少五个字符"/>)}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Form.create<Props>()(Update);
