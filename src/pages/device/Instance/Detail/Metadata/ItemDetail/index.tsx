import { InstanceModel } from '@/pages/device/Instance';
import { observer } from '@formily/react';

import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import {
  Form,
  FormItem,
  FormLayout,
  Input,
  Select,
  Cascader,
  DatePicker,
  FormGrid,
  ArrayItems,
  Editable,
  Radio,
} from '@formily/antd';
import type { MetadataItem } from '@/pages/device/Product/typings';

const ItemDetail = observer(() => {
  const form = createForm<MetadataItem>({
    validateFirst: true,
    initialValues: InstanceModel.metadataItem,
  });
  const SchemaField = createSchemaField({
    components: {
      FormItem,
      FormGrid,
      FormLayout,
      Input,
      DatePicker,
      Cascader,
      Select,
      ArrayItems,
      Editable,
      Radio,
    },
  });

  const schema = {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        title: '属性标识',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
      name: {
        type: 'string',
        title: '属性名称',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
      dataType: {
        type: 'string',
        title: '数据类型',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        enum: [
          { label: 'int(整数型)', value: 'int' },
          { label: 'long(长整数型)', value: 'long' },
          { label: 'double(双精度浮点数)', value: 'double' },
          { label: 'float(单精度浮点数)', value: 'float' },
          { label: 'text(字符串)', value: 'string' },
          { label: 'bool(布尔型)', value: 'boolean' },
          { label: 'date(时间型)', value: 'date' },
          { label: 'enum(枚举)', value: 'enum' },
          { label: 'array(数组)', value: 'array' },
          { label: 'object(结构体)', value: 'object' },
          { label: 'geoPoint(地理位置)', value: 'geoPoint' },
        ],
      },
      readOnly: {
        type: 'string',
        title: '只读',
        enum: [
          {
            label: '是',
            value: 1,
          },
          {
            label: '否',
            value: 2,
          },
        ],
        'x-decorator': 'FormItem',
        'x-component': 'Radio.Group',
      },
      description: {
        type: 'string',
        required: true,
        title: '描述',
        'x-decorator': 'FormItem',
        'x-component': 'Input.TextArea',
      },
    },
  };
  return (
    <>
      <Form form={form} labelCol={8} wrapperCol={16} onAutoSubmit={console.log} size="small">
        <SchemaField schema={schema} />
      </Form>
    </>
  );
});

export default ItemDetail;
