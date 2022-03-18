import { PageContainer } from '@ant-design/pro-layout';
import { useParams } from 'umi';
import { createSchemaField } from '@formily/react';
import {
  ArrayCollapse,
  Form,
  FormCollapse,
  FormGrid,
  FormItem,
  Input,
  NumberPicker,
  Password,
  Radio,
  Select,
} from '@formily/antd';
import type { ISchema } from '@formily/json-schema';
import { useEffect, useMemo } from 'react';
import { createForm } from '@formily/core';
import { Card } from 'antd';
import styles from './index.less';
import { useAsyncDataSource } from '@/utils/util';
import { service } from '..';

const Save = () => {
  const param = useParams<{ id: string }>();

  useEffect(() => {
    console.log(param.id);
  }, []);

  const form = useMemo(
    () =>
      createForm({
        initialValues: {},
      }),
    [],
  );

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Select,
      Radio,
      NumberPicker,
      Password,
      FormGrid,
      FormCollapse,
      ArrayCollapse,
    },
  });

  const formCollapse = FormCollapse.createFormCollapse!();

  const getSupports = () =>
    service.getSupports().then((resp) =>
      resp.result.map((item: any) => ({
        label: item.name,
        value: item.id,
      })),
    );

  const clusterConfig: ISchema = {
    type: 'void',
    'x-component': 'FormGrid',
    'x-component-props': {
      maxColumns: 3,
      minColumns: 1,
      columnGap: 48,
    },
    properties: {
      host: {
        title: '本地地址',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-decorator-props': {
          gridSpan: 1,
          labelAlign: 'left',
          layout: 'vertical',
          tooltip: '绑定到服务器上的网卡地址,绑定到所有网卡:0.0.0.0 /',
        },
        required: true,
        'x-reactions': {
          //后台获取数据
        },
        'x-validator': ['ipv4'],
      },
      port: {
        title: '本地端口',
        'x-decorator-props': {
          gridSpan: 1,
          labelAlign: 'left',
          tooltip: '监听指定端口的UDP请求',
          layout: 'vertical',
        },
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'NumberPicker',
        'x-validator': [
          {
            max: 65535,
            message: '请输入1-65535之间的整整数',
          },
          {
            min: 1,
            message: '请输入1-65535之间的整整数',
          },
        ],
      },
      publicHost: {
        title: '公网地址',
        'x-decorator-props': {
          gridSpan: 1,
          labelAlign: 'left',
          tooltip: '对外提供访问的地址,内网环境是填写服务器的内网IP地址',
          layout: 'vertical',
        },
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-validator': ['ipv4'],
      },
      publicPort: {
        title: '公网端口',
        'x-decorator-props': {
          gridSpan: 1,
          tooltip: '对外提供访问的端口',
          layout: 'vertical',
          labelAlign: 'left',
        },
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'NumberPicker',
        'x-validator': [
          {
            max: 65535,
            message: '请输入1-65535之间的整整数',
          },
          {
            min: 1,
            message: '请输入1-65535之间的整整数',
          },
        ],
      },
      parserType: {
        // TCP
        required: true,
        title: '粘拆包规则',
        'x-decorator-props': {
          gridSpan: 1,
          tooltip: '处理TCP粘拆包的方式',
          layout: 'vertical',
          labelAlign: 'left',
        },
        'x-visible': false,
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        enum: [
          { label: 'DIRECT', value: '不处理' },
          { label: 'delimited', value: '分隔符' },
          { label: 'script', value: '自定义脚本' },
          { label: 'fixed_length', value: '固定长度' },
        ],
        'x-reactions': {
          dependencies: ['....type'],
          fulfill: {
            state: {
              visible: '{{$deps[0]==="UDP"}}',
            },
          },
        },
      },
    },
  };
  const schema: ISchema = {
    type: 'object',
    properties: {
      grid: {
        type: 'void',
        'x-component': 'FormGrid',
        'x-component-props': {
          maxColumns: 3,
          minColumns: 1,
          columnGap: 48,
        },
        properties: {
          name: {
            title: '名称',
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-decorator-props': {
              gridSpan: 1,
            },
            'x-validator': [
              {
                max: 64,
                message: '最多可输入64个字符',
              },
              {
                required: true,
                message: '请输入名称',
              },
            ],
          },
          type: {
            title: '类型',
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-decorator-props': {
              gridSpan: 1,
            },
            'x-validator': [
              {
                required: true,
                message: '请输入名称',
              },
            ],
            'x-reactions': ['{{useAsyncDataSource(getSupports)}}'],
          },
          shareCluster: {
            title: '集群',
            'x-decorator': 'FormItem',
            'x-component': 'Radio.Group',
            required: true,
            default: true,
            enum: [
              { label: '共享配置', value: true },
              { label: '独立配置', value: false },
            ],
            'x-decorator-props': {
              gridSpan: 3,
              tooltip:
                '共享配置:集群下所有节点共用同一配置\r\n' + '独立配置:集群下不同节点使用不同配置',
            },
          },
          configuration: {
            type: 'void',
            'x-visible': false,
            'x-decorator': 'FormItem',
            'x-component': 'FormCollapse',
            'x-component-props': {
              formCollapse: '{{formCollapse}}',
              className: styles.configuration,
            },
            'x-reactions': {
              dependencies: ['.shareCluster'],
              fulfill: {
                state: {
                  visible: '{{$deps[0]===true}}',
                },
              },
            },
            'x-decorator-props': {
              gridSpan: 3,
            },
            properties: {
              panel1: {
                type: 'void',
                'x-component': 'FormCollapse.CollapsePanel',
                properties: {
                  layout2: clusterConfig,
                },
              },
            },
          },
          cluster: {
            type: 'void',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 3,
            },
            'x-reactions': {
              dependencies: ['.shareCluster'],
              fulfill: {
                state: {
                  visible: '{{$deps[0]===false}}',
                },
              },
            },
            'x-visible': false,
            properties: {
              config: {
                type: 'array',
                'x-component': 'ArrayCollapse',
                'x-decorator': 'FormItem',
                items: {
                  type: 'void',
                  'x-component': 'ArrayCollapse.CollapsePanel',
                  'x-component-props': {
                    header: '字符串数组',
                  },
                  properties: {
                    layout2: clusterConfig,
                    remove: {
                      type: 'void',
                      'x-component': 'ArrayCollapse.Remove',
                    },
                  },
                },
                properties: {
                  addition: {
                    type: 'void',
                    title: '新增',
                    'x-component': 'ArrayCollapse.Addition',
                  },
                },
              },
            },
          },

          // parserType: {
          //   // TCP
          //   title: '粘拆包规则',
          //   'x-decorator-props': {
          //     gridSpan: 3,
          //     tooltip: '',
          //   },
          //   'x-decorator': 'FormItem',
          //   'x-component': 'Select',
          //   enum: [
          //     { label: 'DIRECT', value: '不处理' },
          //     { label: 'delimited', value: '分隔符' },
          //     { label: 'script', value: '自定义脚本' },
          //     { label: 'fixed_length', value: '固定长度' },
          //   ],
          // },
          // // MQTT_C
          // remoteAddress: {
          //   title: '远程地址',
          //   'x-validator': ['ipv4'],
          //   'x-decorator': 'FormItem',
          //   'x-component': 'Input',
          // },
          // remotePort: {
          //   title: '远程端口',
          //   type: 'number',
          //   'x-decorator': 'FormItem',
          //   'x-component': 'NumberPicker',
          //   'x-validator': [
          //     {
          //       max: 65535,
          //       message: '请输入1-65535之间的整整数',
          //     },
          //     {
          //       min: 1,
          //       message: '请输入1-65535之间的整整数',
          //     },
          //
          //   ],
          // },
          // client: {
          //   title: 'client',
          //   'x-decorator': 'FormItem',
          //   'x-component': 'Input',
          // },
          // username: {
          //   title: '用户名',
          //   'x-decorator': 'FormItem',
          //   'x-component': 'Input',
          // },
          // password: {
          //   title: '密码',
          //   'x-decorator': 'FormItem',
          //   'x-component': 'Password',
          // },
          // // MQTT-S
          // maxMessageSize: {
          //   title: '最大消息长度',
          //   'x-decorator': 'FormItem',
          //   'x-component': 'NumberPicker',
          //   'x-decorator-props': {
          //     tooltip: '单次收发消息的最大长度,单位:字节。设置过大可能会影响性能',
          //   },
          // },
          // topicPrefix: {
          //   title: '订阅前缀',
          //   'x-decorator': 'FormItem',
          //   'x-component': 'Input',
          // },
          // // MQTT_C end
          // enableDtls: {
          //   title: '开启DTLS',
          //   'x-decorator': 'FormItem',
          //   'x-component': 'Radio.Group',
          //   required: true,
          //   default: false,
          //   enum: [
          //     { label: '是', value: true },
          //     { label: '否', value: false },
          //   ],
          // },
          description: {
            title: '说明',
            'x-component': 'Input.TextArea',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 3,
            },
            'x-component-props': {
              showCount: true,
              maxLength: 200,
              rows: 5,
            },
          },
        },
      },
    },
  };
  return (
    <PageContainer onBack={() => history.back()}>
      <Card>
        <Form form={form} layout="vertical" style={{ padding: 30 }}>
          <SchemaField schema={schema} scope={{ formCollapse, useAsyncDataSource, getSupports }} />
        </Form>
      </Card>
    </PageContainer>
  );
};

export default Save;
