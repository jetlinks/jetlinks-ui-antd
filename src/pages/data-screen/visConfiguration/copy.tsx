import React, { useEffect, useState } from "react";
import { Form, Input, message, Modal, TreeSelect } from "antd";
import { FormComponentProps } from "antd/es/form";
import api from '@/services'
const { TreeNode } = TreeSelect;
import {getAccessToken} from '@/utils/authority';

interface Props extends FormComponentProps {
  data?: any,
  close: Function,
  save: Function
}

const Save = (props: Props) => {
  const { form, form: { getFieldDecorator } } = props;
  const [categoryList, setCategoryList] = useState([]);
  const token = getAccessToken();

  const save = () => {
    form.validateFields((err, fileValue) => {
      if (err) return;
      let param = {
        description: fileValue.description,
        id: fileValue.id,
        name: fileValue.name,
        type: "big_screen",
        target: "",
        metadata: props.data.metadata || "",
        catalogId: fileValue.categoryId,
        state:{
            text: "启用",
            value: "enabled"
        }
      }
      api.screen.save(param).then(res => {
        if (res.status === 200) {
          props.save()
          props.data.url != '' ? window.open(props.data.url+'#/build/'+res.result.id+'?token=' + token,'_blank') : message.error('配置错误,请联系管理员')
        }
      })
    })
  };
  let getView = (view: any) => {
    return (
      <TreeNode title={view.name} value={view.id} key={view.id}>
        {
          view.children && view.children.length > 0 ? view.children.map((v: any) => {
            return getView(v)
          }) : ''
        }
      </TreeNode>
    )
  };
  useEffect(() => {
    api.categoty.query_tree({}).then(res => {
      if (res.status === 200) {
        setCategoryList(res.result)
      }
    })
  }, []);
  return (
    <Modal
      visible
      title="复制组态"
      onCancel={() => props.close()}
      onOk={() => {
        save()
      }}
    >
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        <Form.Item key="id" label="ID">
          {getFieldDecorator('id', {
            rules: [{ required: true, message: '请输入ID' }]
          })(<Input placeholder="请输入ID" />)}
        </Form.Item>
        <Form.Item key="name" label="名称">
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入名称' }]
          })(<Input placeholder="请输入名称" />)}
        </Form.Item>
        {/* <Form.Item key="categoryId" label="分类">
          {getFieldDecorator('categoryId', {
            rules: [{ required: true, message: '请选择分类' }]
          })(<TreeSelect
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="请选择分类"
            allowClear
          >
            {
              categoryList.map((v: any) => {
                return getView(v)
              })
            }
          </TreeSelect>)}
        </Form.Item> */}
        <Form.Item key="description" label="说明">
          {getFieldDecorator('description', {
            rules: [{ required: false, message: '请输入说明' }]
          })(<Input placeholder="请输入说明" />)}
        </Form.Item>
      </Form>
    </Modal>
  )
};
export default Form.create<Props>()(Save);
