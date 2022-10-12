import React, {useEffect, useState} from 'react';
import Form from 'antd/es/form';
import {FormComponentProps} from 'antd/lib/form';
import {Input, message, Modal, Select, Spin, TreeSelect} from 'antd';
import apis from '@/services';

interface Props extends FormComponentProps {
  close: Function;
  reload: Function;
  data: any;
}

const Save: React.FC<Props> = props => {
  const {
    form: {getFieldDecorator},
    form,
  } = props;
  const submitData = () => {
    form.validateFields((err, fileValue) => {
      if (err) return;

      preservation(fileValue);
    });
  };

  const preservation = (item: any) => {
    if (props.data.id) {
      apis.onelink.save(props.data.id, item)
        .then((response: any) => {
          if (response.status === 200) {
            message.success('保存成功');
            props.close();
            props.reload()
          }
        })
        .catch(() => {
        });
    } else {
      apis.onelink.saveData(item)
        .then((response: any) => {
          if (response.status === 200) {
            message.success('创建成功');
            props.close();
            props.reload()
          }
        })
        .catch(() => {
        });
    }
  };

  useEffect(() => {}, []);

  return (
    <Modal
      title={`${props.data.id ? '编辑' : '新增'}`}
      visible
      okText="确定"
      cancelText="取消"
      onOk={() => {
        submitData();
      }}
      onCancel={() => props.close()}
    >
      <Spin spinning={false}>
        <Form labelCol={{span: 4}} wrapperCol={{span: 20}}>
          <Form.Item key="name" label="名称">
            {getFieldDecorator('name', {
              rules: [
                {required: true, message: '请输入设备名称'},
                {max: 200, message: '设备名称不超过200个字符'}
              ],
              initialValue: props.data.name,
            })(<Input placeholder="请输入设备名称"/>)}
          </Form.Item>
          <Form.Item key="appId" label="应用编码">
            {getFieldDecorator('appId', {
              rules: [
                {required: true, message: '请输入应用编码'}
              ],
              initialValue: props.data.appId,
            })(<Input placeholder="请输入应用编码"/>)}
          </Form.Item>
          <Form.Item key="passWord" label="password">
            {getFieldDecorator('passWord', {
              rules: [
                {required: true, message: '请输入password'}
              ],
              initialValue: props.data.passWord,
            })(<Input placeholder="请输入password"/>)}
          </Form.Item>
          <Form.Item key="apiAddr" label="接口地址">
            {getFieldDecorator('apiAddr', {
              rules: [
                {required: true, message: '请输入接口地址'}
              ],
              initialValue: props.data.apiAddr,
            })(<Input placeholder="请输入接口地址"/>)}
          </Form.Item>
          <Form.Item key="explain" label="说明">
            {getFieldDecorator('explain', {
              initialValue: props.data.explain,
            })(<Input.TextArea rows={4} placeholder="请输入至少五个字符"/>)}
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default Form.create<Props>()(Save);
