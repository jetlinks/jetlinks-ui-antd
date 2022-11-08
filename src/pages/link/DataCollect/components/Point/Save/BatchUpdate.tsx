import { Button, Modal } from 'antd';
import { FormItem, Input, ArrayTable, Editable, NumberPicker } from '@formily/antd';
import MyInput from './components/MyInput';
import MySelect from './components/MySelect';
import { createForm, registerValidateRules } from '@formily/core';
import { FormProvider, createSchemaField } from '@formily/react';
import { useEffect } from 'react';

interface Props {
  data?: any[];
  close: () => void;
  reload: () => void;
}

export default (props: Props) => {
  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Editable,
      Input,
      ArrayTable,
      NumberPicker,
      MyInput,
      MySelect,
    },
  });

  const form = createForm({
    initialValues: { array: [] },
  });

  registerValidateRules({
    checkLength(value) {
      if (String(value).length > 64) {
        return {
          type: 'error',
          message: '最多可输入64个字符',
        };
      }
      if (!(value % 1 === 0)) {
        return {
          type: 'error',
          message: '请输入非0正整数',
        };
      }
      return '';
    },
  });

  const schema = {
    type: 'object',
    properties: {
      array: {
        type: 'array',
        'x-decorator': 'FormItem',
        'x-component': 'ArrayTable',
        'x-component-props': {
          pagination: { pageSize: 10 },
          scroll: { x: '100%' },
        },
        items: {
          type: 'object',
          properties: {
            column1: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': { title: '名称' },
              properties: {
                name: {
                  type: 'string',
                  'x-component': 'Input',
                  'x-component-props': {
                    placeholder: '请输入点位名称',
                  },
                  'x-validator': [
                    {
                      required: true,
                      message: '请输入点位名称',
                    },
                    {
                      max: 64,
                      message: '最多可输入64个字符',
                    },
                  ],
                },
              },
            },
            column2: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': { title: 'nodeId', width: 150 },
              properties: {
                'configuration.nodeId': {
                  type: 'string',
                  'x-component': 'Input',
                  'x-component-props': {
                    readOnly: true,
                  },
                },
              },
            },
            column3: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': { title: '访问类型', width: 200 },
              properties: {
                accessModes: {
                  type: 'string',
                  'x-component': 'MySelect',
                  'x-component-props': {
                    placeholder: '请选择访问类型',
                    mode: 'multiple',
                    options: [
                      { label: '读', value: 'read' },
                      { label: '写', value: 'write' },
                      { label: '订阅', value: 'subscribe' },
                    ],
                  },
                  'x-validator': [
                    {
                      required: true,
                      message: '请选择访问类型',
                    },
                  ],
                },
              },
            },
            column4: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': { title: '采集频率' },
              properties: {
                'configuration.interval': {
                  type: 'string',
                  'x-decorator': 'FormItem',
                  'x-component': 'MyInput',
                  'x-component-props': {
                    placeholder: '请输入采集频率',
                  },
                  'x-validator': [
                    {
                      required: true,
                      message: '请输入采集频率',
                    },
                    {
                      checkLength: true,
                    },
                  ],
                },
              },
            },
            column5: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': { width: 210, title: '只推送变化的数据' },
              properties: {
                features: {
                  type: 'array',
                  'x-decorator': 'FormItem',
                  'x-component': 'MySelect',
                  'x-component-props': {
                    options: [
                      {
                        label: '是',
                        value: true,
                      },
                      {
                        label: '否',
                        value: false,
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  useEffect(() => {
    form.setValues({
      array: (props?.data || []).map((item) => {
        return {
          ...item,
          features: item.features.includes('changedOnly'),
        };
      }),
    });
  }, [props.data]);

  return (
    <Modal
      title={'批量编辑'}
      maskClosable={false}
      visible
      onCancel={props.close}
      width={1200}
      footer={[
        <Button key={1} onClick={props.close}>
          取消
        </Button>,
        <Button type="primary" key={2} onClick={() => {}}>
          确定
        </Button>,
      ]}
    >
      <FormProvider form={form}>
        <SchemaField schema={schema} />
      </FormProvider>
    </Modal>
  );
};
