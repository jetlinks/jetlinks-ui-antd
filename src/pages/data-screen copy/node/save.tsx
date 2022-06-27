import { Modal } from 'antd';
import React from 'react';
import SchemaForm, { createFormActions, FormEffectHooks } from '@formily/antd';
import { NodeItem } from '.';
import MonacoComponent from '@/components/monaco-editor';
import { Select, Input } from '@formily/antd-components';
import Service from './service';
import encodeQueryParam from '@/utils/encodeParam';
import { createLinkageUtils } from '@/utils/textUtils';

interface Props {
  data: Partial<NodeItem> | undefined;
  close: Function;
  save: Function;
}

const actions = createFormActions();

const Save: React.FC<Props> = props => {
  const { onFieldValueChange$ } = FormEffectHooks;
  const service = new Service('visualization-component');

  const effects = () => {
    const { setFieldState } = actions;
    const linkage = createLinkageUtils();
    onFieldValueChange$('type').subscribe(({ value }) => {
      setFieldState(`*(parentId,icon,data)`, state => {
        state.visible = value === 'node';
      });
      if (value === 'node') {
        service.query(encodeQueryParam({ terms: { type: 'dir' } })).subscribe(dir => {
          linkage.enum(
            'parentId',
            dir.data.map((item: any) => ({ label: item.name, value: item.id })),
          );
        });
      }
    });
  };
  return (
    <Modal
      title="保存组件"
      width="40vw"
      visible
      onOk={() => actions.submit()}
      onCancel={() => {
        props.close();
      }}
    >
      <SchemaForm
        effects={effects}
        onSubmit={data => props.save(data)}
        actions={actions}
        value={props.data}
        components={{ Input, Select, TextArea: Input.TextArea, MonacoComponent }}
        schema={{
          type: 'object',
          properties: {
            NO_NAME_FIELD_$0: {
              type: 'object',
              'x-component': 'mega-layout',
              'x-component-props': {
                grid: true,
                autoRow: true,
                responsive: {
                  lg: 3,
                  m: 2,
                  s: 1,
                },
              },
              properties: {
                type: {
                  'x-mega-props': {
                    span: 3,
                    labelCol: 3,
                  },
                  title: '类型',
                  enum: [
                    { label: '分类', value: 'dir' },
                    { label: '组件', value: 'node' },
                  ],
                  'x-component': 'select',
                  'x-rules': [
                    {
                      required: true,
                      message: '此字段必填',
                    },
                  ],
                },
                name: {
                  'x-mega-props': {
                    span: 3,
                    labelCol: 3,
                  },
                  title: '组件名称',
                  'x-component': 'input',
                  'x-rules': [
                    {
                      required: true,
                      message: '此字段必填',
                    },
                  ],
                },
                parentId: {
                  'x-mega-props': {
                    span: 3,
                    labelCol: 3,
                  },
                  title: '所属类别',
                  'x-component': 'select',
                  'x-rules': [
                    {
                      required: true,
                      message: '此字段必填',
                    },
                  ],
                  visible: false,
                },
                icon: {
                  'x-mega-props': {
                    span: 3,
                    labelCol: 3,
                  },
                  title: '组件图标',
                  'x-component': 'input',
                  'x-rules': [
                    {
                      required: true,
                      message: '此字段必填',
                    },
                  ],
                  visible: false,
                },
                data: {
                  'x-mega-props': {
                    span: 3,
                    labelCol: 3,
                  },
                  title: '其他配置',
                  'x-component': 'MonacoComponent',
                  'x-component-props': {
                    language: 'json',
                  },
                  visible: false,
                },
              },
            },
          },
        }}
      />
    </Modal>
  );
};
export default Save;
