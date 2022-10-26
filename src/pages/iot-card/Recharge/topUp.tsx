import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Form, FormGrid, FormItem, Input, Select, NumberPicker } from '@formily/antd';
import type { ISchema } from '@formily/json-schema';
import { Modal } from '@/components';
// import { onlyMessage } from '@/utils/util';
import { ExclamationCircleOutlined } from '@ant-design/icons';

interface Props {
  data: any;
  close: () => void;
}

const TopUp = (props: Props) => {
  const form = createForm({});

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Select,
      FormGrid,
      NumberPicker,
    },
  });

  const schema: ISchema = {
    type: 'object',
    properties: {
      layout: {
        type: 'void',
        'x-decorator': 'FormGrid',
        'x-decorator-props': {
          maxColumns: 2,
          minColumns: 2,
          columnGap: 24,
        },
        properties: {
          configId: {
            title: '平台对接',
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              placeholder: '请输入平台对接',
            },

            'x-validator': [
              {
                max: 64,
                message: '最多可输入64个字符',
              },
              {
                required: true,
                message: '请选择平台对接',
              },
            ],
          },
          rechargeId: {
            title: '账户id',
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              placeholder: '请输入账户id',
            },

            'x-validator': [
              {
                max: 64,
                message: '最多可输入64个字符',
              },
              {
                required: true,
                message: '请输入账户id',
              },
            ],
          },
          chargeMoney: {
            title: '充值金额',
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'NumberPicker',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              placeholder: '请输入充值金额',
            },

            'x-validator': [
              {
                min: 1,
                message: '请输入1~500之间的数字',
              },
              {
                max: 500,
                message: '请输入1~500之间的数字',
              },
              {
                required: true,
                message: '请输入充值金额',
              },
            ],
          },
          paymentType: {
            title: '支付方式',
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              placeholder: '请选择支付方式',
            },
            name: 'name',
            'x-validator': [
              {
                required: true,
                message: '请选择支付方式',
              },
            ],
          },
        },
      },
    },
  };

  const save = async () => {
    const value = await form.submit<any>();
    console.log(value);
  };

  return (
    <Modal
      title={'充值'}
      maskClosable={false}
      visible
      onCancel={props.close}
      onOk={save}
      width="35vw"
    >
      <div
        style={{
          padding: 5,
          background: '#f6f6f6',
          fontSize: 14,
          color: '#00000091',
          marginBottom: 10,
        }}
      >
        <span style={{ fontSize: 16, marginRight: 5 }}>
          <ExclamationCircleOutlined />
        </span>
        暂只支持移动OneLink平台
      </div>
      <Form form={form} layout="vertical">
        <SchemaField schema={schema} scope={{}} />
      </Form>
    </Modal>
  );
};
export default TopUp;
