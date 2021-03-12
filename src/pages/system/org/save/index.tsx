import { Modal, Form, Input } from 'antd';
import React from 'react';
import { FormComponentProps } from 'antd/lib/form';

interface Props extends FormComponentProps {
  close: Function;
  save: Function;
  data: any;
  parentId: string | null;
}

const Save: React.FC<Props> = props => {
  const {
    form: { getFieldDecorator },
    form,
    parentId,
    data,
    // data: { parentId }
  } = props;
  const saveData = () => {
    const value = form.getFieldsValue();
    const tempData = parentId ? {
      parentId,
      typeId: 'org', ...value
    } : {
        typeId: 'org', ...value, parentId: data.parentId
      };
    props.save(tempData);
  };
  const formateTitle = () => {
    let title = '';
    if (props.data.id) {
      title += '编辑';
    } else {
      title += '添加';
    }
    if (parentId) {
      title += `${parentId}子`;
    }
    title += '机构';
    return title;
  };

  return (
    <Modal title={formateTitle()} visible onOk={() => saveData()} onCancel={() => props.close()}>
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        <Form.Item label="机构标识">
          {getFieldDecorator('id', {
            rules: [{ required: true, message: '请输入机构标识' }],
            initialValue: data.id,
          })(<Input placeholder="机构标识" disabled={!!data.id} />)}
        </Form.Item>
        <Form.Item label="机构名称">
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入机构名称' }],
            initialValue: data.name,
          })(<Input placeholder="机构名称" />)}
        </Form.Item>
        <Form.Item label="描述">
          {getFieldDecorator('describe', {
            initialValue: data.describe,
          })(<Input.TextArea placeholder="描述" />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default Form.create<Props>()(Save);
