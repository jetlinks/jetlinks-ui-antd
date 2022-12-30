import { Button, Drawer, message } from 'antd';
import { createSchemaField, observer } from '@formily/react';
import MetadataModel from '../model';
import { Field, IFieldState } from '@formily/core';
import {
  createForm,
  onFieldInit,
  onFieldReact,
  onFieldValueChange,
  registerValidateRules,
} from '@formily/core';
import {
  ArrayItems,
  Checkbox,
  DatePicker,
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  NumberPicker,
  Radio,
  Select,
  Space,
} from '@formily/antd';
import type { ISchema } from '@formily/json-schema';
import {
  DataTypeList,
  DateTypeList,
  EventLevel,
  FileTypeList,
  PropertySource,
} from '@/pages/device/data';
import { useMemo, useState } from 'react';
import { productModel } from '@/pages/device/Product';
import { service } from '@/pages/device/components/Metadata';
import { Store } from 'jetlinks-store';
import type { MetadataItem } from '@/pages/device/Product/typings';
import JsonParam from '@/components/Metadata/JsonParam';
import ArrayParam from '@/components/Metadata/ArrayParam';
import EnumParam from '@/components/Metadata/EnumParam';
import BooleanEnum from '@/components/Metadata/BooleanParam';
import ConfigParam from '@/components/Metadata/ConfigParam';
import { useIntl } from '@@/plugin-locale/localeExports';
import { lastValueFrom } from 'rxjs';
import SystemConst from '@/utils/const';
import DB from '@/db';
import _ from 'lodash';
import { InstanceModel } from '@/pages/device/Instance';
import FRuleEditor from '@/components/FRuleEditor';
import FIndicators from '@/components/FIndicators';
import { action } from '@formily/reactive';
import { asyncUpdateMedata, updateMetadata } from '../../metadata';
import { onlyMessage } from '@/utils/util';
import Editable from '@/components/Metadata/EditTable';

interface Props {
  type: 'product' | 'device';
  tabs?: string;
}

