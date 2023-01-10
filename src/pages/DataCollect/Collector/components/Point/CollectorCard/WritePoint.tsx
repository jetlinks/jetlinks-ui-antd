import { Modal } from 'antd';
import { FormItem, Input, Form, Select, ArrayTable, DatePicker, NumberPicker } from '@formily/antd';
import { createForm, onFormInit } from '@formily/core';
import { createSchemaField } from '@formily/react';
import service from '../../../../service';
import { onlyMessage } from '@/utils/util';
import GeoComponent from '@/pages/device/Instance/Detail/Tags/location/GeoComponent';
import { MetadataJsonInput } from '@/components';
import { useMemo } from 'react';

interface Props {
  data: Partial<PointItem>;
  onCancel: () => void;
}

const WritePoint = (props: Props) => {
  const { data } = props;

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

  const form = useMemo(
    () =>
      createForm({
        effects() {
          onFormInit((f) => {
            if (
              props.data?.provider === 'MODBUS_TCP' &&
              props.data?.configuration.function === 'Coils'
            ) {
              f.setFieldState('propertyValue', (state) => {
                state.componentType = 'Input.TextArea';
                state.componentProps = {
                  placeholder: '请输入',
                };
              });
            } else {
              let valueType: string =
                props.data?.provider === 'OPC_UA'
                  ? props?.data?.configuration?.type || 'Number'
                  : props.data?.configuration?.codec?.provider || 'int8';
              valueType = valueType.toLocaleLowerCase();
              switch (valueType) {
                case 'boolean':
                  f.setFieldState('propertyValue', async (state) => {
                    state.dataSource = [
                      {
                        label: '是',
                        value: true,
                      },
                      {
                        label: '否',
                        value: false,
                      },
                    ];
                    state.componentProps = {
                      placeholder: '请选择',
                    };
                    state.componentType = 'Select';
                  });
                  break;
                case 'int8':
                case 'int16':
                case 'int32':
                case 'int64':
                case 'ieee754_float':
                case 'ieee754_double':
                case 'hex':
                case 'number':
                  f.setFieldState('propertyValue', (state) => {
                    state.componentType = 'NumberPicker';
                    state.componentProps = {
                      placeholder: '请输入',
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
            }
          });
        },
      }),
    [props.data?.id],
  );
  const schema = {
    type: 'object',
    properties: {
      propertyValue: {
        type: 'string',
        title: data?.name || '自定义属性',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: '请输入',
        },
      },
    },
  };

  const handleSetPropertyValue = async (propertyValue: string) => {
    if (data?.collectorId && data?.id) {
      const resp = await service.writePoint(data.collectorId, [
        {
          pointId: data.id,
          value: propertyValue,
        },
      ]);
      if (resp.status === 200) {
        onlyMessage('操作成功');
      }
      props.onCancel();
    }
  };
  return (
    <Modal
      maskClosable={false}
      title="写入"
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
      <Form form={form} layout="vertical">
        <SchemaField schema={schema} />
      </Form>
    </Modal>
  );
};

export default WritePoint;
