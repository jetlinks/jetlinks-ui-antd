import {
  FormItem,
  Input,
  ArrayTable,
  Editable,
  FormButtonGroup,
  Submit,
  Select,
  NumberPicker,
} from '@formily/antd';
import { createForm, Field, onFieldReact, FormPath } from '@formily/core';
import { FormProvider, createSchemaField } from '@formily/react';
import { Button, Badge } from 'antd';

const Render = (props: any) => <>{props.value}</>;
const ActionButton = () => {
  const record = ArrayTable.useRecord?.();
  const index = ArrayTable.useIndex?.();
  return (
    <Button
      onClick={() => {
        console.log(record(index));
      }}
    >
      启用
    </Button>
  );
};
const StatusRender = (props: any) => {
  switch (props.value?.value) {
    case 'enabled':
      return <Badge status="success" text={props.value?.text} />;
    case 'disabled':
      return <Badge status="error" text={props.value?.text} />;
    case 'connect':
      return <Badge status="success" text={props.value?.text} />;
    case 'disconnect':
      return <Badge status="warning" text={props.value?.text} />;
    default:
      return <></>;
  }
};

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Editable,
    Input,
    ArrayTable,
    Select,
    NumberPicker,
    Render,
    ActionButton,
    StatusRender,
  },
});

const form = createForm({
  initialValues: {
    array: [
      {
        // a2: '111',
        a1: 'wendu',
        // a3: '1111',
        id: '0718',
        state: {
          text: '正常',
          value: 'enabled',
        },
      },
      {
        // a2: '2',
        a1: 'sudu',
        // a3: '3',
        id: '0718-1',
        state: {
          text: '禁用',
          value: 'disabled',
        },
      },
    ],
  },
  effects: () => {
    onFieldReact('array.*.a2', (field, f) => {
      const value = (field as Field).value;
      const path = FormPath.transform(field.path, /\d+/, (index) => `array.${parseInt(index)}.a3`);
      console.log(value);
      f.setFieldState(path, (state) => {
        if (value) {
          state.required = true;
          form.validate();
        } else {
          state.required = false;
        }
      });
    });
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
            'x-component-props': { width: 120, title: '属性' },
            properties: {
              a1: {
                type: 'string',
                'x-component': 'Render',
              },
            },
          },
          column2: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': { width: 200, title: '通道' },
            properties: {
              a2: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  placeholder: '请选择',
                  showSearch: true,
                  allowClear: true,
                  showArrow: true,
                  filterOption: (input: string, option: any) =>
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0,
                  onBlur: () => {
                    const value = form.validate();
                    console.log(value.array?.value);
                  },
                },
                enum: [
                  {
                    label: '通道1',
                    value: 'channel1',
                  },
                  {
                    label: '通道2',
                    value: 'channel2',
                  },
                ],
              },
            },
          },
          column3: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': { width: 200, title: '数据点名称' },
            properties: {
              a3: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-validator': {
                  triggerType: 'onBlur',
                },
                'x-component-props': {
                  placeholder: '请选择',
                  showSearch: true,
                  allowClear: true,
                  showArrow: true,
                  filterOption: (input: string, option: any) =>
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0,
                },
                enum: [
                  {
                    label: '名称1',
                    value: 'name1',
                  },
                  {
                    label: '名称2',
                    value: 'name2',
                  },
                ],
              },
            },
          },
          column4: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': { width: 200, title: '数据点类型' },
            properties: {
              a4: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  placeholder: '请选择',
                  showSearch: true,
                  allowClear: true,
                  showArrow: true,
                  filterOption: (input: string, option: any) =>
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0,
                },
                enum: [
                  {
                    label: '类型1',
                    value: 'type1',
                  },
                  {
                    label: '类型2',
                    value: 'type2',
                  },
                ],
              },
            },
          },
          column5: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': { width: 200, title: '缩放因子' },
            properties: {
              a5: {
                type: 'string',
                default: 1,
                'x-decorator': 'FormItem',
                'x-component': 'NumberPicker',
                'x-component-props': {
                  min: 1,
                },
              },
            },
          },
          column6: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': { width: 200, title: '数据点说明' },
            properties: {
              a6: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'Render',
              },
            },
          },
          column7: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': {
              width: 200,
              title: '状态',
              sorter: (a: any, b: any) => a.state.value.length - b.state.value.length,
            },
            properties: {
              state: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'StatusRender',
              },
            },
          },
          column8: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': {
              title: '操作',
              dataIndex: 'operations',
              width: 100,
              fixed: 'right',
            },
            properties: {
              item: {
                type: 'void',
                'x-component': 'FormItem',
                properties: {
                  remove: {
                    type: 'void',
                    'x-component': 'ActionButton',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export default () => {
  return (
    <FormProvider form={form}>
      <SchemaField schema={schema} />
      <FormButtonGroup>
        <Submit onSubmit={console.log}>提交</Submit>
      </FormButtonGroup>
    </FormProvider>
  );
};
