import { Button, Modal } from 'antd';
import { createForm, Field, registerValidateRules } from '@formily/core';
import { createSchemaField } from '@formily/react';
import React, { useEffect, useState } from 'react';
import * as ICONS from '@ant-design/icons';
import { Form, FormGrid, FormItem, Input, Select, NumberPicker, Password } from '@formily/antd';
import type { ISchema } from '@formily/json-schema';
import service from '@/pages/DataCollect/service';
import { onlyMessage, testDomain, testIP, testIPv6 } from '@/utils/util';
import { action } from '@formily/reactive';
import { RadioCard } from '@/components';

interface Props {
  data: Partial<ChannelItem>;
  close: () => void;
  reload: () => void;
}

export default (props: Props) => {
  const [data, setData] = useState<Partial<ChannelItem>>(props.data);
  const [authTypeList, setAuthTypeList] = useState<any[]>([]);

  useEffect(() => {
    if (props.data?.id) {
      service.queryChannelByID(props.data.id).then((resp) => {
        if (resp.status === 200) {
          setData(resp.result);
        }
      });
    }
    service.queryAuthTypeList({}).then((resp) => {
      if (resp.status === 200) {
        setAuthTypeList(
          (resp.result || []).map((item: any) => {
            return {
              label: item.text,
              value: item.value,
            };
          }),
        );
      }
    });
  }, [props.data]);

  const form = createForm({
    validateFirst: true,
    initialValues: data || {},
  });

  const getSecurityPolicyList = () => service.querySecurityPolicyList({});
  const getSecurityModesList = () => service.querySecurityModesList({});
  const getCertificateList = () => service.queryCertificateList({});

  const useAsyncDataSource = (services: (arg0: Field) => Promise<any>) => (field: Field) => {
    field.loading = true;
    services(field).then(
      action.bound!((resp: any) => {
        field.dataSource = (resp?.result || []).map((item: any) => ({
          label: item?.text || item?.name || item,
          value: item?.value || item?.id || item,
        }));
        field.loading = false;
      }),
    );
  };

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Select,
      NumberPicker,
      Password,
      FormGrid,
      RadioCard,
    },
    scope: {
      icon(name: any) {
        return React.createElement(ICONS[name]);
      },
    },
  });

  registerValidateRules({
    testHost(val: string) {
      if (!(testIP(val) || testIPv6(val) || testDomain(val))) {
        return {
          type: 'error',
          message: '请输入正确格式的Modbus主机IP地址',
        };
      } else {
        return true;
      }
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
            title: '通道名称',
            'x-component': 'Input',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              placeholder: '请输入名称',
            },
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
          provider: {
            title: '通讯协议',
            'x-component': 'Select',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              placeholder: '请选择通讯协议',
            },
            'x-disabled': props.data?.id,
            enum: [
              { label: 'OPC UA', value: 'OPC_UA' },
              { label: 'Modbus TCP', value: 'MODBUS_TCP' },
            ],
            'x-validator': [
              {
                required: true,
                message: '请选择通讯协议',
              },
            ],
          },
          'configuration.host': {
            title: 'Modbus主机IP',
            'x-component': 'Input',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
              tooltip: '支持ipv4、ipv6、域名',
            },
            'x-component-props': {
              placeholder: '请输入Modbus主机IP',
            },
            'x-validator': [
              {
                required: true,
                message: '请输入Modbus主机IP',
              },
              {
                testHost: true,
              },
            ],
            'x-reactions': {
              dependencies: ['..provider'],
              fulfill: {
                state: {
                  visible: '{{$deps[0]==="MODBUS_TCP"}}',
                },
              },
            },
          },
          'configuration.port': {
            title: '端口',
            'x-component': 'NumberPicker',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              placeholder: '请输入端口',
            },
            default: 502,
            'x-validator': [
              {
                required: true,
                message: '请输入端口',
              },
              {
                max: 65535,
                message: '请输入1-65535之间的正整数',
              },
              {
                min: 1,
                message: '请输入1-65535之间的正整数',
              },
            ],
            'x-reactions': {
              dependencies: ['..provider'],
              fulfill: {
                state: {
                  visible: '{{$deps[0]==="MODBUS_TCP"}}',
                },
              },
            },
          },
          'configuration.endpoint': {
            title: '端点url',
            'x-component': 'Input',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              placeholder: '请输入端点url',
            },
            'x-validator': [
              {
                required: true,
                message: '请输入端点url',
              },
              {
                triggerType: 'onBlur',
                validator: (value: string) => {
                  return new Promise((resolve) => {
                    service
                      .validateField(value)
                      .then((resp) => {
                        if (resp.status === 200) {
                          if (resp.result.passed) {
                            resolve('');
                          } else {
                            resolve(resp.result.reason);
                          }
                        }
                        resolve('');
                      })
                      .catch(() => {
                        return '验证失败!';
                      });
                  });
                },
              },
            ],
            'x-reactions': {
              dependencies: ['..provider'],
              fulfill: {
                state: {
                  visible: '{{$deps[0]==="OPC_UA"}}',
                },
              },
            },
          },
          'configuration.securityPolicy': {
            title: '安全策略',
            'x-component': 'Select',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              placeholder: '请选择安全策略',
            },
            'x-validator': [
              {
                required: true,
                message: '请选择安全策略',
              },
            ],
            'x-reactions': [
              '{{useAsyncDataSource(getSecurityPolicyList)}}',
              {
                dependencies: ['..provider'],
                fulfill: {
                  state: {
                    visible: '{{$deps[0]==="OPC_UA"}}',
                  },
                },
              },
            ],
          },
          'configuration.securityMode': {
            title: '安全模式',
            'x-component': 'Select',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              placeholder: '请选择安全模式',
            },
            'x-validator': [
              {
                required: true,
                message: '请选择安全模式',
              },
            ],
            'x-reactions': [
              '{{useAsyncDataSource(getSecurityModesList)}}',
              {
                dependencies: ['..provider'],
                fulfill: {
                  state: {
                    visible: '{{$deps[0]==="OPC_UA"}}',
                  },
                },
              },
            ],
          },
          'configuration.certificate': {
            title: '证书',
            'x-component': 'Select',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              placeholder: '请选择证书',
            },
            'x-validator': [
              {
                required: true,
                message: '请选择证书',
              },
            ],
            'x-reactions': [
              '{{useAsyncDataSource(getCertificateList)}}',
              {
                dependencies: ['.securityMode'],
                fulfill: {
                  state: {
                    visible: '{{$deps[0]==="SignAndEncrypt" || $deps[0]==="Sign"}}',
                  },
                },
              },
            ],
          },
          'configuration.authType': {
            title: '权限认证',
            'x-component': 'RadioCard',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
            },
            default: 'anonymous',
            'x-component-props': {
              model: 'singular',
              itemStyle: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                minWidth: '130px',
              },
              placeholder: '请选择权限认证',
            },
            'x-validator': [
              {
                required: true,
                message: '请选择权限认证',
              },
            ],
            'x-reactions': [
              // '{{useAsyncDataSource(getAuthTypeList)}}',
              {
                dependencies: ['..provider'],
                fulfill: {
                  state: {
                    visible: '{{$deps[0]==="OPC_UA"}}',
                    componentProps: {
                      model: 'singular',
                      itemStyle: {
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-around',
                        minWidth: '130px',
                        height: '50px',
                      },
                      placeholder: '请选择权限认证',
                      options: [...authTypeList],
                    },
                  },
                },
              },
            ],
          },
          'configuration.username': {
            title: '用户名',
            'x-component': 'Input',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              placeholder: '请输入用户名',
            },
            'x-validator': [
              {
                required: true,
                message: '请输入用户名',
              },
              {
                max: 64,
                message: '最多可输入64个字符',
              },
            ],
            'x-reactions': {
              dependencies: ['.authType'],
              fulfill: {
                state: {
                  visible: '{{$deps[0]==="username"}}',
                },
              },
            },
          },
          'configuration.password': {
            title: '密码',
            'x-component': 'Password',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              placeholder: '请输入密码',
            },
            'x-validator': [
              {
                required: true,
                message: '请输入密码',
              },
              {
                max: 64,
                message: '最多可输入64个字符',
              },
            ],
            'x-reactions': {
              dependencies: ['.authType'],
              fulfill: {
                state: {
                  visible: '{{$deps[0]==="username"}}',
                },
              },
            },
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
    const value = await form.submit<ChannelItem>();
    // setLoading(true);
    const response: any = props.data?.id
      ? await service.updateChannel(props.data?.id, { ...props.data, ...value })
      : await service.saveChannel({ ...props.data, ...value });
    // setLoading(false);
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
          // loading={loading}
        >
          确定
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <SchemaField
          schema={schema}
          scope={{
            useAsyncDataSource,
            getSecurityPolicyList,
            // getAuthTypeList,
            getSecurityModesList,
            getCertificateList,
          }}
        />
      </Form>
    </Modal>
  );
};
