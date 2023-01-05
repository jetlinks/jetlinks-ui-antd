import { Button, Modal } from 'antd';
import { createForm, Field, registerValidateRules } from '@formily/core';
import { createSchemaField } from '@formily/react';
import React, { useEffect, useState } from 'react';
import * as ICONS from '@ant-design/icons';
import {
  Form,
  FormGrid,
  FormItem,
  Input,
  Select,
  NumberPicker,
  Password,
  Checkbox,
  Switch,
} from '@formily/antd';
import type { ISchema } from '@formily/json-schema';
import service from '@/pages/DataCollect/service';
import { onlyMessage } from '@/utils/util';
import { action } from '@formily/reactive';
import { RadioCard } from '@/components';

interface Props {
  data: Partial<PointItem>;
  close: () => void;
  reload: () => void;
  collector: Partial<CollectorItem>;
}

export default (props: Props) => {
  const [data, setData] = useState<any>(props.data);
  useEffect(() => {
    setData({
      ...props.data,
      accessModes: props.data?.accessModes
        ? (props.data?.accessModes || []).map((item) => item.value)
        : [],
      features: props.data?.features
        ? (props.data?.features || []).map((item: any) => item?.value)
        : [],
      configuration: {
        ...props.data?.configuration,
        parameter: {
          ...props.data?.configuration?.parameter,
          writeByteCount: [props.data?.configuration?.parameter?.writeByteCount],
        },
      },
      nspwc:
        props?.data?.configuration?.parameter?.writeByteCount ||
        props?.data?.configuration?.parameter?.byteCount,
    });
  }, [props.data]);

  const form = createForm({
    validateFirst: true,
    initialValues: data || {},
  });

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Select,
      NumberPicker,
      Password,
      FormGrid,
      Checkbox,
      RadioCard,
      Switch,
    },
    scope: {
      icon(name: any) {
        return React.createElement(ICONS[name]);
      },
    },
  });

  const getCodecProvider = () => service.queryCodecProvider();

  const useAsyncDataSource = (services: (arg0: Field) => Promise<any>) => (field: Field) => {
    field.loading = true;
    services(field).then(
      action.bound!((resp: any) => {
        field.dataSource = (resp?.result || [])
          .filter((i: any) => i?.id !== 'property')
          .map((item: any) => ({
            label: item.name,
            value: item.id,
          }));
        field.loading = false;
      }),
    );
  };

  registerValidateRules({
    checkLength(value) {
      if (String(value).length > 64) {
        return {
          type: 'error',
          message: '最多可输入64个字符',
        };
      }
      if (!(Number(value) % 1 === 0) || Number(value) < 0) {
        return {
          type: 'error',
          message: '请输入0或正整数',
        };
      }
      return '';
    },
    checkScaleFactor(value) {
      if (String(value).length > 64) {
        return {
          type: 'error',
          message: '最多可输入64个字符',
        };
      }
      return '';
    },
    checkAddressLength(value) {
      if (!(Number(value) % 1 === 0)) {
        return {
          type: 'error',
          message: '请输入0~255之间的正整数',
        };
      }
      return '';
    },
  });

  const schema: ISchema = {
    type: 'object',
    properties: {
      layout: {
        type: 'void',
        'x-component': 'FormGrid',
        'x-component-props': {
          maxColumns: 2,
          minColumns: 2,
          columnGap: 24,
        },
        properties: {
          name: {
            title: '点位名称',
            'x-component': 'Input',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              placeholder: '请输入点位名称',
            },
            'x-validator': [
              {
                required: true,
                message: '请输入点位名称',
              },
              {
                max: 64,
                message: '最多可输入64个字符',
              },
            ],
          },
          'configuration.function': {
            title: '功能码',
            'x-component': 'Select',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              placeholder: '请选择功能码',
            },
            enum: [
              { label: '01线圈寄存器', value: 'Coils' },
              { label: '03保存寄存器', value: 'HoldingRegisters' },
              { label: '04输入寄存器', value: 'DiscreteInputs' },
            ],
            'x-validator': [
              {
                required: true,
                message: '请选择功能码',
              },
            ],
          },
          'configuration.parameter.address': {
            title: '地址',
            'x-component': 'NumberPicker',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              placeholder: '请输入地址',
            },
            'x-validator': [
              {
                required: true,
                message: '请输入地址',
              },
              {
                max: 255,
                message: '请输入0-255之间的正整数',
              },
              {
                min: 0,
                message: '请输入0-255之间的正整数',
              },
              {
                checkAddressLength: true,
              },
            ],
          },
          'configuration.parameter.quantity': {
            title: '寄存器数量',
            'x-component': 'NumberPicker',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              placeholder: '请输入寄存器数量',
              stringMode: true,
            },
            // 'x-reactions': [
            //   {
            //     dependencies: ['configuration.codec.provider'],
            //     fulfill: {
            //       state: {
            //         selfErrors: '{{$deps[0] && $self.value && {"int8:": 1, "int16": 2, "int32": 4, "int64": 8, "ieee754_float": 4, "ieee754_double": 8, "hex": 1}[$deps[0]] > $self.value * 2 ? "数据类型长度需 <= 寄存器数量 * 2" : ""}}',
            //       },
            //     },
            //   },
            // ],
            default: 1,
            'x-validator': [
              {
                required: true,
                message: '请输入寄存器数量',
              },
              {
                min: 1,
                message: '请输入非0正整数',
              },
              {
                checkLength: true,
              },
            ],
          },
          'configuration.codec.provider': {
            title: '数据类型',
            'x-component': 'Select',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              placeholder: '请选择数据类型',
            },
            'x-reactions': [
              '{{useAsyncDataSource(getCodecProvider)}}',
              {
                dependencies: ['..function', 'configuration.parameter.quantity'],
                fulfill: {
                  state: {
                    visible: '{{$deps[0] === "HoldingRegisters"}}',
                    selfErrors:
                      '{{$deps[1] && $self.value && {"int8:": 1, "int16": 2, "int32": 4, "int64": 8, "ieee754_float": 4, "ieee754_double": 8, "hex": 1}[$self.value] > $deps[1] * 2 ? "数据类型长度需 <= 寄存器数量 * 2" : ""}}',
                  },
                },
              },
            ],
            'x-validator': [
              {
                required: true,
                message: '请选择数据类型',
              },
            ],
          },
          'configuration.codec.configuration.scaleFactor': {
            title: '缩放因子',
            'x-component': 'NumberPicker',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
            },
            default: 1,
            'x-component-props': {
              placeholder: '请输入缩放因子',
              stringMode: true,
            },
            'x-validator': [
              {
                required: true,
                message: '请输入缩放因子',
              },
              {
                checkScaleFactor: true,
              },
            ],
          },
          accessModes: {
            title: '访问类型',
            type: 'array',
            'x-component': 'RadioCard',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              placeholder: '请选择访问类型',
              model: 'multiple',
              itemStyle: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                minWidth: '130px',
                height: '50px',
              },
              options: [
                { label: '读', value: 'read' },
                { label: '写', value: 'write' },
                // { label: '订阅', value: 'subscribe' },
              ],
            },
            'x-validator': [
              {
                required: true,
                message: '请选择访问类型',
              },
            ],
          },
          nspwc: {
            title: '非标准协议写入配置',
            'x-component': 'Switch',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
              layout: 'level',
            },
            'x-component-props': {
              placeholder: '请选择非标准协议写入配置',
            },
            'x-reactions': {
              dependencies: ['.accessModes', 'configuration.function'],
              fulfill: {
                state: {
                  visible: '{{$deps[0].includes("write") && $deps[1] === "HoldingRegisters"}}',
                },
              },
            },
          },
          byte: {
            type: 'void',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
              style: {
                backgroundColor: '#fafafa',
                padding: 20,
              },
            },
            'x-component': 'FormGrid',
            'x-component-props': {
              maxColumns: 2,
              minColumns: 2,
              columnGap: 24,
            },
            'x-reactions': {
              dependencies: ['.nspwc'],
              fulfill: {
                state: {
                  visible: '{{!!$deps[0]}}',
                },
              },
            },
            properties: {
              'configuration.parameter.writeByteCount': {
                title: '是否写入数据区长度',
                'x-component': 'RadioCard',
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 2,
                  layout: 'vertical',
                  labelAlign: 'left',
                },
                'x-component-props': {
                  placeholder: '请选择是否写入数据区长度',
                  model: 'singular',
                  itemStyle: {
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                    minWidth: '130px',
                    height: '50px',
                  },
                  options: [
                    { label: '是', value: true },
                    { label: '否', value: false },
                  ],
                },
                'x-validator': [
                  {
                    required: true,
                    message: '请选择是否写入数据区长度',
                  },
                ],
              },
              'configuration.parameter.byteCount': {
                title: '自定义数据区长度（byte）',
                'x-component': 'NumberPicker',
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 2,
                  layout: 'vertical',
                  labelAlign: 'left',
                },
                'x-component-props': {
                  placeholder: '请输入自定义数据区长度（byte）',
                },
                'x-validator': [
                  {
                    required: true,
                    message: '请输入自定义数据区长度（byte）',
                  },
                ],
                'x-reactions': {
                  dependencies: ['configuration.parameter.quantity'],
                  fulfill: {
                    state: {
                      value: '{{$deps[0]*2}}',
                    },
                  },
                },
              },
            },
          },
          'configuration.interval': {
            title: '采集频率',
            'x-component': 'NumberPicker',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
              style: {
                marginBottom: 8,
              },
            },
            default: 3000,
            'x-component-props': {
              placeholder: '请输入采集频率',
              addonAfter: '毫秒',
              stringMode: true,
              style: {
                width: '100%',
              },
            },
            'x-validator': [
              {
                required: true,
                message: '请输入采集频率',
              },
              {
                min: 1,
                message: '请输入非0正整数',
              },
              {
                checkLength: true,
              },
            ],
          },
          features: {
            title: '',
            type: 'array',
            'x-component': 'Checkbox.Group',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
            },
            // 'x-reactions': {
            //   dependencies: ['.accessModes'],
            //   fulfill: {
            //     state: {
            //       visible: '{{($deps[0] || []).includes("subscribe")}}',
            //     },
            //   },
            // },
            enum: [
              {
                label: '只推送变化的数据',
                value: 'changedOnly',
              },
            ],
          },
          description: {
            title: '说明',
            'x-component': 'Input.TextArea',
            'x-decorator': 'FormItem',
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

  const save = async () => {
    const value = await form.submit<any>();
    console.log(value);
    const obj = {
      provider: props?.collector?.provider || 'MODBUS_TCP',
      collectorId: props?.collector?.id,
    };
    delete value.nspwc;
    const response: any = props.data?.id
      ? await service.updatePoint(props.data?.id, {
          ...props.data,
          ...value,
          pointKey: value?.configuration?.parameter?.address,
          configuration: {
            ...value?.configuration,
            codec: {
              ...value?.configuration?.codec,
              provider: value?.configuration?.codec?.provider || 'int8',
            },
          },
        })
      : await service.savePoint({
          ...obj,
          ...props.data,
          ...value,
          pointKey: value?.configuration?.parameter?.address,
          configuration: {
            ...value?.configuration,
            codec: {
              ...value?.configuration?.codec,
              provider: value?.configuration?.codec?.provider || 'int8',
            },
          },
        });
    if (response && response?.status === 200) {
      onlyMessage('操作成功');
      props.reload();
    }
  };

  return (
    <Modal
      title={props?.data?.id ? '编辑' : '新增'}
      maskClosable={false}
      visible
      onCancel={props.close}
      width={700}
      footer={[
        <Button key={1} onClick={props.close}>
          取消
        </Button>,
        <Button
          type="primary"
          key={2}
          onClick={() => {
            save();
          }}
        >
          确定
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <SchemaField schema={schema} scope={{ useAsyncDataSource, getCodecProvider }} />
      </Form>
    </Modal>
  );
};
