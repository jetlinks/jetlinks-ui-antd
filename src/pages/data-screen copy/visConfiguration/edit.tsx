import React, {useEffect, useState} from "react";
import {Form, Input, message, Modal, TreeSelect} from "antd";
import {FormComponentProps} from "antd/es/form";
import api from '@/services'
import {getAccessToken} from '@/utils/authority';

const {TreeNode} = TreeSelect;

interface Props extends FormComponentProps {
  data: any,
  close: Function,
  save: Function
}

const Save = (props: Props) => {
  const {form, form: {getFieldDecorator}} = props;
  // const [categoryList, setCategoryList] = useState([]);
  const token = getAccessToken();

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

  const save = () => {
    form.validateFields((err, fileValue) => {
      if (err) return;
      fileValue.type = 'vis_configuration';
      fileValue.target="";
      fileValue.state = {
        text: "启用",
        value: "enabled"
      };
      api.screen.update(fileValue.id, fileValue).then(res => {
        if (res.status === 200) {
          props.save();
          // props.data.url != '' ? window.open( props.data.url + '#/build/'+fileValue.id+'?token=' + token,'_blank') : message.error('配置错误,请联系管理员')
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
  return (
    <Modal
      visible
      title="编辑组态"
      onCancel={() => props.close()}
      onOk={() => {
        save()
      }}
    >
      <Form labelCol={{span: 4}} wrapperCol={{span: 20}}>
        <Form.Item key="id" label="ID">
          {getFieldDecorator('id', {
            rules: [{required: true, message: '请输入ID'}],
            initialValue: props.data.id ? props.data.id : ''
          })(<Input placeholder="请输入ID" readOnly={!!props.data.id}/>)}
        </Form.Item>
        <Form.Item key="name" label="名称">
          {getFieldDecorator('name', {
            rules: [{required: true, message: '请输入名称'}],
            initialValue: props.data.name ? props.data.name : ''
          })(<Input placeholder="请输入名称"/>)}
        </Form.Item>
        {/* <Form.Item key="catalogId" label="分类">
          {getFieldDecorator('catalogId', {
            rules: [{required: true, message: '请选择分类'}],
            initialValue: props.data.catalogId
          })(<TreeSelect
              allowClear treeDataSimpleMode showSearch
              placeholder="选择分类" treeData={categoryList}
              treeNodeFilterProp='title' searchPlaceholder='根据分类名称模糊查询'
            />)}
        </Form.Item> */}
        <Form.Item key="description" label="说明">
          {getFieldDecorator('description', {
            rules: [{required: false, message: '请输入说明'}],
            initialValue: props.data.description ? props.data.description : ''
          })(<Input placeholder="请输入说明"/>)}
        </Form.Item>
      </Form>
    </Modal>
  )
};
export default Form.create<Props>()(Save);
