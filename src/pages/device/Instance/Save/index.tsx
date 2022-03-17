import { message, Modal } from 'antd';
import { createForm } from '@formily/core';
import { Form, FormItem, FormLayout, Input, Radio, Select } from '@formily/antd';
import { createSchemaField } from '@formily/react';
import type { ISchema } from '@formily/json-schema';
import FUpload from '@/components/Upload';
import { service } from '@/pages/device/Instance';
import 'antd/lib/tree-select/style/index.less';
import type { DeviceInstance } from '../typings';
import { useEffect, useState } from 'react';

interface Props {
  visible: boolean;
  close: (data?: DeviceInstance) => void;
  data: Partial<DeviceInstance>;
}

const Save = (props: Props) => {
  const { visible, close, data } = props;
  const [productList, setProductList] = useState<any[]>([]);
  const form = createForm({
    initialValues: {
      id: data?.id,
      name: data?.name,
      productName: data?.productName,
      productId: data?.productId,
      describe: data?.describe,
    },
  });

  useEffect(() => {
    service.getProductList({ paging: false }).then((resp) => {
      if (resp.status === 200) {
        const list = resp.result.map((item: { name: any; id: any }) => ({
          label: item.name,
          value: item.id,
        }));
        setProductList(list);
      }
    });
  }, []);
  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Select,
      Radio,
      FUpload,
      FormLayout,
    },
  });

  const handleSave = async () => {
    const values = (await form.submit()) as any;
    const productId = values.productId;
    if (productId) {
      const product = productList.find((i) => i.value === productId);
      values.productName = product.label;
    }
    const resp = (await service.update(values)) as any;
    if (resp.status === 200) {
      message.success('保存成功');
      props.close(values);
    }
  };
  const schema: ISchema = {
    type: 'object',
    properties: {
      layout: {
        type: 'void',
        'x-component': 'FormLayout',
        'x-component-props': {
          labelCol: 4,
          wrapperCol: 18,
        },
        properties: {
          id: {
            title: 'ID',
            'x-disabled': !!data?.id,
            'x-component': 'Input',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              tooltip: <div>若不填写,系统将自动生成唯一ID</div>,
            },
          },
          name: {
            title: '名称',
            'x-component': 'Input',
            'x-decorator': 'FormItem',
            'x-validator': [
              {
                required: true,
                message: '请输入名称',
              },
              {
                max: 64,
                message: '最多可输入64个字符',
              },
            ],
          },
          productId: {
            title: '所属产品',
            'x-disabled': !!data?.id,
            required: true,
            'x-component': 'Select',
            'x-decorator': 'FormItem',
            enum: [...productList],
          },
          describe: {
            title: '描述',
            'x-component': 'Input.TextArea',
            'x-decorator': 'FormItem',
            'x-component-props': {
              showCount: true,
              maxLength: 200,
            },
          },
        },
      },
    },
  };
  return (
    <Modal
      visible={visible}
      onCancel={() => close()}
      width="30vw"
      title={data?.id ? '编辑' : '新增'}
      onOk={handleSave}
    >
      <Form form={form}>
        <SchemaField schema={schema} />
      </Form>
    </Modal>
  );
};
export default Save;
