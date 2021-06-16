import { Modal, Form, Input, InputNumber } from 'antd';
import React from 'react';
import { FormComponentProps } from 'antd/lib/form';

interface Props extends FormComponentProps {
  close: Function;
  save: Function;
  data: any;
  parentId: any;
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
    let tempData = {};
    //添加下级
    if (parentId) {
      tempData = {
        parentId:parentId.id,
        typeId: 'org',
        ...value,
      };
    } else {
      //编辑
      tempData = {
        ...data,
        typeId: 'org',
        ...value,
      };
    }
    // console.log(tempData)
    // const tempData = parentId ? {
    //   parentId,
    //   typeId: 'org', ...value,
    // } : {
    //     typeId: 'org', ...value, parentId: data.parentId
    //   };
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
      title += `${parentId.name}子`;
    }
    title += '机构';
    return title;
  };

  return (
    <Modal title={formateTitle()} visible onOk={() => saveData()} onCancel={() => props.close()}>
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        <Form.Item label="机构编码">
          {getFieldDecorator('code', {
            rules: [{ required: true, message: '请输入机构编码' }],
            initialValue: data.code,
          })(<Input placeholder="请输入机构编码" />)}
        </Form.Item>
        <Form.Item label="机构名称">
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入机构名称' }],
            initialValue: data.name,
          })(<Input placeholder="机构名称" />)}
        </Form.Item>
        <Form.Item label="排序序号">
          {getFieldDecorator('sortIndex', {
            rules: [{ required: true, message: '请输入排序序号' }],
            initialValue: data.sortIndex,
          })(<InputNumber style={{ width: '100%' }} placeholder="请输入排序序号" />)}
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
