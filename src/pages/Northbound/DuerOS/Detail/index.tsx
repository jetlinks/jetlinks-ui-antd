import { PageContainer } from '@ant-design/pro-layout';
import { createSchemaField } from '@formily/react';
import { ISchema } from '@formily/json-schema';
import { Card, Col, Row } from 'antd';
import {
  ArrayCollapse,
  Form,
  FormButtonGroup,
  FormGrid,
  FormItem,
  Input,
  Select,
} from '@formily/antd';
import { PermissionButton } from '@/components';
import { useMemo } from 'react';
import { createForm, Field, onFieldInit } from '@formily/core';
import { useAsyncDataSource } from '@/utils/util';
import { service } from '..';
import { Store } from 'jetlinks-store';

const Save = () => {
  const SchemaField = createSchemaField({
    components: {
      FormGrid,
      FormItem,
      Input,
      Select,
      ArrayCollapse,
    },
  });

  const getProduct = () => service.getProduct().then((resp) => resp.result);

  const getTypes = () =>
    service.getTypes().then((resp) => {
      Store.set('product-types', resp.result);
      return resp.result;
    });

  const schema: ISchema = {
    type: 'object',
    properties: {
      name: {
        title: '名称',
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-decorator-props': {
          gridSpan: 1,
        },
        required: true,
        'x-component-props': {
          placeholder: '请输入名称',
        },
        name: 'name',
      },
      layout: {
        type: 'void',
        'x-decorator': 'FormGrid',
        'x-decorator-props': {
          maxColumns: 2,
          minColumns: 2,
          columnGap: 24,
        },
        properties: {
          product: {
            title: '产品',
            'x-decorator-props': {
              gridSpan: 1,
            },
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
              placeholder: '请选择产品',
              fieldNames: {
                label: 'name',
                value: 'id',
              },
            },
            'x-reactions': '{{useAsyncDataSource(getProduct)}}',
            required: true,
          },
          deviceType: {
            title: '设备类型',
            'x-decorator-props': {
              gridSpan: 1,
            },
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
              placeholder: '请选择产品',
              fieldNames: {
                label: 'name',
                value: 'id',
              },
            },
            'x-reactions': '{{useAsyncDataSource(getTypes)}}',
            required: true,
          },
        },
      },
      actionMappings: {
        type: 'array',
        title: '动作映射',
        'x-component': 'ArrayCollapse',
        'x-decorator': 'FormItem',
        items: {
          type: 'object',
          'x-component': 'ArrayCollapse.CollapsePanel',
          'x-component-props': {
            header: '动作',
          },
          properties: {
            index: {
              type: 'void',
              'x-component': 'ArrayCollapse.Index',
            },
            layout: {
              type: 'void',
              'x-decorator': 'FormGrid',
              'x-decorator-props': {
                maxColumns: 2,
                minColumns: 2,
                columnGap: 24,
              },
              properties: {
                action: {
                  title: '动作',
                  'x-component': 'Select',
                  'x-decorator': 'FormItem',
                  'x-decorator-props': {
                    layout: 'vertical',
                    labelAlign: 'left',
                  },
                  required: true,
                  'x-component-props': {
                    fieldNames: {
                      label: 'name',
                      value: 'id',
                    },
                  },
                },
                actionType: {
                  title: '操作',
                  'x-component': 'Select',
                  'x-decorator': 'FormItem',
                  'x-decorator-props': {
                    layout: 'vertical',
                    labelAlign: 'left',
                  },
                  enum: [
                    { label: '下发指令', value: 'command' },
                    { label: '获取历史数据', value: 'latestData' },
                  ],
                },
                command: {
                  type: 'object',
                  properties: {
                    messageType: {
                      type: 'string',
                      title: '指令类型',
                      'x-decorator-props': {
                        layout: 'vertical',
                        labelAlign: 'left',
                        gridSpan: 2,
                      },
                      'x-component': 'Select',
                      'x-decorator': 'FormItem',
                      enum: [
                        { label: '读取属性', value: 'READ_PROPERTY' },
                        { label: '修改属性', value: 'WRITE_PROPERTY' },
                        { label: '调用功能', value: 'INVOKE_FUNCTION' },
                      ],
                      'x-reactions': {
                        dependencies: ['..actionType'],
                        fulfill: {
                          state: {
                            visible: '{{$deps[0]==="command"}}',
                          },
                        },
                      },
                    },
                    message: {
                      type: 'object',
                      properties: {
                        properties: {
                          title: '属性',
                          'x-component': 'Select',
                          'x-decorator': 'FormItem',
                          'x-decorator-props': {
                            layout: 'vertical',
                            labelAlign: 'left',
                          },
                          'x-reactions': [
                            {
                              dependencies: ['..messageType'],
                              fulfill: {
                                state: {
                                  visible:
                                    '{{["READ_PROPERTY","WRITE_PROPERTY"].includes($deps[0])}}',
                                },
                              },
                            },
                            {
                              dependencies: ['..messageType'],
                              fulfill: {
                                state: {
                                  decoratorProps: {
                                    gridSpan: '{{$deps[0]==="READ_PROPERTY"?2:1}}',
                                  },
                                },
                              },
                            },
                          ],
                        },
                        value: {
                          title: '值',
                          'x-component': 'Input',
                          'x-decorator': 'FormItem',
                          'x-decorator-props': {
                            layout: 'vertical',
                            labelAlign: 'left',
                          },
                          'x-reactions': {
                            dependencies: ['..messageType'],
                            fulfill: {
                              state: {
                                visible: '{{["WRITE_PROPERTY"].includes($deps[0])}}',
                              },
                            },
                          },
                        },
                        function: {
                          title: '参数列表',
                          'x-component': 'Input',
                          'x-decorator': 'FormItem',
                          'x-decorator-props': {
                            layout: 'vertical',
                            labelAlign: 'left',
                          },
                          'x-reactions': {
                            dependencies: ['..messageType'],
                            fulfill: {
                              state: {
                                visible: '{{["INVOKE_FUNCTION"].includes($deps[0])}}',
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            remove: {
              type: 'void',
              'x-component': 'ArrayCollapse.Remove',
            },
          },
        },
        properties: {
          addition: {
            type: 'void',
            title: '新增动作',
            'x-component': 'ArrayCollapse.Addition',
          },
        },
      },
      propertyMappings: {
        title: '属性映射',
        type: 'array',
        'x-component': 'ArrayCollapse',
        'x-decorator': 'FormItem',
        items: {
          type: 'void',
          'x-component': 'ArrayCollapse.CollapsePanel',
          'x-component-props': {
            header: '动作',
          },
          properties: {
            index: {
              type: 'void',
              'x-component': 'ArrayCollapse.Index',
            },
            source: {
              title: 'DuerOS属性',
              'x-component': 'Select',
              'x-decorator': 'FormItem',
            },
            target: {
              title: '平台属性',
              'x-component': 'Select',
              'x-decorator': 'FormItem',
            },
            remove: {
              type: 'void',
              'x-component': 'ArrayCollapse.Remove',
            },
          },
        },
        properties: {
          addition: {
            type: 'void',
            title: '新增属性',
            'x-component': 'ArrayCollapse.Addition',
          },
        },
      },
    },
  };

  const handleSave = () => {};

  const form = useMemo(
    () =>
      createForm({
        validateFirst: true,
        effects() {
          onFieldInit('actionMappings.*.layout.action', (field) => {
            const productType = field.query('deviceType').value();
            if (!productType) return;
            const _productTypes = Store.get('product-types');
            const _type = _productTypes.find((item: any) => item.id === productType);
            (field as Field).setDataSource(_type.actions);
          });
        },
      }),
    [],
  );
  return (
    <PageContainer>
      <Card>
        <Row>
          <Col span={10}>
            <Form layout="vertical" form={form}>
              <SchemaField schema={schema} scope={{ useAsyncDataSource, getTypes, getProduct }} />
              <FormButtonGroup.Sticky>
                <FormButtonGroup.FormItem>
                  <PermissionButton type="primary" onClick={handleSave}>
                    保存
                  </PermissionButton>
                </FormButtonGroup.FormItem>
              </FormButtonGroup.Sticky>
            </Form>
          </Col>
          <Col span={12} push={2}></Col>
        </Row>
      </Card>
    </PageContainer>
  );
};

export default Save;