const Edit = observer((props: Props) => {
  const intl = useIntl();
  const [loading, setLoading] = useState<boolean>(false);
  const form = useMemo(
    () =>
      createForm({
        initialValues: _.cloneDeep(MetadataModel.item as Record<string, unknown>),
        effects: () => {
          onFieldValueChange('valueType.type', (field, form1) => {
            if (field.modified) {
              form1.setFieldState('expands.metrics', (state) => {
                state.value = [];
              });
            }
          });
          onFieldInit('expands.metrics.*.id', (field) => {
            const id = field as Field;
            if (id.value && !id.modified) {
              (field as any).disabled = true;
            }
          });
          onFieldReact('expands.virtualRule.windowType', (field, form1) => {
            // console.log(field.value,111111111)
            const value = (field as Field).value;
            if (value) {
              form1.setFieldState('expands.virtualRule.type', (state) => {
                state.value = 'window';
              });
            }
          });
          onFieldReact('expands.metrics.*.*', (field, form1) => {
            const type = field.query('valueType.type').take() as Field;
            const componentMap = {
              int: 'NumberPicker',
              long: 'NumberPicker',
              float: 'NumberPicker',
              double: 'NumberPicker',
              number: 'NumberPicker',
              date: 'DatePicker',
              boolean: 'Select',
            };

            form1.setFieldState('expands.metrics.*.edit.space.value.*', (state) => {
              state.componentType = componentMap[type.value] || 'Input';
              if (type.value === 'date') {
                state.componentProps = {
                  showTime: true,
                };
              } else if (type.value === 'boolean') {
                state.componentType = 'Select';
                // 获取 boolean配置的值
                const values = form1.getValuesIn('valueType');
                state.dataSource = [
                  { label: values.trueText, value: values.trueValue },
                  { label: values.falseText, value: values.falseValue },
                ];
              }
            });
          });
        },
      }),
    [MetadataModel.edit],
  );

  const schemaTitleMapping = {
    properties: {
      title: intl.formatMessage({
        id: 'pages.device.productDetail.metadata.dataType',
        defaultMessage: '数据类型',
      }),
    },
    events: {
      title: intl.formatMessage({
        id: 'pages.device.productDetail.metadata.outputParameters',
        defaultMessage: '输出参数',
      }),
    },
    functions: {
      title: intl.formatMessage({
        id: 'pages.device.productDetail.metadata.outputParameters',
        defaultMessage: '输出参数',
      }),
    },
    tags: {
      title: intl.formatMessage({
        id: 'pages.device.productDetail.metadata.dataType',
        defaultMessage: '数据类型',
      }),
    },
  };

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Select,
      NumberPicker,
      Radio,
      Editable,
      ArrayItems,
      Space,
      FormLayout,
      JsonParam,
      ArrayParam,
      EnumParam,
      BooleanEnum,
      ConfigParam,
      FRuleEditor,
      Checkbox,
      FormGrid,
      DatePicker,
      FIndicators,
    },
    scope: {
      async asyncOtherConfig(field: Field) {
        const typeField = field.query('..valueType.type').take() as IFieldState;
        const idField = field.query('..id').take() as IFieldState;
        if (!typeField || !idField) return;
        const type = typeField.value;
        const id = idField.value;
        // 获取配置
        const productId = productModel.current?.id;
        if (!productId || !id || !type) return;
        const config = (await lastValueFrom(
          service.getMetadataConfig({
            deviceId: productId,
            metadata: {
              id,
              type: 'property',
              dataType: type,
            },
          }),
        )) as unknown[];
        field.setState({
          visible: config.length > 0,
        });
        field.setComponentProps({
          config,
        });
      },
    },
  });

  registerValidateRules({
    validateId(value) {
      if (!value) return '';
      const reg = new RegExp('^[0-9a-zA-Z_\\\\-]+$');
      return reg.exec(value) ? '' : 'ID只能由数字、字母、下划线、中划线组成';
    },
  });
  const valueTypeConfig = {
    type: 'object',
    'x-index': 4,
    properties: {
      type: {
        title: schemaTitleMapping[MetadataModel.type].title,
        'x-validator':
          MetadataModel.type !== 'functions'
            ? [
                {
                  required: true,
                  message: `请选择${schemaTitleMapping[MetadataModel.type].title}`,
                },
              ]
            : [],
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        default: MetadataModel.type === 'events' ? 'object' : null,
        enum:
          MetadataModel.type === 'events'
            ? [
                {
                  value: 'object',
                  label: 'object(结构体)',
                },
              ]
            : MetadataModel.type === 'functions'
            ? DataTypeList.filter((item) => item.value !== 'file')
            : MetadataModel.type === 'tags'
            ? DataTypeList.filter((item) => item.value !== 'file' && item.value !== 'password')
            : DataTypeList,
      },
      unit: {
        title: intl.formatMessage({
          id: 'pages.device.instanceDetail.metadata.unit',
          defaultMessage: '单位',
        }),
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-visible': false,
        'x-component-props': {
          showSearch: true,
          showArrow: true,
          allowClear: true,
          filterOption: (input: string, option: any) =>
            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0,
        },
        'x-reactions': [
          {
            dependencies: ['.type'],
            fulfill: {
              state: {
                visible: "{{['int','float','long','double'].includes($deps[0])}}",
              },
            },
          },
          '{{useAsyncDataSource(getUnit)}}',
        ],
      },
      scale: {
        title: intl.formatMessage({
          id: 'pages.device.productDetail.metadata.accuracy',
          defaultMessage: '精度',
        }),
        'x-decorator': 'FormItem',
        'x-component': 'NumberPicker',
        default: 2,
        'x-validator': [
          {
            format: 'integer',
            message: '请输入0-2147483647之间的正整数',
          },
          {
            max: 2147483647,
            message: '请输入0-2147483647之间的正整数',
          },
          {
            min: 0,
            message: '请输入0-2147483647之间的正整数',
          },
        ],
        'x-reactions': {
          dependencies: ['.type'],
          fulfill: {
            state: {
              visible: "{{['float','double'].includes($deps[0])}}",
            },
          },
        },
      },
      booleanConfig: {
        title: intl.formatMessage({
          id: 'pages.device.productDetail.metadata.boolean',
          defaultMessage: '布尔值',
        }),
        type: 'void',
        'x-decorator': 'FormItem',
        'x-component': 'BooleanEnum',
        'x-reactions': {
          dependencies: ['.type'],
          fulfill: {
            state: {
              visible: "{{['boolean'].includes($deps[0])}}",
            },
          },
        },
      },
      format: {
        title: intl.formatMessage({
          id: 'pages.device.productDetail.metadata.timeFormat',
          defaultMessage: '时间格式',
        }),
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        enum: DateTypeList,
        default: 'string',
        'x-validator': [
          {
            required: true,
            message: '请选择时间格式',
          },
        ],
        'x-reactions': {
          dependencies: ['.type'],
          fulfill: {
            state: {
              visible: "{{['date'].includes($deps[0])}}",
            },
          },
        },
      },
      enumConfig: {
        title: intl.formatMessage({
          id: 'pages.device.productDetail.metadata.enum',
          defaultMessage: '枚举项',
        }),
        type: 'void',
        'x-decorator': 'FormItem',
        'x-component': 'EnumParam',
        'x-reactions': {
          dependencies: ['.type'],
          fulfill: {
            state: {
              visible: "{{['enum'].includes($deps[0])}}",
            },
          },
        },
      },
      expands: {
        type: 'object',
        properties: {
          maxLength: {
            title: intl.formatMessage({
              id: 'pages.device.productDetail.metadata.maxLength',
              defaultMessage: '最大长度',
            }),
            'x-decorator': 'FormItem',
            'x-component': 'NumberPicker',
            'x-decorator-props': {
              tooltip: intl.formatMessage({
                id: 'pages.device.productDetail.metadata.maxLength.byte',
                defaultMessage: '字节',
              }),
            },
            'x-component-props': {
              min: 1,
            },
            'x-validator': [
              {
                format: 'integer',
                message: '请输入1-2147483647之间的正整数',
              },
              {
                max: 2147483647,
                message: '请输入1-2147483647之间的正整数',
              },
              {
                min: 1,
                message: '请输入1-2147483647之间的正整数',
              },
            ],
            'x-reactions': {
              dependencies: ['..type'],
              fulfill: {
                state: {
                  visible: "{{['string','password'].includes($deps[0])}}",
                },
              },
            },
          },
        },
      },
      elementType: {
        title: intl.formatMessage({
          id: 'pages.device.productDetail.metadata.elementConfiguration',
          defaultMessage: '元素配置',
        }),
        'x-decorator': 'FormItem',
        'x-component': 'ArrayParam',
        'x-reactions': {
          dependencies: ['.type'],
          fulfill: {
            state: {
              visible: "{{['array'].includes($deps[0])}}",
            },
          },
        },
        'x-validator': [
          {
            triggerType: 'onBlur',
            validator: (value: any[]) => {
              return new Promise((resolve) => {
                if (!!value) {
                  resolve('');
                } else {
                  resolve('请输入配置元素');
                }
              });
            },
          },
        ],
      },
      jsonConfig: {
        title: intl.formatMessage({
          id: 'pages.device.productDetail.metadata.jsonObject',
          defaultMessage: 'JSON对象',
        }),
        type: 'void',
        'x-decorator': 'FormItem',
        'x-component': 'JsonParam',
        'x-reactions': {
          dependencies: ['.type'],
          fulfill: {
            state: {
              visible: "{{['object'].includes($deps[0])}}",
            },
          },
        },
      },
      fileType: {
        title: intl.formatMessage({
          id: 'pages.device.productDetail.metadata.fileType',
          defaultMessage: '文件类型',
        }),
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-visible': false,
        enum: FileTypeList,
        default: 'url',
        'x-validator': [
          {
            required: true,
            message: '请选择文件类型',
          },
        ],
        'x-reactions': {
          dependencies: ['.type'],
          fulfill: {
            state: {
              visible: "{{['file'].includes($deps[0])}}",
            },
          },
        },
      },
    },
  } as any;
  const commonConfig = {
    id: {
      title: intl.formatMessage({
        id: 'pages.device.productDetail.metadata.key',
        defaultMessage: '标识',
      }),
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-disabled': MetadataModel.action === 'edit',
      'x-index': 0,
      'x-validator': [
        {
          max: 64,
          message: '最多可输入64个字符',
        },
        {
          required: true,
          message: '请输入标识',
        },
        {
          validateId: true,
          message: 'ID只能由数字、26个英文字母或者下划线组成',
        },
      ],
    },
    name: {
      title: intl.formatMessage({
        id: 'pages.table.name',
        defaultMessage: '名称',
      }),
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-index': 1,
      'x-validator': [
        {
          max: 64,
          message: '最多可输入64个字符',
        },
        {
          required: true,
          message: '请输入名称',
        },
      ],
    },
    description: {
      title: intl.formatMessage({
        id: 'pages.device.productDetail.metadata.describe',
        defaultMessage: '描述',
      }),
      'x-decorator': 'FormItem',
      'x-component': 'Input.TextArea',
      'x-index': 100,
      'x-validator': [
        {
          max: 200,
          message: '最多可输入200个字符',
        },
      ],
    },
  } as any;
  const propertySchema: ISchema = {
    type: 'object',
    properties: {
      ...commonConfig,
      valueType: valueTypeConfig,
      expands: {
        'x-index': 5,
        type: 'object',
        properties: {
          source: {
            title: intl.formatMessage({
              id: 'pages.device.productDetail.metadata.source',
              defaultMessage: '来源',
            }),
            'x-disabled': MetadataModel.action === 'edit',
            'x-validator': [
              {
                required: true,
                message: `请选择来源`,
              },
            ],
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            enum: PropertySource,
            'x-visible': props.type === 'product',
          },
          'virtualRule.type': {
            type: 'string',
            'x-value': 'script',
            'x-component': 'Input',
            'x-decorator': 'FormItem',
            'x-hidden': true,
            // 'x-reactions': {
            //   dependencies: ['..virtualRule.windowType'],
            //   fulfill: {
            //     state: {
            //       value: "{{ $self.value?'window':'script'}}",
            //     },
            //   },
            // },
          },
          'virtualRule.script': {
            type: 'string',
            'x-component': 'FRuleEditor',
            'x-component-props': {
              id: (MetadataModel.item as any)?.id,
            },
            'x-visible': false,
            'x-reactions': [
              {
                dependencies: ['..source', 'id', '..virtualRule'],
                fulfill: {
                  state: {
                    visible: '{{$deps[0]==="rule"}}',
                    componentProps: {
                      id: '{{$deps[1]}}',
                    },
                  },
                  schema: {
                    'x-component-props.property': '{{$deps[1]}}',
                    'x-component-props.virtualRule': '{{$deps[2]}}',
                  },
                },
              },
            ],
          },
          virtualRule: {
            type: 'object',
            title: '规则配置',
            'x-visible': false,
            'x-component': 'Editable.Popover',
            'x-reactions': {
              dependencies: ['.source'],
              fulfill: {
                state: {
                  visible: '{{$deps[0]==="rule"}}',
                },
              },
            },
            properties: {
              // script: {
              //   type: 'string',
              //   'x-component': 'FRuleEditor',
              //   'x-visible': false,
              //   'x-reactions': [
              //     {
              //       dependencies: ['..source', '..id'],
              //       fulfill: {
              //         state: {
              //           visible: '{{$deps[0]==="rule"}}',
              //         },
              //         schema: {
              //           'x-component-props.property': '{{$deps[1]}}',
              //         },
              //       },
              //     },
              //   ],
              // },

              windowType: {
                type: 'string',
                title: '窗口',
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                enum: [
                  { label: '时间窗口', value: 'time' },
                  { label: '次数窗口', value: 'num' },
                ],
                'x-component-props': {
                  allowClear: true,
                },
              },
              type: {
                type: 'string',
                'x-visible': false,
                'x-reactions': {
                  dependencies: ['.windowType'],
                  when: '{{$deps[0]}}',
                  fulfill: {
                    state: {
                      value: 'window',
                    },
                  },
                },
              },
              aggType: {
                type: 'string',
                title: '聚合函数',
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-reactions': '{{useAsyncDataSource(getStreamingAggType)}}',
              },
              window: {
                type: 'object',
                properties: {
                  span: {
                    title: '窗口长度',
                    'x-component': 'Input',
                    'x-decorator': 'FormItem',
                    'x-reactions': [
                      {
                        dependencies: ['..windowType'],
                        when: '{{$deps[0]==="time"}}',
                        fulfill: {
                          state: {
                            title: '窗口长度（秒）',
                          },
                        },
                      },
                      {
                        dependencies: ['..windowType'],
                        when: '{{$deps[0]==="num"}}',
                        fulfill: {
                          state: {
                            title: '窗口长度（次）',
                          },
                        },
                      },
                      {
                        dependencies: ['..windowType'],
                        when: '{{!$deps[0]}}',
                        fulfill: {
                          state: {
                            title: '窗口长度',
                          },
                        },
                      },
                    ],
                  },
                  every: {
                    title: '步长',
                    'x-component': 'Input',
                    'x-decorator': 'FormItem',
                    'x-reactions': [
                      {
                        dependencies: ['..windowType'],
                        when: '{{$deps[0]==="time"}}',
                        fulfill: {
                          state: {
                            title: '步长（秒）',
                          },
                        },
                      },
                      {
                        dependencies: ['..windowType'],
                        when: '{{$deps[0]==="num"}}',
                        fulfill: {
                          state: {
                            title: '步长（次）',
                          },
                        },
                      },
                      {
                        dependencies: ['..windowType'],
                        when: '{{!$deps[0]}}',
                        fulfill: {
                          state: {
                            title: '步长',
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
          type: {
            title: MetadataModel.type === 'tags' ? '标签类型' : '读写类型',
            'x-validator': [
              {
                required: true,
                message: `请输入${MetadataModel.type === 'tags' ? '标签类型' : '读写类型'}`,
              },
            ],
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
              mode: 'multiple',
            },
            enum: [
              {
                label: '读',
                value: 'read',
              },
              {
                label: '写',
                value: 'write',
              },
              {
                label: '上报',
                value: 'report',
              },
            ],
            'x-reactions': [
              {
                dependencies: ['.source'],
                fulfill: {
                  state: {
                    value:
                      '{{$deps[0]==="manual" ? ["write"] : $deps[0]==="rule" ? ["report"] : []}}',
                    disabled: '{{["manual", "rule"].includes($deps[0])}}',
                  },
                },
              },
            ],
          },
          // 存储配置
          configConfig: {
            type: 'void',
            title: intl.formatMessage({
              id: 'pages.device.productDetail.metadata.otherConfiguration',
              defaultMessage: '其他配置',
            }),
            'x-visible': false,
            'x-decorator': 'FormItem',
            'x-component': 'ConfigParam',
            'x-reactions': '{{asyncOtherConfig}}',
          },
          // 指标
          metrics: {
            type: 'array',
            'x-component': 'ArrayItems',
            'x-decorator': 'FormItem',
            title: '指标配置',
            'x-decorator-props': {
              tooltip: '场景联动页面可引用指标配置作为触发条件',
            },
            'x-validator': [
              {
                triggerType: 'onBlur',
                validator: (value: any[]) => {
                  return new Promise((resolve) => {
                    const flag = value.every((item) => {
                      return item.id && item.name && item.value;
                    });
                    if (flag) {
                      resolve('');
                    } else {
                      resolve('请输入指标配置');
                    }
                  });
                },
              },
            ],
            // 'x-visible': props.type === 'product',
            items: {
              type: 'object',
              'x-decorator': 'ArrayItems.Item',
              properties: {
                left: {
                  type: 'void',
                  'x-component': 'Space',
                  properties: {
                    sort: {
                      type: 'void',
                      'x-decorator': 'FormItem',
                      'x-component': 'ArrayItems.SortHandle',
                    },
                    index: {
                      type: 'void',
                      'x-decorator': 'FormItem',
                      'x-component': 'ArrayItems.Index',
                    },
                  },
                },
                edit: {
                  type: 'void',
                  'x-component': 'Editable.Popover',
                  // 'x-reactions': '{{(field)=>field.title=field.query(".edit.name").get("value")||field.title}}',
                  title: '指标数据',
                  'x-reactions': {
                    dependencies: ['.edit.name'],
                    fulfill: {
                      state: {
                        title: '{{$deps[0]}}',
                      },
                    },
                  },
                  properties: {
                    id: {
                      // 标识
                      title: '标识',
                      'x-decorator': 'FormItem',
                      'x-component': 'Input',
                      'x-decorator-props': {
                        labelAlign: 'left',
                        layout: 'vertical',
                      },
                      'x-validator': [
                        {
                          max: 64,
                          message: '最多可输入64个字符',
                        },
                        {
                          required: true,
                          message: '请输入标识',
                        },
                        {
                          validateId: true,
                          message: 'ID只能由数字、26个英文字母或者下划线组成',
                        },
                      ],
                    },
                    name: {
                      // 名称
                      title: '名称',
                      'x-decorator': 'FormItem',
                      'x-component': 'Input',
                      'x-decorator-props': {
                        labelAlign: 'left',
                        layout: 'vertical',
                      },
                      'x-validator': [
                        {
                          max: 64,
                          message: '最多可输入64个字符',
                        },
                        {
                          required: true,
                          message: '请输入名称',
                        },
                      ],
                    },
                    '{value, range}': {
                      title: '指标值',
                      'x-decorator': 'FormItem',
                      'x-component': 'FIndicators',
                      'x-decorator-props': {
                        labelAlign: 'left',
                        layout: 'vertical',
                      },
                      'x-reactions': {
                        dependencies: ['valueType.type', 'valueType'],
                        fulfill: {
                          state: {
                            componentProps: {
                              type: '{{$deps[0]}}',
                              enum: '{{$deps[1]}}',
                            },
                            selfErrors:
                              "{{$deps[0] === 'string' && $self?.value?.value?.[0]?.length > 64 ? '最多输入64个字符' : ''}}",
                          },
                        },
                      },
                      'x-validator': [
                        {
                          required: true,
                          message: '请输入指标值',
                        },
                        {
                          validator: (value: any) => {
                            if (value?.range) {
                              if (!value?.value || !value?.value[0] || !value?.value[1]) {
                                return Promise.reject(new Error('请输入指标值'));
                              }
                            } else {
                              if (value?.value !== undefined && value?.value[0] === undefined) {
                                return Promise.reject(new Error('请输入指标值'));
                              }
                            }
                            return Promise.resolve();
                          },
                        },
                      ],
                    },
                    // space: {
                    //   type: 'void',
                    //   title: '指标值',
                    //   'x-decorator': 'FormItem',
                    //   'x-component': 'FormGrid',
                    //   'x-decorator-props': {
                    //     labelAlign: 'left',
                    //     layout: 'vertical',
                    //   },
                    //   'x-validator': [
                    //     {
                    //       required: true,
                    //       message: '请输入指标值',
                    //     },
                    //   ],
                    //   'x-component-props': {
                    //     maxColumns: 12,
                    //     minColumns: 12,
                    //   },
                    //   properties: {
                    //     'value[0]': {
                    //       'x-decorator': 'FormItem',
                    //       'x-component': 'Input',
                    //       'x-decorator-props': {
                    //         gridSpan: 5,
                    //       },
                    //       'x-validator': [
                    //         {
                    //           required: true,
                    //           message: '请输入',
                    //         },
                    //       ],
                    //       'x-reactions': {
                    //         dependencies: ['..range', 'valueType.type'],
                    //         fulfill: {
                    //           state: {
                    //             decoratorProps: {
                    //               gridSpan: '{{!!$deps[0]?5:$deps[1]==="boolean"?12:10}}',
                    //             },
                    //             componentType:
                    //               '{{["int","long","double","float"].includes($deps[1])?"NumberPicker":["date"].includes($deps[1])?"DatePicker":"Input"}}',
                    //           },
                    //         },
                    //       },
                    //       // 根据数据类型来渲染不同的组件
                    //     },
                    //     'value[1]': {
                    //       title: '~',
                    //       'x-decorator': 'FormItem',
                    //       'x-component': 'Input',
                    //       'x-decorator-props': {
                    //         gridSpan: 5,
                    //       },
                    //       'x-validator': [
                    //         {
                    //           required: true,
                    //           message: '请输入',
                    //         },
                    //       ],
                    //       'x-reactions': [
                    //         {
                    //           dependencies: ['..range', 'valueType.type'],
                    //           fulfill: {
                    //             state: {
                    //               visible: '{{!!$deps[0]}}',
                    //               componentType:
                    //                 '{{["int","long","double","float"].includes($deps[1])?"NumberPicker":["date"].includes($deps[1])?"DatePicker":"Input"}}',
                    //             },
                    //           },
                    //         },
                    //         {
                    //           dependencies: ['valueType.type'],
                    //           fulfill: {
                    //             state: {
                    //               visible: '{{!$deps[0]==="boolean"}}',
                    //             },
                    //           },
                    //         },
                    //       ],
                    //     },
                    //     // 根据数据类型来渲染不同的组件
                    //     range: {
                    //       type: 'boolean',
                    //       default: false,
                    //       'x-decorator': 'FormItem',
                    //       'x-component': 'Checkbox',
                    //       'x-component-props': {
                    //         children: '范围',
                    //       },
                    //       'x-decorator-props': {
                    //         gridSpan: 2,
                    //       },
                    //       'x-reactions': {
                    //         dependencies: ['valueType.type'],
                    //         when: '{{$deps[0]==="boolean"}}',
                    //         fulfill: {
                    //           state: {
                    //             visible: false,
                    //             decoratorProps: {
                    //               gridSpan: 0,
                    //             },
                    //           },
                    //         },
                    //         otherwise: {
                    //           state: {
                    //             visible: true,
                    //             decoratorProps: {
                    //               gridSpan: 2,
                    //             },
                    //           },
                    //         },
                    //       },
                    //     },
                    //   },
                    // },
                  },
                },
                right: {
                  type: 'void',
                  'x-component': 'Space',
                  properties: {
                    remove: {
                      type: 'void',
                      'x-component': 'ArrayItems.Remove',
                    },
                  },
                },
              },
            },
            properties: {
              addition: {
                type: 'void',
                title: '添加指标',
                'x-component': 'ArrayItems.Addition',
              },
            },
            'x-reactions': {
              dependencies: ['valueType.type'],
              fulfill: {
                state: {
                  visible:
                    props.type === 'product' &&
                    props.tabs !== 'tags' &&
                    "{{['int','float','double','long','date','string','boolean'].includes($deps[0])}}",
                  // value: []
                },
              },
            },
          },
        },
      },
    },
  };
  const functionSchema: ISchema = {
    type: 'object',
    properties: {
      ...commonConfig,
      async: {
        title: intl.formatMessage({
          id: 'pages.device.productDetail.metadata.whetherAsync',
          defaultMessage: '是否异步',
        }),
        'x-decorator': 'FormItem',
        'x-component': 'Radio.Group',
        'x-validator': [
          {
            required: true,
            message: '请选择是否异步',
          },
        ],
        enum: [
          {
            label: intl.formatMessage({
              id: 'pages.device.productDetail.metadata.true',
              defaultMessage: '是',
            }),
            value: true,
          },
          {
            label: intl.formatMessage({
              id: 'pages.device.productDetail.metadata.false',
              defaultMessage: '否',
            }),
            value: false,
          },
        ],
        'x-index': 2,
      },
      inputs: {
        type: 'void',
        'x-index': 3,
        title: intl.formatMessage({
          id: 'pages.device.productDetail.metadata.inputParameter',
          defaultMessage: '输入参数',
        }),
        'x-decorator': 'FormItem',
        'x-component': 'JsonParam',
        'x-reactions': (field) => {
          field.setComponentProps({ keys: 'inputs' });
        },
      },
      output: valueTypeConfig,
    },
  };
  const eventSchema: ISchema = {
    type: 'object',
    properties: {
      ...commonConfig,
      expands: {
        type: 'object',
        'x-index': 2,
        properties: {
          level: {
            title: intl.formatMessage({
              id: 'pages.device.productDetail.metadata.level',
              defaultMessage: 'level',
            }),
            'x-validator': [
              {
                required: true,
                message: '请选择级别',
              },
            ],
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            enum: EventLevel,
          },
        },
      },
      valueType: valueTypeConfig,
    },
  };
  const createTagSchema = () => {
    const temp = _.cloneDeep(propertySchema) as any;
    delete temp.properties?.expands.properties.configConfig;
    delete temp.properties?.expands.properties.source;
    return temp;
  };
  const metadataTypeMapping: Record<string, { name: string; schema: ISchema }> = {
    properties: {
      name: '属性',
      schema: propertySchema,
    },
    events: {
      name: '事件',
      schema: eventSchema,
    },
    functions: {
      name: '功能',
      schema: functionSchema,
    },
    tags: {
      name: '标签',
      schema: createTagSchema(),
    },
  };

  const getUnit = () =>
    service.getUnit().then((resp) => {
      const _data = resp.result.map((item: any) => ({
        label: item.description,
        value: item.id,
      }));
      // 缓存单位数据
      Store.set('units', _data);
      return _data;
    });

  const getStreamingAggType = () =>
    service.getStreamingAggType().then((resp) =>
      resp.result.map((item: any) => ({
        label: `${item.value}(${item.text})`,
        value: item.value,
      })),
    );

  const useAsyncDataSource = (services: (arg0: Field) => Promise<any>) => (field: Field) => {
    field.loading = true;
    services(field).then(
      action.bound!((data: { label: string; value: string }[]) => {
        field.dataSource = data;
        field.loading = false;
      }),
    );
  };

  const typeMap = new Map<string, any>();

  typeMap.set('product', productModel.current);
  typeMap.set('device', InstanceModel.detail);
  const { type } = MetadataModel;

  const saveMetadata = async (deploy?: boolean) => {
    setLoading(true);
    let params;
    try {
      params = (await form.submit()) as MetadataItem;
    } catch (e) {
      setLoading(false);
      return;
    }

    if (!typeMap.get(props.type)) return;

    const list = await DB.getDB().table(`${type}`).toArray();

    const updateDB = (t: 'add' | 'update', item: MetadataItem) => {
      switch (t) {
        case 'add':
          const dt = list.sort((a, b) => b?.sortsIndex - a?.sortsIndex) || [];
          item.sortsIndex =
            dt.length > 0 && dt[0]?.sortsIndex !== undefined ? dt[0].sortsIndex + 1 : 0;
          DB.getDB().table(`${type}`).add(item, item.id);
          return;
        case 'update':
          DB.getDB().table(`${type}`).update(item.id, item);
          return;
      }
    };
    if (params?.id) {
      const result1 = await DB.getDB().table(`${type}`).where('id').equals(params.id).toArray();

      if (result1.length > 0 && MetadataModel.action === 'add') {
        message.error('标识已存在');
        setLoading(false);
        return;
      }
    }

    const _data = updateMetadata(type, [params], typeMap.get(props.type), updateDB);

    const result = await asyncUpdateMedata(props.type, _data);
    if (result.status === 200) {
      if ((window as any).onTabSaveSuccess) {
        if (result) {
          (window as any).onTabSaveSuccess(result);
          setTimeout(() => window.close(), 300);
        }
      } else {
        Store.set(SystemConst.REFRESH_METADATA_TABLE, true);
        if (deploy) {
          Store.set('product-deploy', deploy);
        } else {
          message.success({
            key: 'metadata',
            content: '操作成功！',
          });
        }
        MetadataModel.edit = false;
        MetadataModel.item = {};
        if (InstanceModel.detail) {
          InstanceModel.detail.independentMetadata = true;
        }
      }
    } else {
      onlyMessage('操作失败！', 'error');
    }
    setLoading(false);
  };

  // const menu = (
  //   <Menu>
  //     <Menu.Item key="1" onClick={() => saveMetadata(true)}>
  //       保存并生效
  //     </Menu.Item>
  //   </Menu>
  // );
  return (
    <>
      <Drawer
        maskClosable={false}
        width="25vw"
        visible
        title={`${intl.formatMessage({
          id: `pages.data.option.${MetadataModel.action}`,
          defaultMessage: '新增',
        })}-${intl.formatMessage({
          id: `pages.device.metadata.${MetadataModel.type}`,
          defaultMessage: metadataTypeMapping[MetadataModel.type].name,
        })}`}
        onClose={() => {
          MetadataModel.edit = false;
          MetadataModel.item = {};
        }}
        destroyOnClose
        zIndex={1000}
        placement={'right'}
        extra={
          <Button loading={loading} type="primary" onClick={() => saveMetadata()}>
            保存
          </Button>
          // props.type === 'product' ? (
          //   <Dropdown.Button
          //     loading={loading}
          //     type="primary"
          //     onClick={() => saveMetadata()}
          //     overlay={menu}
          //   >
          //     保存
          //   </Dropdown.Button>
          // ) : (
          //   <Button loading={loading} type="primary" onClick={() => saveMetadata()}>
          //     保存
          //   </Button>
          // )
        }
      >
        <Form form={form} layout="vertical" size="small">
          <SchemaField
            scope={{ useAsyncDataSource, getUnit, getStreamingAggType }}
            schema={metadataTypeMapping[MetadataModel.type].schema}
          />
        </Form>
      </Drawer>
    </>
  );
});
export default Edit;
