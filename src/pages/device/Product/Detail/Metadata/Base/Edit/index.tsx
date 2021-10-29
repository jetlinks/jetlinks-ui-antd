import { Button, Drawer } from 'antd';
import { createSchemaField } from '@formily/react';
import MetadataModel from '@/pages/device/Product/Detail/Metadata/Base/model';
import { createForm } from '@formily/core';
import {
  FormLayout,
  ArrayItems,
  Editable,
  Radio,
  Select,
  Form,
  Input,
  FormItem,
  NumberPicker,
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
import { useCallback, useEffect, useState } from 'react';
import { service } from '@/pages/device/Product';
import { Store } from 'jetlinks-store';
import type { UnitType } from '@/pages/device/Product/typings';
import { useIntl } from 'umi';
import MetadataParam from '@/components/MetadataParam';

const Edit = () => {
  const form = createForm({
    initialValues: MetadataModel.item as Record<string, unknown>,
  });

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
      MetadataParam,
    },
  });

  const [units, setUnits] = useState<{ label: string; value: string }[]>();

  const propertySchema: ISchema = {
    type: 'object',
    properties: {
      id: {
        title: '标识',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
      name: {
        title: '名称',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
      'expands.source': {
        title: '来源',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        enum: PropertySource,
      },
      'valueType.type': {
        title: '数据类型',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        enum: DataTypeList,
      },
      'expands.maxLength': {
        title: '最大长度',
        'x-decorator': 'FormItem',
        'x-component': 'NumberPicker',
        'x-reactions': {
          dependencies: ['valueType.type'],
          fulfill: {
            state: {
              visible: "{{['string'].includes($deps[0])}}",
            },
          },
        },
      },
      'valueType.elementType.type': {
        title: '元素类型',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        enum: DataTypeList,
        'x-reactions': {
          dependencies: ['valueType.type'],
          fulfill: {
            state: {
              visible: "{{['array'].includes($deps[0])}}",
            },
          },
        },
      },
      jsonConfig: {
        title: 'JSON对象',
        'x-decorator': 'FormItem',
        'x-component': 'MetadataParam',
      },
      enumConfig: {
        title: '枚举项',
        type: 'array',
        'x-decorator': 'FormItem',
        'x-component': 'ArrayItems',
        items: {
          type: 'object',
          'x-component': 'ArrayItems.Item',
          properties: {
            sort: {
              type: 'void',
              'x-decorator': 'FormItem',
              'x-component': 'ArrayItems.SortHandle',
            },
            popover: {
              type: 'void',
              title: '枚举项配置',
              'x-decorator': 'Editable.Popover',
              'x-component': 'FormLayout',
              'x-component-props': {
                layout: 'vertical',
              },
              'x-reactions': [
                {
                  fulfill: {
                    schema: {
                      title: '{{$self.query(".label").value() : $self.query(".value").value() }}',
                    },
                  },
                },
              ],
              properties: {
                label: {
                  type: 'string',
                  title: 'Label',
                  required: true,
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-component-props': {
                    placeholder: '标识',
                  },
                },
                value: {
                  type: 'string',
                  title: 'Value',
                  required: true,
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-component-props': {
                    placeholder: '对该枚举项的描述',
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
          addition: {
            type: 'void',
            title: '新增枚举项',
            'x-component': 'ArrayItems.Addition',
          },
        },
        'x-reactions': {
          dependencies: ['valueType.type'],
          fulfill: {
            state: {
              visible: "{{['enum'].includes($deps[0])}}",
            },
          },
        },
      },
      trueConfig: {
        title: '布尔值',
        type: 'void',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          asterisk: true,
          feedbackLayout: 'none',
        },
        'x-reactions': {
          dependencies: ['valueType.type'],
          fulfill: {
            state: {
              visible: "{{['boolean'].includes($deps[0])}}",
            },
          },
        },
        'x-component': 'Space',
        properties: {
          'valueType.elementType.trueText': {
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            default: '是',
            'x-component-props': {
              placeholder: 'trueText',
            },
          },
          'valueType.elementType.trueValue': {
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            default: true,
            'x-component-props': {
              placeholder: 'trueValue',
            },
          },
        },
      },
      falseConfig: {
        type: 'void',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          asterisk: true,
          feedbackLayout: 'none',
        },
        'x-reactions': {
          dependencies: ['valueType.type'],
          fulfill: {
            state: {
              visible: "{{['boolean'].includes($deps[0])}}",
            },
          },
        },
        'x-component': 'Space',
        properties: {
          'valueType.elementType.falseText': {
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            default: '否',
            'x-component-props': {
              placeholder: 'falseText',
            },
          },
          'valueType.elementType.falseValue': {
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            default: false,
            'x-component-props': {
              placeholder: 'falseValue',
            },
          },
        },
      },
      'valueType.elementType.format': {
        title: '时间格式',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        enum: DateTypeList,
        'x-reactions': {
          dependencies: ['valueType.type'],
          fulfill: {
            state: {
              visible: "{{['date'].includes($deps[0])}}",
            },
          },
        },
      },
      'valueType.scale': {
        title: '精度',
        'x-decorator': 'FormItem',
        'x-component': 'NumberPicker',
        'x-reactions': {
          dependencies: ['valueType.type'],
          fulfill: {
            state: {
              visible: "{{['float','double'].includes($deps[0])}}",
            },
          },
        },
      },
      'valueType.elementType.fileType': {
        title: '文件类型',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-visible': false,
        enum: FileTypeList,
        'x-reactions': {
          dependencies: ['valueType.type'],
          fulfill: {
            state: {
              visible: "{{['file'].includes($deps[0])}}",
            },
          },
        },
      },
      'valueType.elementType.expands.maxLength': {
        title: '密码长度',
        'x-decorator': 'FormItem',
        'x-component': 'NumberPicker',
        'x-decorator-props': {
          tooltip: '字节',
        },
        'x-visible': false,
        'x-reactions': {
          dependencies: ['valueType.type'],
          fulfill: {
            state: {
              visible: "{{['password'].includes($deps[0])}}",
            },
          },
        },
      },
      'valueType.unit': {
        title: '单位',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-visible': false,
        enum: units,
        'x-reactions': {
          dependencies: ['valueType.type'],
          fulfill: {
            state: {
              visible: "{{['int','float','long','double'].includes($deps[0])}}",
            },
          },
        },
      },
      'expands.readOnly': {
        title: '是否只读',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Radio.Group',
        enum: [
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
      description: {
        title: '描述',
        'x-decorator': 'FormItem',
        'x-component': 'Input.TextArea',
      },
    },
  };

  const functionSchema: ISchema = {
    type: 'object',
    properties: {
      id: {
        title: '标识',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
      name: {
        title: '名称',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
      async: {
        title: '是否异步',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Radio.Group',
        enum: [
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
      inputParams: {
        title: '输入参数',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
      outputParams: {
        title: '输出参数',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
      description: {
        title: '描述',
        'x-decorator': 'FormItem',
        'x-component': 'Input.TextArea',
      },
    },
  };

  const eventSchema: ISchema = {
    type: 'object',
    properties: {
      id: {
        title: '标识',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
      name: {
        title: '名称',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
      'expands.level': {
        title: '级别',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        enum: EventLevel,
      },
    },
  };

  const tagSchema: ISchema = {
    type: 'object',
    properties: {
      id: {
        title: '标识',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
      name: {
        title: '名称',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
      'valueType.type': {
        title: '数据类型',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        enum: DataTypeList,
      },
      'expands.readOnly': {
        title: '是否只读',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Radio.Group',
        enum: [
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
      description: {
        title: '描述',
        'x-decorator': 'FormItem',
        'x-component': 'Input.TextArea',
      },
    },
  };

  const metadataTypeMapping: Record<string, { name: string; schema: ISchema }> = {
    property: {
      name: '属性',
      schema: propertySchema,
    },
    events: {
      name: '事件',
      schema: eventSchema,
    },
    function: {
      name: '功能',
      schema: functionSchema,
    },
    tag: {
      name: '标签',
      schema: tagSchema,
    },
  };

  const getUnits = useCallback(async () => {
    const cache = Store.get('units');
    if (cache) {
      return cache;
    }
    const response = await service.getUnit();
    const temp = response.result.map((item: UnitType) => ({
      label: item.description,
      value: item.id,
    }));
    Store.set('units', temp);
    return temp;
  }, []);

  useEffect(() => {
    getUnits().then((data) => {
      Store.set('units', data);
      setUnits(data);
    });
  }, [getUnits]);

  const intl = useIntl();

  return (
    <Drawer
      width="20vw"
      visible
      title={`${intl.formatMessage({
        id: `pages.data.option.${MetadataModel.action}`,
        defaultMessage: '新增',
      })}-${intl.formatMessage({
        id: `pages.device.metadata.${MetadataModel.type}`,
        defaultMessage: '',
      })}`}
      onClose={() => {
        MetadataModel.edit = false;
        MetadataModel.item = {};
      }}
      destroyOnClose
      zIndex={1000}
    >
      <Form form={form} layout="vertical" size="small">
        <SchemaField schema={metadataTypeMapping[MetadataModel.type].schema} />
      </Form>
      <Button
        onClick={async () => {
          const data = await form.submit();
          console.log(data, '提交数据');
        }}
      >
        {' '}
        获取数据
      </Button>
    </Drawer>
  );
};
export default Edit;
