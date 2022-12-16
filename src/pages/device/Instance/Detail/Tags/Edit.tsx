import { createForm, Field, FormPath, onFieldReact } from '@formily/core';
import { createSchemaField, FormProvider } from '@formily/react';
import { InstanceModel, service } from '@/pages/device/Instance';
import { ArrayTable, FormItem, Input, NumberPicker, DatePicker, Select } from '@formily/antd';
import { Modal } from 'antd';
import { useIntl } from 'umi';
import GeoComponent from './location/GeoComponent';
import { onlyMessage } from '@/utils/util';
import RemoveData from './RemoveData';
import { MetadataJsonInput } from '@/components';

interface Props {
  close: () => void;
  tags: any[];
  refresh: () => void;
}

const Edit = (props: Props) => {
  const { tags } = props;
  const intl = useIntl();

  const form = createForm({
    initialValues: {
      tags: tags,
    },
    effects() {
      onFieldReact('tags.*.id', (field, f) => {
        const value = (field as Field).value;
        const item = (tags || []).find((it: any) => it.id === value);
        const valueType = item?.type || item?.dataType?.type;
        const nextPath = FormPath.transform(field.path, /\d+/, (index) => {
          return `tags.${index}.value`;
        });
        switch (valueType) {
          case 'enum':
            f.setFieldState(nextPath, (state) => {
              state.componentType = 'Select';
              state.dataSource = (item?.dataType?.elements || []).map((i: any) => {
                return {
                  label: i?.text,
                  value: i?.value,
                };
              });
              state.componentProps = {
                placeholder: '请选择',
              };
            });
            break;
          case 'boolean':
            f.setFieldState(nextPath, (state) => {
              state.componentType = 'Select';
              state.dataSource = [
                { label: '是', value: true },
                { label: '否', value: false },
              ];
              state.componentProps = {
                placeholder: '请选择',
              };
            });
            break;
          case 'int':
          case 'long':
          case 'float':
          case 'double':
            f.setFieldState(nextPath, (state) => {
              state.componentType = 'NumberPicker';
              state.componentProps = {
                placeholder: '请输入',
              };
            });
            break;
          case 'geoPoint':
            f.setFieldState(nextPath, (state) => {
              state.componentType = 'GeoComponent';
              state.componentProps = {
                json: item?.json?.properties?.[0],
              };
            });
            break;
          case 'object':
            f.setFieldState(nextPath, (state) => {
              state.componentType = 'MetadataJsonInput';
            });
            break;
          case 'date':
            f.setFieldState(nextPath, (state) => {
              state.componentType = 'DatePicker';
              state.componentProps = {
                placeholder: '请选择',
                format: 'YYYY-MM-DD HH:mm:ss',
              };
            });
            break;
          default:
            f.setFieldState(nextPath, (state) => {
              state.componentType = 'Input';
              state.componentProps = {
                placeholder: '请输入',
              };
            });
            break;
        }
      });
    },
  });

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Select,
      ArrayTable,
      DatePicker,
      NumberPicker,
      RemoveData,
      GeoComponent,
      MetadataJsonInput,
    },
  });

  const schema = {
    type: 'object',
    properties: {
      tags: {
        type: 'array',
        'x-decorator': 'FormItem',
        'x-component': 'ArrayTable',
        'x-component-props': {
          pagination: { pageSize: 10 },
          scroll: { x: '100%' },
        },
        items: {
          type: 'object',
          properties: {
            column1: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': { width: 200, title: 'ID' },
              properties: {
                id: {
                  type: 'string',
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-hidden': true,
                },
                key: {
                  type: 'string',
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                },
              },
            },
            column2: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': {
                width: 200,
                title: intl.formatMessage({
                  id: 'pages.table.name',
                  defaultMessage: '名称',
                }),
              },
              properties: {
                name: {
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
                width: 200,
                title: intl.formatMessage({
                  id: 'pages.device.instanceDetail.detail.value',
                  defaultMessage: '值',
                }),
              },
              properties: {
                type: {
                  type: 'string',
                  name: '类型',
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-hidden': true,
                },
                value: {
                  type: 'string',
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  // 'x-reactions': {
                  //   dependencies: ['.type'],
                  //   fulfill: {
                  //     state: {
                  //       componentType: '{{$deps[0]==="geoPoint"?"GeoComponent":"Input"}}',
                  //     },
                  //   },
                  // },
                },
              },
            },
            column4: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': {
                width: 100,
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
                      // 'x-component-props': {
                      //   tags: tags,
                      // },
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
    },
  };

  return (
    <Modal
      title="编辑标签"
      onCancel={() => {
        props.close();
      }}
      visible
      width={1000}
      onOk={async () => {
        const values: any = (await form.submit()) as any;
        if (values?.tags.length === 0) {
          props.close();
        } else {
          const list = (values?.tags || [])
            .filter((item: any) => item?.key)
            .map((i: any) => {
              const { dataType, ...extra } = i;
              return { ...extra };
            });
          const resp = await service.saveTags(InstanceModel.detail?.id || '', list);
          if (resp.status === 200) {
            props.refresh();
            // InstanceModel.detail = { ...InstanceModel.detail, tags: values.tags };
            onlyMessage('操作成功！');
            props.close();
          }
        }
      }}
    >
      <FormProvider form={form}>
        <SchemaField schema={schema} />
      </FormProvider>
    </Modal>
  );
};

export default Edit;
