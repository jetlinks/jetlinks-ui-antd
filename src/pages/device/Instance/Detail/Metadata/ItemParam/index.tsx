import { createSchemaField, observer } from '@formily/react';
import type { IFieldState } from '@formily/core';
import { createForm, onFieldValueChange } from '@formily/core';
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
  PreviewText,
} from '@formily/antd';
import { InstanceModel, service } from '@/pages/device/Instance';
import type { Unit } from '@/pages/device/Instance/typings';
import type { ISchema } from '@formily/json-schema';
import ProCard from '@ant-design/pro-card';

const ItemParam = observer(() => {
  const form = createForm({
    validateFirst: true,
    readPretty: true,
    effects() {
      onFieldValueChange('type', (field) => {
        const type = field.query('type').value();
        const id = field.query('id').value();
        const temp = Array.from(InstanceModel.params).map((item) => item.split('-$')[0]);
        const includes = new Set(temp).has(id);
        if (includes && type !== 'object') {
          InstanceModel.params.delete(`${id}-$${InstanceModel.params.size - 1}`);
        } else if (id && type === 'object') {
          InstanceModel.params.add(`${id}-$${InstanceModel.params.size}`);
        }
      });
    },
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
              display: '{{($deps[0]==="float"||$deps[0]==="double")?"visible":"none"}}',
            },
          },
        },
      },
      maxLength: {
        type: 'number',
        title: '最大长度',
        'x-display': 'none',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-reactions': {
          dependencies: ['type'],
          fulfill: {
            state: {
              display: '{{($deps[0]==="string")?"visible":"none"}}',
            },
          },
        },
      },
      format: {
        type: 'string',
        title: '时间格式',
        'x-display': 'none',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: '默认格式：String类型的UTC时间戳 (毫秒)',
        },
        'x-reactions': {
          dependencies: ['type'],
          fulfill: {
            state: {
              display: '{{($deps[0]==="date")?"visible":"none"}}',
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
    <ProCard
      extra={<a>保存</a>}
      bordered={true}
      colSpan={500}
      style={{ height: '40vh', marginRight: 10 }}
    >
      <PreviewText.Placeholder value="-">
        <Form form={form} labelCol={8} wrapperCol={13} size="small">
          <SchemaField schema={schema} />
        </Form>
      </PreviewText.Placeholder>
    </ProCard>
  );
});
export default ItemParam;
