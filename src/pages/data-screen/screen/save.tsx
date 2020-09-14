import React, { useEffect, useState } from "react";
import { Form, Input, Modal, TreeSelect } from "antd";
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
        catalogId:'000002',
        state:{
            text: "启用",
            value: "enabled"
        }
      }
      api.screen.save(param).then(res => {
        if (res.status === 200) {
          // console.log(res)
          props.save()
          // window.open('http://localhost:8080/build/'+res.result.id+'?token=' + token,'_blank')
        }
      })
    })
  };
  let getView = (view: any) => {
    if (view.children && view.children.length > 0) {
      return (
        <TreeNode title={view.name} value={view.id}>
          {
            view.children.map((v: any) => {
              return getView(v)
            })
          }
        </TreeNode>
      )
    }
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
      title="新增大屏"
      onCancel={() => props.close()}
      onOk={() => {
        save()
      }}
    >
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        <Form.Item key="id" label="大屏ID">
          {getFieldDecorator('id', {
            rules: [{ required: true, message: '请输入大屏ID' }]
          })(<Input placeholder="请输入大屏ID" />)}
        </Form.Item>
        <Form.Item key="name" label="大屏名称">
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入大屏名称' }]
          })(<Input placeholder="请输入大屏名称" />)}
        </Form.Item>
        <Form.Item key="categoryId" label="分类">
          {getFieldDecorator('categoryId', {
            rules: [{ required: true, message: '请选择分类' }]
          })(<TreeSelect
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="请选择分类"
            allowClear
          >
            {
              categoryList.map((v) => {
                return getView(v)
              })
            }
          </TreeSelect>)}
        </Form.Item>
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
