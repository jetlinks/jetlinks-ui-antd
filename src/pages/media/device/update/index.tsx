import React, {useEffect} from 'react';
import Form from 'antd/es/form';
import {FormComponentProps} from 'antd/lib/form';
import {Input, message, Modal} from 'antd';
import Service from "@/pages/media/device/service";

interface Props extends FormComponentProps {
  close: Function;
  data: any;
}

const Update: React.FC<Props> = props => {

  const service = new Service('device/instance');

  const {
    form: {getFieldDecorator},
    form,
  } = props;

  const submitData = () => {
    form.validateFields((err, fileValue) => {
      if (err) return;

      service.update(fileValue).subscribe(
        (data) => {
          props.close();
        },
        () => {
          message.error("保存错误");
        },
        () => {
        });
    });
  };

  useEffect(() => {
    // 获取下拉框数据

  }, []);

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
      <Form labelCol={{span: 4}} wrapperCol={{span: 20}}>
        <Form.Item key="id" label="设备id">
          {getFieldDecorator('id', {
            rules: [
              {required: true, message: '请输入设备id'},
              {max: 64, message: '设备ID不超过64个字符'},
              {pattern: new RegExp(/^[0-9a-zA-Z_\-]+$/, "g"), message: '产品ID只能由数字、字母、下划线、中划线组成'}
            ],
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
