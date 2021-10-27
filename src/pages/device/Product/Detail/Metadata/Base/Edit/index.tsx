import { Drawer } from 'antd';
import { createSchemaField } from '@formily/react';
import MetadataModel from '@/pages/device/Product/Detail/Metadata/Base/model';
import { createForm } from '@formily/core';
import { Radio, Select, Form, Input, FormItem, NumberPicker } from '@formily/antd';
import type { ISchema } from '@formily/json-schema';
import { DataTypeList, EventLevel, PropertySource } from '@/pages/device/data';
import { useCallback, useEffect, useState } from 'react';
import { service } from '@/pages/device/Product';
import { Store } from 'jetlinks-store';
import type { UnitType } from '@/pages/device/Product/typings';
import { useIntl } from 'umi';

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
      'valueType.type': {
        title: '数据类型',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        enum: DataTypeList,
      },
      'valueType.scale': {
        title: '精度',
        'x-decorator': 'FormItem',
        'x-component': 'NumberPicker',
      },
      'valueType.unit': {
        title: '单位',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        enum: units,
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
      'expands.source': {
        title: '来源',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        enum: PropertySource,
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
    </Drawer>
  );
};
export default Edit;
