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
        'x-component': 'Input',
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
      <Form form={form} labelCol={5} wrapperCol={16} onAutoSubmit={console.log} size="small">
        <SchemaField schema={schema} />
      </Form>
    </>
  );
});

export default ItemDetail;
