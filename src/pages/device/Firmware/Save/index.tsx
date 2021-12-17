import { message, Modal } from 'antd';
import type { FirmwareItem } from '@/pages/device/Firmware/typings';
import { createSchemaField } from '@formily/react';
import { Form, FormGrid, FormItem, Input, Select } from '@formily/antd';
import type { Field } from '@formily/core';
import { createForm } from '@formily/core';
import type { ISchema } from '@formily/json-schema';
import FUpload from '@/components/Upload';
import { action } from '@formily/reactive';
import { service } from '@/pages/device/Firmware';
import type { Response } from '@/utils/typings';
import { useRef } from 'react';
import type { ProductItem } from '@/pages/device/Product/typings';

interface Props {
  data?: FirmwareItem;
  close: () => void;
  visible: boolean;
}

const Save = (props: Props) => {
  const { data, close, visible } = props;

  const form = createForm({
    validateFirst: true,
    initialValues: data,
  });

  const products = useRef<ProductItem[]>([]);
  const useAsyncDataSource = (services: (arg0: Field) => Promise<any>) => (field: Field) => {
    field.loading = true;
    services(field).then(
      action.bound!((list: any) => {
        field.dataSource = list.result.map((item: any) => ({ label: item.name, value: item.id }));
        products.current = list.result;
        field.loading = false;
      }),
    );
  };
  const loadData = async () => service.queryProduct();
  const SchemaField = createSchemaField({
    components: {
      FormItem,
      FormGrid,
      Input,
      FUpload,
      Select,
    },
  });

  const save = async () => {
    const values: FirmwareItem = await form.submit();
    const product = products.current?.find((item) => item.id === values.productId);
    values.productName = product?.name || '';
    const resp = (await service.save(values)) as Response<FirmwareItem>;
    if (resp.status === 200) {
      message.success('保存成功！');
    } else {
      message.error('保存失败！');
    }
  };
  const schema: ISchema = {
    type: 'object',
    properties: {
      grid: {
        type: 'void',
        'x-component': 'FormGrid',
        'x-component-props': {
          minColumns: 2,
          maxColumns: 2,
        },
        properties: {
          productId: {
            title: '产品',
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-reactions': ['{{useAsyncDataSource(loadData)}}'],
          },
          name: {
            title: '名称',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
          },
          version: {
            title: '版本号',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
          },
          versionOrder: {
            title: '版本序号',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
          },
          signMethod: {
            title: '签名方式',
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            enum: [
              { label: 'MD5', value: 'MD5' },
              { label: 'SHA256', value: 'SHA256' },
            ],
          },
          sign: {
            title: '签名',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
          },
          '{url,size}': {
            title: '文件上传',
            'x-decorator': 'FormItem',
            'x-component': 'FUpload',
            'x-component-props': {
              type: 'file',
            },
          },
        },
      },
    },
  };

  return (
    <Modal
      width="50vw"
      title="新增固件版本"
      onCancel={() => close()}
      onOk={() => save()}
      visible={visible}
    >
      <Form form={form} labelCol={5} wrapperCol={16}>
        <SchemaField schema={schema} scope={{ useAsyncDataSource, loadData }} />
      </Form>
    </Modal>
  );
};
export default Save;
