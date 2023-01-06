import { Modal } from 'antd';
import type { FirmwareItem } from '@/pages/device/Firmware/typings';
import { createSchemaField } from '@formily/react';
import { Form, FormGrid, FormItem, Input, Select, ArrayTable, NumberPicker } from '@formily/antd';
import type { Field } from '@formily/core';
import { onFieldValueChange, onFormInit } from '@formily/core';
import { createForm } from '@formily/core';
import type { ISchema } from '@formily/json-schema';
import FUpload from '@/components/FUpload';
import { action } from '@formily/reactive';
import { service } from '@/pages/device/Firmware';
import { useRef } from 'react';
import type { ProductItem } from '@/pages/device/Product/typings';
import { onlyMessage } from '@/utils/util';
import RemoveData from './RemoveData';
import _ from 'lodash';

interface Props {
  data?: FirmwareItem;
  close: () => void;
  visible: boolean;
}

const Save = (props: Props) => {
  const { data, close, visible } = props;
  const fileInfo = useRef<any>({});
  // const disabled = useRef<boolean>(false);
  const signMethod = useRef<'md5' | 'sha256'>('md5');

  const form = createForm({
    validateFirst: true,
    initialValues: data,
    effects: () => {
      onFormInit(async (form1) => {
        if (!data?.id) return;
        // const resp = await service.task({terms: [{ column: 'firmwareId', value: data?.id }]})
        // if(resp.status === 200 && resp.result?.total){
        //   disabled.current = true
        // } else {
        //   disabled.current = false
        // }
        form1.setInitialValues({ ...data, upload: { url: data?.url } });
      });
      onFieldValueChange('signMethod', (field, f) => {
        const value = (field as Field).value;
        signMethod.current = value;
        if (field.modified) {
          f.setFieldState('sign', (state) => {
            state.value = undefined;
          });
          f.setFieldState('upload', (state1) => {
            state1.value = undefined;
          });
        }
      });
      onFieldValueChange('upload', (field) => {
        const value = (field as Field).value;
        fileInfo.current = value;
      });
      onFieldValueChange('productId', (field, form1) => {
        if (field.modified) {
          form1.setFieldState('versionOrder', (state) => {
            state.value = undefined;
          });
        }
      });
      onFieldValueChange('versionOrder', async (field, f1) => {
        const value = (field as Field).value;
        const productId = (field.query('.productId').take() as Field).value;
        if (field.modified && productId && value) {
          const resp = await service.validateVersion(productId, value);
          if (resp.status === 200) {
            f1.setFieldState('versionOrder', (state) => {
              state.selfErrors = resp.result ? ['版本序号已存在'] : undefined;
            });
          }
        }
      });
    },
  });

  const products = useRef<ProductItem[]>([]);

  const useAsyncDataSource = (services: (arg0: Field) => Promise<any>) => (field: Field) => {
    field.loading = true;
    services(field).then(
      action.bound!((list: any) => {
        const _data = list.result.filter((it: any) => {
          return _.map(it?.features || [], 'id').includes('supportFirmware');
        });
        field.dataSource = _data.map((item: any) => ({ label: item.name, value: item.id }));
        products.current = list.result;
        field.loading = false;
      }),
    );
  };
  const loadData = async () =>
    service.queryProduct({
      paging: false,
      terms: [
        {
          column: 'state',
          value: 1,
        },
      ],
      sorts: [{ name: 'createTime', order: 'desc' }],
    });

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      FormGrid,
      Input,
      FUpload,
      Select,
      ArrayTable,
      NumberPicker,
      RemoveData,
    },
  });

  const save = async () => {
    const values: any = await form.submit();
    const product = products.current?.find((item) => item.id === values.productId);
    values.productName = product?.name || '';
    const { upload, ...extra } = values;
    const params = {
      ...extra,
      url: upload.url || data?.url,
      size: upload.length || data?.size,
    };
    const resp = (await service.update(params)) as any;
    if (resp.status === 200) {
      onlyMessage('保存成功！');
      close();
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
            'x-component-props': {
              placeholder: '请选择所属产品',
              showSearch: true,
              allowClear: true,
              filterOption: (input: string, option: any) =>
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0,
            },
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
            'x-component': 'NumberPicker',
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
              { label: 'MD5', value: 'md5' },
              { label: 'SHA256', value: 'sha256' },
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
              // {
              //   validator: (value: string) => {
              //     return new Promise((resolve, reject) => {
              //       if (value !== '' && signMethod.current && fileInfo.current[signMethod.current]) {
              //         if (value !== fileInfo.current[signMethod.current]) {
              //           return reject(new Error('签名不一致，请检查文件是否上传正确'));
              //         }
              //       }
              //       return resolve('');
              //     });
              //   },
              // },
            ],
            'x-reactions': [
              {
                dependencies: ['.upload', 'signMethod'],
                fulfill: {
                  state: {
                    selfErrors:
                      '{{$deps[0] && $deps[1] && $deps[0][$deps[1]] && $self.value && $self.value !== $deps[0][$deps[1]] ? "签名不一致，请检查文件是否上传正确" : ""}}',
                  },
                },
              },
            ],
          },
          upload: {
            title: '固件上传',
            'x-decorator': 'FormItem',
            'x-component': 'FUpload',
            'x-component-props': {
              type: 'file',
              placeholder: '请上传文件',
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
          properties: {
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
                    id: {
                      type: 'string',
                      'x-decorator': 'FormItem',
                      'x-component': 'Input',
                      'x-validator': [
                        {
                          required: true,
                          message: '请输入KEY',
                        },
                      ],
                    },
                  },
                },
                column2: {
                  type: 'void',
                  'x-component': 'ArrayTable.Column',
                  'x-component-props': { title: 'VALUE' },
                  properties: {
                    value: {
                      type: 'string',
                      'x-decorator': 'FormItem',
                      'x-component': 'Input',
                      'x-validator': [
                        {
                          required: true,
                          message: '请输入VALUE',
                        },
                      ],
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
                          'x-component': 'RemoveData',
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
                title: '添加',
              },
            },
          },
          description: {
            title: '说明',
            'x-decorator': 'FormItem',
            'x-component': 'Input.TextArea',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              rows: 3,
              showCount: true,
              maxLength: 200,
              placeholder: '请输入说明',
            },
          },
        },
      },
    },
  };

  return (
    <Modal
      maskClosable={false}
      width="50vw"
      title={data?.id ? '编辑' : '新增'}
      onCancel={() => close()}
      onOk={async () => {
        if (data?.id) {
          const res: any = await service.task({
            terms: [{ terms: [{ column: 'firmwareId', value: data.id }] }],
          });
          if (res.status === 200 && res.result.data && res.result.data.length !== 0) {
            onlyMessage('该固件有升级任务，不可编辑', 'error');
          } else {
            save();
          }
        } else {
          save();
        }
      }}
      visible={visible}
    >
      <Form form={form} labelCol={5} wrapperCol={16} layout="vertical">
        <SchemaField schema={schema} scope={{ useAsyncDataSource, loadData }} />
      </Form>
    </Modal>
  );
};
export default Save;
