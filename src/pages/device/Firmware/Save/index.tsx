import { Modal } from 'antd';
import type { FirmwareItem } from '@/pages/device/Firmware/typings';
import { createSchemaField } from '@formily/react';
import { Form, FormGrid, FormItem, Input, Select, ArrayTable } from '@formily/antd';
import type { Field } from '@formily/core';
import { createForm } from '@formily/core';
import type { ISchema } from '@formily/json-schema';
import FUpload from '@/components/Upload';
import { action } from '@formily/reactive';
import { service } from '@/pages/device/Firmware';
import type { Response } from '@/utils/typings';
import { useRef } from 'react';
import type { ProductItem } from '@/pages/device/Product/typings';
import { onlyMessage } from '@/utils/util';

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
      ArrayTable,
    },
  });

  const save = async () => {
    const values: FirmwareItem = await form.submit();
    const product = products.current?.find((item) => item.id === values.productId);
    values.productName = product?.name || '';
    const resp = (await service.save(values)) as Response<FirmwareItem>;
    if (resp.status === 200) {
      onlyMessage('保存成功！');
    } else {
      onlyMessage('保存失败！', 'error');
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
          name: {
            title: '名称',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              placeholder: '请输入固件名称',
            },
            required: true,
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-validator': [
              {
                required: true,
                message: '请输入固件名称',
              },
              {
                max: 64,
                message: '最多可输入64个字符',
              },
            ],
          },
          productId: {
            title: '所属产品',
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-reactions': ['{{useAsyncDataSource(loadData)}}'],
            'x-component-props': {
              placeholder: '请选择所属产品',
            },
            'x-decorator-props': {
              gridSpan: 2,
            },
            required: true,
            'x-validator': [
              {
                required: true,
                message: '请选择所属产品',
              },
            ],
          },
          version: {
            title: '版本号',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              placeholder: '请输入版本号',
            },
            'x-decorator-props': {
              gridSpan: 1,
            },
            required: true,
            'x-validator': [
              {
                required: true,
                message: '请输入版本号',
              },
              {
                max: 64,
                message: '最多可输入64个字符',
              },
            ],
          },
          versionOrder: {
            title: '版本序号',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              placeholder: '请输入版本序号',
            },
            'x-decorator-props': {
              gridSpan: 1,
            },
            required: true,
            'x-validator': [
              {
                required: true,
                message: '请输入版本号',
              },
              {
                maximum: 99999,
                minimum: 1,
              },
            ],
          },
          signMethod: {
            title: '签名方式',
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            enum: [
              { label: 'MD5', value: 'MD5' },
              { label: 'SHA256', value: 'SHA256' },
            ],
            'x-component-props': {
              placeholder: '请选择签名方式',
            },
            'x-decorator-props': {
              gridSpan: 1,
            },
            required: true,
            'x-validator': [
              {
                required: true,
                message: '请选择签名方式',
              },
            ],
          },
          sign: {
            title: '签名',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              placeholder: '请输入签名',
            },
            'x-decorator-props': {
              tooltip: '请输入本地文件进行签名加密后的值',
              gridSpan: 1,
            },
            required: true,
            'x-validator': [
              {
                required: true,
                message: '请输入签名',
              },
            ],
          },
          '{url,size}': {
            title: '文件上传',
            'x-decorator': 'FormItem',
            'x-component': 'FUpload',
            'x-component-props': {
              type: 'file',
            },
            'x-decorator-props': {
              gridSpan: 2,
            },
            required: true,
            'x-validator': [
              {
                required: true,
                message: '请上传文件',
              },
            ],
          },
          array: {
            type: 'array',
            'x-decorator': 'FormItem',
            'x-component': 'ArrayTable',
            title: '其他配置',
            'x-component-props': {
              pagination: { pageSize: 10 },
              scroll: { x: '100%' },
            },
            'x-decorator-props': {
              gridSpan: 2,
            },
            items: {
              type: 'object',
              properties: {
                column1: {
                  type: 'void',
                  'x-component': 'ArrayTable.Column',
                  'x-component-props': { title: 'KEY' },
                  properties: {
                    a1: {
                      type: 'string',
                      'x-decorator': 'Editable',
                      'x-component': 'Input',
                    },
                  },
                },
                column2: {
                  type: 'void',
                  'x-component': 'ArrayTable.Column',
                  'x-component-props': { title: 'VALUE' },
                  properties: {
                    a2: {
                      type: 'string',
                      'x-decorator': 'FormItem',
                      'x-component': 'Input',
                    },
                  },
                },
                column3: {
                  type: 'void',
                  'x-component': 'ArrayTable.Column',
                  'x-component-props': {
                    title: '操作',
                    dataIndex: 'operations',
                  },
                  properties: {
                    item: {
                      type: 'void',
                      'x-component': 'FormItem',
                      properties: {
                        remove: {
                          type: 'void',
                          'x-component': 'ArrayTable.Remove',
                        },
                      },
                    },
                  },
                },
              },
            },
            properties: {
              add: {
                type: 'void',
                'x-component': 'ArrayTable.Addition',
                title: '添加条目',
              },
            },
          },
        },
        description: {
          title: '说明',
          'x-decorator': 'FormItem',
          'x-component': 'Input.TextArea',
          'x-component-props': {
            rows: 3,
            showCount: true,
            maxLength: 200,
            placeholder: '请输入说明',
          },
        },
      },
    },
  };

  return (
    <Modal
      maskClosable={false}
      width="50vw"
      title="新增"
      onCancel={() => close()}
      onOk={() => save()}
      visible={visible}
    >
      <Form form={form} labelCol={5} wrapperCol={16} layout="vertical">
        <SchemaField schema={schema} scope={{ useAsyncDataSource, loadData }} />
      </Form>
    </Modal>
  );
};
export default Save;
