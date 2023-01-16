import { ArrayItems, FormItem, FormLayout, Input, NumberPicker, Select } from '@formily/antd';
import { createSchemaField, observer } from '@formily/react';
import type { ISchema } from '@formily/json-schema';
import { DataTypeList, DateTypeList, FileTypeList } from '@/pages/device/data';
import { Store } from 'jetlinks-store';
import { useAsyncDataSource } from '@/utils/util';
import { service } from '@/pages/device/components/Metadata';
import BooleanEnum from '@/components/Metadata/BooleanParam';
import EnumParam from '@/components/Metadata/EnumParam';
import ArrayParam from '@/components/Metadata/ArrayParam';
import { useIntl } from '@/.umi/plugin-locale/localeExports';
import Editable from '../EditTable';

// 不算是自定义组件。只是抽离了JSONSchema
interface Props {
  keys?: string;
  isFunction?: boolean;
  isFilter?: string;
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

  // const checkArray: any = (arr: any) => {
  //   if (Array.isArray(arr) && arr.length) {
  //     return arr.every((item: any) => {
  //       if (item.valueType?.type === 'object') {
  //         return item.id && item.name && checkArray(item.json?.properties);
  //       }
  //       return item.id && item.name && item.valueType;
  //     });
  //   }
  //   return false;
  // };

  const checkArrayFormat: any = (arr: any) => {
    const reg = new RegExp('^[0-9a-zA-Z_\\\\-]+$');
    let str: string = '';
    if (Array.isArray(arr) && arr.length) {
      arr.every((item: any) => {
        if (!item.id) {
          str = '请输入标识';
          return false;
        }
        if (!item.name) {
          str = '请输入名称';
          return false;
        }
        if (!item.valueType?.type) {
          str = '请选择数据类型';
          return false;
        }
        if (!reg.exec(item.id)) {
          str = '标识只能由数字、字母、下划线、中划线组成';
          return false;
        }
        if (item.id.length > 64 && item.name.length > 64) {
          str = '标识最多可输入64个字符';
          return false;
        }
        if (item.name.length > 64) {
          str = '名称最多可输入64个字符';
          return false;
        }
        if (item.valueType?.type === 'boolean') {
          if (!(item.valueType.falseText && item.valueType.trueText)) {
            str = '请输入布尔值';
            return false;
          }
          if (
            item.valueType.falseValue === '' ||
            item.valueType.trueValue === '' ||
            item.valueType.falseValue === undefined ||
            item.valueType.trueValue === undefined
          ) {
            str = '请输入布尔值';
            return false;
          }
        }
        return item.id && item.name && item.valueType?.type;
      });
    }
    return str;
  };

  const schema: ISchema = {
    type: 'object',
    properties: {
      [props?.keys || 'properties']: {
        type: 'array',
        'x-component': 'ArrayItems',
        'x-decorator': 'FormItem',
        'x-reactions': {
          dependencies: ['.type'],
          fulfill: {
            state: {
              value: [{}],
            },
          },
        },
        'x-validator': [
          {
            triggerType: 'onBlur',
            validator: (value: any[]) => {
              return new Promise((resolve) => {
                if (props.keys === 'inputs' && value.length === 0) {
                  resolve('');
                }
                const str = checkArrayFormat(value);
                resolve(str);
              });
            },
          },
        ],
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
                valueType: {
                  type: 'object',
                  properties: {
                    type: {
                      title: '数据类型',
                      required: true,
                      'x-decorator': 'FormItem',
                      'x-component': 'Select',
                      // enum: DataTypeList.filter((item) =>
                      //   ['int', 'long', 'float', 'double', 'string', 'boolean', 'date'].includes(
                      //     item.value,
                      //   ),
                      // ),
                      enum: !props.isFunction
                        ? DataTypeList.filter(
                            (item) => item.value !== 'array' && item.value !== 'object',
                          )
                        : DataTypeList,
                      // enum: DataTypeList,
                      'x-validator': [
                        {
                          required: true,
                          message: '请选择数据类型',
                        },
                      ],
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
                      'x-component-props': {
                        // isFunction: props.isFunction,
                      },
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
                      default: 'yyyy-MM-DD HH:mm:ss',
                      'x-validator': [
                        {
                          required: true,
                          message: '请选择时间格式',
                        },
                      ],
                      // "x-hidden":true,
                      // 'x-reactions': {
                      //   dependencies: ['..valueType.type'],
                      //   fulfill: {
                      //     state: {
                      //       visible: "{{['date'].includes($deps[0])}}",
                      //     },
                      //   },
                      // },
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
                  },
                },
                'valueType.scale': {
                  title: '精度',
                  'x-decorator': 'FormItem',
                  'x-component': 'NumberPicker',
                  'x-visible': false,
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
                  'x-component-props': {
                    min: 1,
                  },
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
                  'x-component-props': {
                    // isFunction: props.isFunction,
                    isFilter: 'yes',
                  },
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
