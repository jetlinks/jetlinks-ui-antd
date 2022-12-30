import { Alert, Modal } from 'antd';
import { ArrayTable, DatePicker, FormItem, Input, NumberPicker, Select } from '@formily/antd';
import { createForm, onFormInit } from '@formily/core';
import { createSchemaField, FormProvider } from '@formily/react';
import { service } from '@/pages/device/Instance';
import { useParams } from 'umi';
import type { PropertyMetadata } from '@/pages/device/Product/typings';
import { onlyMessage } from '@/utils/util';
import GeoComponent from '@/pages/device/Instance/Detail/Tags/location/GeoComponent';
import { MetadataJsonInput } from '@/components';

interface Props {
  data: Partial<PropertyMetadata>;
  onCancel: () => void;
}

const EditProperty = (props: Props) => {
  const { data } = props;
  const params = useParams<{ id: string }>();

  const SchemaField = createSchemaField({
    components: {
      Input,
      FormItem,
      Select,
      ArrayTable,
      DatePicker,
      NumberPicker,
      GeoComponent,
      MetadataJsonInput,
    },
  });

  const form = createForm({
    effects() {
      onFormInit((f) => {
        const valueType = data?.valueType?.type || data?.dataType;
        switch (valueType) {
          case 'enum':
            f.setFieldState('propertyValue', async (state) => {
              state.dataSource = (data?.valueType?.elements || []).map((i: any) => {
                return {
                  label: i?.text,
                  value: i?.value,
                };
              });
              state.componentProps = {
                placeholder: '请选择',
              };
              state.componentType = 'Select';
            });
            break;
          case 'boolean':
            f.setFieldState('propertyValue', async (state) => {
              state.dataSource = [
                {
                  label: data?.valueType?.trueText || '是',
                  value: data?.valueType?.trueValue || true,
                },
                {
                  label: data?.valueType?.falseText || '否',
                  value: data?.valueType?.falseValue || false,
                },
              ];
              state.componentProps = {
                placeholder: '请选择',
              };
              state.componentType = 'Select';
            });
            break;
          case 'int':
          case 'long':
          case 'float':
          case 'double':
            f.setFieldState('propertyValue', (state) => {
              state.componentType = 'NumberPicker';
              state.componentProps = {
                placeholder: '请输入',
              };
            });
            break;
          case 'geoPoint':
            f.setFieldState('propertyValue', (state) => {
              state.componentType = 'GeoComponent';
              state.componentProps = {
                placeholder: '请输入',
              };
            });
            break;
          case 'object':
            f.setFieldState('propertyValue', (state) => {
              state.componentType = 'MetadataJsonInput';
              state.componentProps = {
                placeholder: '请输入',
              };
            });
            break;
          case 'array':
            f.setFieldState('propertyValue', (state) => {
              state.componentType = 'Input';
              state.componentProps = {
                placeholder: '多个数据用英文,分割',
              };
            });
            break;
          case 'date':
            f.setFieldState('propertyValue', (state) => {
              state.componentType = 'DatePicker';
              state.componentProps = {
                placeholder: '请选择',
                format: 'YYYY-MM-DD HH:mm:ss',
              };
            });
            break;
          default:
            f.setFieldState('propertyValue', (state) => {
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
  const schema = {
    type: 'object',
    properties: {
      propertyValue: {
        type: 'string',
        title: data?.name || '自定义属性',
        required: true,
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 2,
          labelAlign: 'left',
          layout: 'vertical',
        },
        'x-component': 'Input',
      },
    },
  };

  const handleSetPropertyValue = async (propertyValue: string) => {
    const resp = await service.setProperty(params.id, { [`${data.id}`]: propertyValue });
    if (resp.status === 200) {
      onlyMessage('操作成功');
    }
    props.onCancel();
  };
  return (
    <Modal
      maskClosable={false}
      title="编辑"
      visible
      onOk={async () => {
        const values: any = await form.submit();
        if (!!values) {
          handleSetPropertyValue(values?.propertyValue);
        }
      }}
      onCancel={() => {
        props.onCancel();
      }}
    >
      <Alert message="当数据来源为设备时，填写的值将下发到设备" type="warning" showIcon />
      <div style={{ marginTop: '30px' }}>
        <FormProvider form={form}>
          <SchemaField schema={schema} />
        </FormProvider>
      </div>
    </Modal>
  );
};

export default EditProperty;
