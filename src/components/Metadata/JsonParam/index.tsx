import {
  ArrayItems,
  Editable,
  FormItem,
  FormLayout,
  Input,
  NumberPicker,
  Select,
} from '@formily/antd';
import { createSchemaField, observer } from '@formily/react';
import type { ISchema } from '@formily/json-schema';
import { DataTypeList, DateTypeList, FileTypeList } from '@/pages/device/data';
import { Store } from 'jetlinks-store';
import { useAsyncDataSource } from '@/utils/util';
import { service } from '@/pages/device/components/Metadata';
import MetadataModel from '@/pages/device/components/Metadata/Base/model';
import BooleanEnum from '@/components/Metadata/BooleanParam';
import EnumParam from '@/components/Metadata/EnumParam';
import ArrayParam from '@/components/Metadata/ArrayParam';
import { useIntl } from '@/.umi/plugin-locale/localeExports';

// 不算是自定义组件。只是抽离了JSONSchema
interface Props {
  keys?: string;
}

const JsonParam = observer((props: Props) => {
  const intl = useIntl();
  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Select,
      JsonParam,
      ArrayItems,
      Editable,
      FormLayout,
      NumberPicker,
      BooleanEnum,
      EnumParam,
      ArrayParam,
    },
  });
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

  const schema: ISchema = {
    type: 'object',
    properties: {
      [props?.keys || 'properties']: {
        type: 'array',
        'x-component': 'ArrayItems',
        'x-decorator': 'FormItem',
        items: {
          type: 'object',
          'x-decorator': 'ArrayItems.Item',
          properties: {
            sort: {
              type: 'void',
              'x-decorator': 'FormItem',
              'x-component': 'ArrayItems.SortHandle',
            },
            config: {
              type: 'void',
              title: '配置参数',
              'x-decorator': 'Editable.Popover',
              'x-component': 'FormLayout',
              'x-component-props': {
                layout: 'vertical',
              },
              'x-decorator-props': {
                placement: 'left',
              },
              'x-reactions':
                '{{(field)=>field.title = field.query(".config.name").get("value") || field.title}}',
              properties: {
                id: {
                  title: '标识',
                  required: true,
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
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
                  title: '名称',
                  required: true,
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                },
                valueType: {
                  type: 'object',
                  properties: {
                    type: {
                      title: '数据类型',
                      required: true,
                      'x-decorator': 'FormItem',
                      'x-component': 'Select',
                      enum:
                        MetadataModel.type === 'functions'
                          ? DataTypeList.filter((item) => item.value !== 'file')
                          : DataTypeList,
                    },
                    booleanConfig: {
                      title: '布尔值',
                      type: 'void',
                      'x-decorator': 'FormItem',
                      'x-component': 'BooleanEnum',
                      'x-reactions': {
                        dependencies: ['..valueType.type'],
                        fulfill: {
                          state: {
                            visible: "{{['boolean'].includes($deps[0])}}",
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
                        dependencies: ['..valueType.type'],
                        fulfill: {
                          state: {
                            visible: "{{['enum'].includes($deps[0])}}",
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
                        dependencies: ['..valueType.type'],
                        fulfill: {
                          state: {
                            visible: "{{['array'].includes($deps[0])}}",
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
                      'x-reactions': {
                        dependencies: ['..valueType.type'],
                        fulfill: {
                          state: {
                            visible: "{{['file'].includes($deps[0])}}",
                          },
                        },
                      },
                    },
                    unit: {
                      title: '单位',
                      'x-decorator': 'FormItem',
                      'x-component': 'Select',
                      'x-visible': false,
                      'x-component-props': {
                        showSearch: true,
                        allowClear: true,
                        showArrow: true,
                        filterOption: (input: string, option: any) =>
                          option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0,
                      },
                      enum: Store.get('units'),
                      'x-reactions': [
                        {
                          dependencies: ['..valueType.type'],
                          fulfill: {
                            state: {
                              visible: "{{['int','float','long','double'].includes($deps[0])}}",
                            },
                          },
                        },
                        '{{useAsyncDataSource(getUnit)}}',
                      ],
                    },
                    format: {
                      title: '时间格式',
                      'x-decorator': 'FormItem',
                      'x-component': 'Select',
                      enum: DateTypeList,
                      'x-visible': false,
                      'x-reactions': {
                        dependencies: ['..valueType.type'],
                        fulfill: {
                          state: {
                            visible: "{{['date'].includes($deps[0])}}",
                          },
                        },
                      },
                    },
                    expands: {
                      type: 'object',
                      properties: {
                        maxLength: {
                          title: '最大长度',
                          'x-decorator': 'FormItem',
                          'x-component': 'NumberPicker',
                          'x-decorator-props': {
                            tooltip: intl.formatMessage({
                              id: 'pages.device.productDetail.metadata.maxLength.byte',
                              defaultMessage: '字节',
                            }),
                          },
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
                  },
                },

                'valueType.scale': {
                  title: '精度',
                  'x-decorator': 'FormItem',
                  'x-component': 'NumberPicker',
                  'x-visible': false,
                  'x-reactions': {
                    dependencies: ['..valueType.type'],
                    fulfill: {
                      state: {
                        visible: "{{['float','double'].includes($deps[0])}}",
                      },
                    },
                  },
                },

                json: {
                  type: 'string',
                  title: 'JSON对象',
                  'x-visible': false,
                  'x-decorator': 'FormItem',
                  'x-component': 'JsonParam',
                  'x-reactions': {
                    dependencies: ['.valueType.type'],
                    fulfill: {
                      state: {
                        visible: "{{['object'].includes($deps[0])}}",
                      },
                    },
                  },
                },
              },
            },
            remove: {
              type: 'void',
              'x-decorator': 'FormItem',
              'x-component': 'ArrayItems.Remove',
            },
          },
        },
        properties: {
          add: {
            type: 'void',
            title: '添加参数',
            'x-component': 'ArrayItems.Addition',
          },
        },
      },
    },
  };
  return <SchemaField schema={schema} scope={{ useAsyncDataSource, getUnit }} />;
});
export default JsonParam;
