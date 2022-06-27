import React, {useEffect, useState} from "react";
import {Form, Input, message, Modal, TreeSelect} from "antd";
import {FormComponentProps} from "antd/es/form";
import api from '@/services'
import {getAccessToken} from '@/utils/authority';

interface Props extends FormComponentProps {
  data?: any,
  close: Function,
  save: Function
}

const Save = (props: Props) => {
  const { form, form: { getFieldDecorator } } = props;
  // const [categoryList, setCategoryList] = useState([]);
  const token = getAccessToken();

  const save = () => {
    form.validateFields((err, fileValue) => {
      if (err) return;

      fileValue.type = 'vis_configuration';
      fileValue.target="";
      fileValue.state = {
        text: "启用",
        value: "enabled"
      };

      api.screen.save(fileValue).then(res => {
        if (res.status === 200) {
          props.save();
          // props.data != '' ? window.open(props.data+'#/build/'+res.result.id+'?token=' + token,'_blank') : message.error('配置错误,请联系管理员')
        }
      })
    })
  };

  useEffect(() => {
    // api.categoty.queryNoPaging({}).then(res => {
    //   if (res.status === 200) {
    //     let list: any = [];
    //     res.result.map((item: any) => {
    //       list.push({ id: item.id, pId: item.parentId, value: item.id, title: item.name })
    //     });
    //     setCategoryList(list);
    //   }
    // })
  }, []);
  return (
    <Modal
      visible
      title="新增组态"
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
        {/* <Form.Item key="catalogId" label="分类">
          {getFieldDecorator('catalogId', {
            rules: [{required: true, message: '请选择分类'}],
          })(<TreeSelect
            allowClear treeDataSimpleMode showSearch
            placeholder="选择分类" treeData={categoryList}
            treeNodeFilterProp='title' searchPlaceholder='根据分类名称模糊查询'
          />)}
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
