import { message, Modal } from 'antd';
import {
  ArrayItems,
  Checkbox,
  DatePicker,
  Form,
  FormGrid,
  FormItem,
  Input,
  NumberPicker,
  Select,
} from '@formily/antd';
import { createForm, onFieldReact } from '@formily/core';
import { createSchemaField } from '@formily/react';
import type { PropertyMetadata } from '@/pages/device/Product/typings';
import { useEffect, useState } from 'react';
import { InstanceModel, service } from '@/pages/device/Instance';
interface Props {
  data: Partial<PropertyMetadata>;
  onCancel: () => void;
}

const componentMap = {
  int: 'NumberPicker',
  long: 'NumberPicker',
  float: 'NumberPicker',
  double: 'NumberPicker',
  number: 'NumberPicker',
  date: 'DatePicker',
  boolean: 'Select',
};

const Indicators = (props: Props) => {
  const { data } = props;

  const [metrics, setMetrics] = useState<any[]>(data.expands?.metrics || []);

  const form = createForm({
    validateFirst: true,
    initialValues: {
      metrics: metrics,
    },
    effects: () => {
      onFieldReact('metrics.*.*', (field, form1) => {
        const type = data.valueType?.type;
        form1.setFieldState('metrics.*.space.value.*', (state) => {
          state.componentType = componentMap[type || ''] || 'Input';
          if (type === 'date') {
            state.componentProps = {
              showTime: true,
            };
          } else if (type === 'boolean') {
            state.componentType = 'Select';
            state.dataSource = [
              {
                label: data.valueType?.trueText,
                value: String(data.valueType?.trueValue),
              },
              {
                label: data.valueType?.falseText,
                value: String(data.valueType?.falseValue),
              },
            ];
          }
        });
      });
    },
  });

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Checkbox,
      Select,
      DatePicker,
      ArrayItems,
      NumberPicker,
      FormGrid,
    },
  });

  const schema = {
    type: 'object',
    properties: {
      metrics: {
        type: 'array',
        'x-component': 'ArrayItems',
        'x-decorator': 'FormItem',
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              title: '',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-hidden': true,
            },
            space: {
              type: 'void',
              title: '指标值',
              'x-decorator': 'FormItem',
              'x-component': 'FormGrid',
              'x-decorator-props': {
                labelAlign: 'left',
                layout: 'vertical',
              },
              'x-component-props': {
                maxColumns: 12,
                minColumns: 12,
              },
              'x-reactions': [
                {
                  dependencies: ['.name'],
                  fulfill: {
                    state: {
                      title: '{{$deps[0]}}',
                    },
                  },
                },
              ],
              properties: {
                'value[0]': {
                  'x-decorator': 'FormItem',
                  'x-component': componentMap[data.valueType?.type || ''] || 'Input',
                  'x-reactions': [
                    {
                      dependencies: ['..range', data.valueType?.type],
                      fulfill: {
                        state: {
                          decoratorProps: {
                            gridSpan: '{{!!$deps[0]?5:$deps[1]==="boolean"?12:10}}',
                          },
                        },
                      },
                    },
                  ],
                  'x-decorator-props': {
                    gridSpan: 5,
                  },
                },
                'value[1]': {
                  title: '~',
                  'x-decorator': 'FormItem',
                  'x-component': componentMap[data.valueType?.type || ''] || 'Input',
                  'x-reactions': [
                    {
                      dependencies: ['..range'],
                      fulfill: {
                        state: {
                          visible: '{{!!$deps[0]}}',
                        },
                      },
                    },
                  ],
                  'x-decorator-props': {
                    gridSpan: 5,
                  },
                },
                range: {
                  type: 'boolean',
                  title: '',
                  'x-decorator': 'FormItem',
                  'x-component': 'Checkbox',
                  'x-hidden': true,
                },
              },
            },
          },
        },
      },
    },
  };

  useEffect(() => {
    if (InstanceModel.detail.id && data.id) {
      service.queryMetric(InstanceModel.detail.id || '', data.id || '').then((resp) => {
        if (resp.status === 200) {
          if ((resp?.result || []).length > 0) {
            const list = resp.result.map((item: any) => {
              return {
                ...item,
                value: item.value.split(','),
              };
            });
            setMetrics(list);
          } else {
            const type = data.valueType?.type;
            if (type === 'boolean') {
              const list = data.expands?.metrics.map((item: any) => {
                const value = (item?.value || {}).map((i: any) => String(i)) || {};
                return {
                  ...item,
                  value,
                };
              });
              setMetrics(list || []);
            } else {
              setMetrics(data.expands?.metrics || []);
            }
          }
        }
      });
    }
  }, [data.id]);

  return (
    <Modal
      maskClosable={false}
      title="编辑指标"
      visible
      width={600}
      onOk={async () => {
        const params = (await form.submit()) as any;
        const list = (params?.metrics || []).map((item: any) => {
          return {
            ...item,
            value: item.value.join(','),
          };
        });
        const resp = await service.saveMetric(InstanceModel.detail.id || '', data.id || '', list);
        if (resp.status === 200) {
          message.success('操作成功！');
          props.onCancel();
        }
      }}
      onCancel={() => {
        props.onCancel();
      }}
    >
      <div
        style={{
          width: '100%',
          height: 40,
          lineHeight: '40px',
          color: 'rgba(0, 0, 0, 0.55)',
          backgroundColor: '#f6f6f6',
          paddingLeft: 10,
        }}
      >
        场景联动页面可引用指标配置触发条件
      </div>
      <div style={{ marginTop: '30px' }}>
        <Form form={form} layout="vertical">
          <SchemaField schema={schema} />
        </Form>
      </div>
    </Modal>
  );
};

export default Indicators;
