import { createSchemaField } from '@formily/react';
import {
  ArrayCards,
  ArrayItems,
  DatePicker,
  Form,
  FormGrid,
  FormItem,
  Input,
  NumberPicker,
  Select,
  Space,
  Switch,
  TreeSelect,
} from '@formily/antd';
import { ISchema } from '@formily/json-schema';
import { createForm, onFieldValueChange } from '@formily/core';
import { forwardRef, useImperativeHandle, useMemo } from 'react';
import FTermArrayCards from '@/components/FTermArrayCards';
import FTermTypeSelect from '@/components/FTermTypeSelect';
import styles from './index.less';
import Service from '@/pages/rule-engine/Scene/service';
import { useAsyncDataSource } from '@/utils/util';
import { Store } from 'jetlinks-store';
import { treeFilter } from '@/utils/tree';

const service = new Service('scene');

interface Props {
  // 查询下拉框的参数
  params: Record<string, any>;
  value?: Record<string, any>;
  onChange?: (value: any) => void;
}

const TriggerTerm = (props: Props, ref: any) => {
  const form = useMemo(
    () =>
      createForm({
        validateFirst: true,
        initialValues: props.value,
        effects() {
          onFieldValueChange('trigger.*.terms.*.column', (field, form1) => {
            const operator = field.query('.termType');
            // 找到选中的
            const _data = Store.get('trigger-parse-term');
            // 树形搜索
            const treeValue = treeFilter(_data, field.value, 'column');
            // 找到
            const target =
              treeValue && treeValue[0].children
                ? treeValue[0]?.children.find((item) => item.column === field.value)
                : treeValue[0];

            form1.setFieldState(operator, (state) => {
              state.dataSource = target?.termTypes?.map((item: any) => ({
                label: item.name,
                value: item.id,
              }));
            });
            form1.setFieldState(field.query('.source'), (state) => {
              state.dataSource =
                target && target.metrics && target.metrics.length > 0
                  ? [
                      { label: '手动输入', value: 'manual' },
                      { label: '指标', value: 'metrics' },
                    ]
                  : [{ label: '手动输入', value: 'manual' }];
            });
          });
          onFieldValueChange('trigger.*.terms.*.source', (field, form1) => {
            const params = field.query('.column').value();
            const value = field.query('.value');
            // 找到选中的
            const _data = Store.get('trigger-parse-term');
            // 树形搜索
            const treeValue = treeFilter(_data, params, 'column');
            // 找到
            const target =
              treeValue && treeValue[0].children
                ? treeValue[0]?.children.find((item) => item.column === params)
                : treeValue[0];

            if (target) {
              if (field.value === 'manual') {
                // 手动输入
                const valueType = target.dataType;

                const valueTypeMap = {
                  int: NumberPicker,
                  float: NumberPicker,
                  double: NumberPicker,
                  long: NumberPicker,
                  string: Input,
                  date: DatePicker,
                  boolean: Switch,
                };

                form1.setFieldState(value, (state) => {
                  state.componentType = valueTypeMap[valueType];
                  if (valueType === 'date') {
                    state.componentProps = {
                      showTime: true,
                    };
                  }
                });
              } else if (field.value === 'metrics') {
                // 指标
                form1.setFieldState(value, (state) => {
                  state.componentType = Select;
                  state.dataSource = target?.metrics.map((item: any) => ({
                    label: item.name,
                    value: item.id,
                  }));
                });
              }
            }
          });
        },
      }),
    [props.value],
  );

  useImperativeHandle(ref, () => ({
    getTriggerForm: () => form.submit(),
  }));
  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Select,
      ArrayCards,
      FTermArrayCards,
      ArrayItems,
      Space,
      FormGrid,
      FTermTypeSelect,
      TreeSelect,
    },
  });

  const getParseTerm = () =>
    service.getParseTerm(props.params).then((data) => {
      Store.set('trigger-parse-term', data);
      return data.map((item: any) => ({
        column: item.column,
        name: item.name,
        children: item.children,
      }));
    });

  const schema: ISchema = {
    type: 'object',
    properties: {
      trigger: {
        type: 'array',
        'x-component': 'FTermArrayCards',
        'x-decorator': 'FormItem',
        'x-component-props': {
          title: '分组',
        },
        items: {
          type: 'object',
          properties: {
            index: {
              type: 'void',
              'x-component': 'FTermArrayCards.Index',
            },
            terms: {
              type: 'array',
              'x-component': 'ArrayItems',
              'x-decorator': 'FormItem',
              items: {
                type: 'object',
                properties: {
                  // 关联类型
                  type: {
                    type: 'string',
                    // "x-decorator": 'FormItem',
                    'x-component': 'FTermTypeSelect',
                  },
                  layout: {
                    type: 'void',
                    'x-component': 'FormGrid',
                    'x-decorator-props': {
                      maxColumns: 24,
                      minColumns: 24,
                    },
                    properties: {
                      // columns
                      column: {
                        type: 'string',
                        // title: '日期',
                        'x-decorator': 'FormItem',
                        'x-component': 'TreeSelect',
                        'x-decorator-props': {
                          gridSpan: 4,
                        },
                        'x-component-props': {
                          placeholder: '请选择参数',
                          fieldNames: { value: 'column', label: 'name', options: 'children' },
                        },
                        'x-reactions': '{{useAsyncDataSource(getParseTerm)}}',
                      },
                      termType: {
                        type: 'string',
                        // title: '输入框',
                        'x-decorator': 'FormItem',
                        'x-component': 'Select',
                        'x-decorator-props': {
                          gridSpan: 1,
                        },
                        'x-component-props': {
                          placeholder: '操作符',
                        },
                      },
                      source: {
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'Select',
                        'x-decorator-props': {
                          gridSpan: 1,
                        },
                      },
                      value: {
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'Input',
                        'x-component-props': {},
                        'x-decorator-props': {
                          gridSpan: 3,
                        },
                      },
                      remove: {
                        type: 'void',
                        'x-decorator': 'FormItem',
                        'x-component': 'ArrayItems.Remove',
                        'x-decorator-props': {
                          gridSpan: 1,
                        },
                      },
                    },
                  },
                },
              },
              properties: {
                add: {
                  type: 'void',
                  title: '添加条件',
                  'x-component': 'ArrayItems.Addition',
                },
              },
            },
            remove: {
              type: 'void',
              'x-component': 'FTermArrayCards.Remove',
            },
          },
        },
        properties: {
          addition: {
            type: 'void',
            title: '添加分组',
            'x-component': 'FTermArrayCards.Addition',
          },
        },
      },
    },
  };
  return (
    <Form form={form} layout="vertical" className={styles.form}>
      <SchemaField schema={schema} scope={{ useAsyncDataSource, getParseTerm }} />
    </Form>
  );
};

export default forwardRef(TriggerTerm);
