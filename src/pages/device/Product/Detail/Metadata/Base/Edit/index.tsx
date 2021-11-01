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
import JsonParam from '@/components/Metadata/JsonParam';
import ArrayParam from '@/components/Metadata/ArrayParam';
import EnumParam from '@/components/Metadata/EnumParam';
import BooleanEnum from '@/components/Metadata/BooleanParam';

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
      JsonParam,
      ArrayParam,
      EnumParam,
      BooleanEnum,
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
      jsonConfig: {
        title: 'JSON对象',
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
      arrayConfig: {
        title: '元素配置',
        'x-decorator': 'FormItem',
        'x-component': 'ArrayParam',
        'x-reactions': {
          dependencies: ['.valueType.type'],
          fulfill: {
            state: {
              visible: "{{['array'].includes($deps[0])}}",
            },
          },
        },
      },
      enumConfig: {
        title: '枚举项',
        'x-decorator': 'FormItem',
        'x-component': 'EnumParam',
        'x-reactions': {
          dependencies: ['.valueType.type'],
          fulfill: {
            state: {
              visible: "{{['enum'].includes($deps[0])}}",
            },
          },
        },
      },
      booleanConfig: {
        title: '布尔值',
        'x-decorator': 'FormItem',
        'x-component': 'BooleanEnum',
        'x-reactions': {
          dependencies: ['.valueType.type'],
          fulfill: {
            state: {
              visible: "{{['boolean'].includes($deps[0])}}",
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
        获取数据
      </Button>
    </Drawer>
  );
};
export default Edit;
