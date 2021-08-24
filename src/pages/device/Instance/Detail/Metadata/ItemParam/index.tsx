import { createSchemaField, observer } from '@formily/react';
import type { IFieldState } from '@formily/core';
import { createForm } from '@formily/core';
import {
  FormItem,
  Form,
  FormGrid,
  FormLayout,
  Input,
  DatePicker,
  Cascader,
  Select,
  ArrayItems,
  Editable,
  Radio,
} from '@formily/antd';
import { service } from '@/pages/device/Instance';
import type { Unit } from '@/pages/device/Instance/typings';
import type { ISchema } from '@formily/json-schema';

const ItemParam = observer(() => {
  const form = createForm({
    validateFirst: true,
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
    scope: {
      fetchUnits: async (field: IFieldState) => {
        const unit = await service.getUnits();
        // eslint-disable-next-line no-param-reassign
        field.dataSource = unit.result?.map((item: Unit) => ({
          label: item.text,
          value: item.id,
        }));
      },
    },
  });

  const schema: ISchema = {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        title: '参数标识',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
      name: {
        type: 'string',
        title: '参数名称',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
      type: {
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
      scale: {
        type: 'string',
        title: '精度',
        'x-display': 'none',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-reactions': {
          dependencies: ['type'],
          fulfill: {
            state: {
              display: '{{$deps[0]==="int"?"visible"∑:"none"}}',
            },
          },
        },
      },
      unit: {
        type: 'string',
        title: '单位',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-reactions': '{{fetchUnits}}',
      },
      description: {
        type: 'string',
        title: '描述',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input.TextArea',
      },
    },
  };
  return (
    <Form form={form} labelCol={8} wrapperCol={13} size="small">
      <SchemaField schema={schema} />
    </Form>
  );
});
export default ItemParam;
