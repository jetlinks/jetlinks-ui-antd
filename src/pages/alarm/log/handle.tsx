import React from 'react';
import { Modal, Input } from 'antd';
import { useState } from 'react';
import { FormComponentProps } from 'antd/lib/form';
import Form from 'antd/es/form';
import Service from './service';

interface Props extends FormComponentProps {
  visible?: boolean
  data?: object
  deviceId:string
  id:string
  onOk:Function
  onCancel?: (e: React.MouseEvent<HTMLElement>) => void
}


function Handle(props: Props) {
  const service = new Service('/alarm/log');
  const { onOk, ...extra } = props
  const {form: { getFieldDecorator },form} = props;

  const alarmSolve = () => {
    form.validateFields((err, fileValue) => {
      if (err) return;
      let params = {
        descriptionMono: fileValue.description,
        id: props.id,
        state: 'solve'
      }
      service.updataAlarmLog(props.deviceId, params).subscribe(() => {
        props.onOk();
      })
    });
  };

  return (
    <Modal
      title='告警处理结果'
      onOk={alarmSolve}
      {...extra}
      width='600px'
    >
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} key="solve_form">
            <Form.Item key="description" label="处理结果">
              {getFieldDecorator('description', {
                rules: [
                  { required: true, message: '请输入处理结果' },
                  { max: 2000, message: '处理结果不超过2000个字符' }
                ],
              })(
                <Input.TextArea rows={8} placeholder="请输入处理结果" />,
              )}
            </Form.Item>
          </Form>
    </Modal>
  );
}
export default Form.create<Props>()(Handle);

