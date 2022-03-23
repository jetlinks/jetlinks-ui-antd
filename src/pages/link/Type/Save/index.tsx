import { PageContainer } from '@ant-design/pro-layout';
// import { useParams } from 'umi';
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
import { useEffect, useMemo, useRef } from 'react';
import type { Field } from '@formily/core';
import { createForm, onFieldValueChange } from '@formily/core';
import { Card } from 'antd';
import styles from './index.less';
import { useAsyncDataSource } from '@/utils/util';
import { service } from '..';
import _ from 'lodash';
import FAutoComplete from '@/components/FAutoComplete';

/**
 *  根据类型过滤配置信息
 * @param data
 * @param type
 */
const filterConfigByType = (data: any[], type: string) => {
  // 只保留ports 包含type的数据
  const _config = data.filter((item) => Object.keys(item.ports).includes(type));
  // 只保留ports的type数据
  return _config.map((i) => {
    i.ports = i.ports[type];
    return i;
  });
};
const Save = () => {
  // const param = useParams<{ id: string }>();

  // const [config, setConfig] = useState<any[]>([]);
  const configRef = useRef([]);

  const getResourcesClusters = () => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const checked = form.getValuesIn('config')?.map((i: any) => i?.nodeName) || [];
    return service.getResourceClusters().then((resp) => {
      // 获取到已经选择的节点名称。然后过滤、通过form.values获取
      return resp.result
        ?.map((item: any) => ({
          label: item.name,
          value: item.id,
        }))
        .filter((j: any) => !checked.includes(j.value));
    });
  };

  useEffect(() => {
    service.getResourcesCurrent().then((resp) => {
      if (resp.status === 200) {
        // setConfig(resp.result);
        // console.log('test', resp);
        configRef.current = resp.result;
      }
    });
  }, []);

  const getResourceById = (id: string, type: string) =>
    service.getResourceClustersById(id).then((resp) => filterConfigByType(resp.result, type));

  // const getAllResources = () =>
  //   service.getAllResources().then((resp) =>
  //     resp.result?.map((item: any) => ({
  //       label: item.clusterNodeId,
  //       value: item.clusterNodeId,
  //     })));

  const form = useMemo(
    () =>
      createForm({
        initialValues: {},
        effects() {
          onFieldValueChange('type', (field, f) => {
            const value = (field as Field).value;
            const _host = filterConfigByType(_.cloneDeep(configRef.current), value);
            f.setFieldState('grid.configuration.panel1.layout2.host', (state) => {
              state.dataSource = _host.map((item) => ({ label: item.host, value: item.host }));
            });
            f.setFieldState('cluster.config.*.host', (state) => {
              state.dataSource = _host.map((item) => item.host);
            });
          });
          onFieldValueChange('grid.configuration.panel1.layout2.host', (field, f1) => {
            const value = (field as Field).value;
            const type = (field.query('type').take() as Field).value;
            const _port = filterConfigByType(_.cloneDeep(configRef.current), type);
            const _host = _port.find((item) => item.host === value);
            f1.setFieldState('grid.configuration.panel1.layout2.port', (state) => {
              state.dataSource = _host?.ports.map((p: any) => ({ label: p, value: p }));
            });
          });
          onFieldValueChange('shareCluster', (field) => {
            const value = (field as Field).value;
            if (!value) {
              // false 获取独立配置的信息
            }
          });
          onFieldValueChange('grid.cluster.config.*.layout2.nodeName', async (field, f3) => {
            const value = (field as Field).value;
            const type = (field.query('type').take() as Field).value;
            const response = await getResourceById(value, type);
            f3.setFieldState(field.query('.host'), (state) => {
              state.dataSource = response.map((item) => ({ label: item.host, value: item.host }));
            });
          });
          onFieldValueChange('grid.cluster.config.*.layout2.host', async (field, f4) => {
            const host = (field as Field).value;
            const value = (field.query('.nodeName').take() as Field).value;
            const type = (field.query('type').take() as Field).value;
            const response = await getResourceById(value, type);
            const _ports = response.find((item) => item.host === host);
            f4.setFieldState(field.query('.port').take(), async (state) => {
              state.dataSource = _ports?.ports?.map((i: any) => ({ label: i, value: i }));
            });
          });
        },
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
      FAutoComplete,
    },
  });

  const formCollapse = FormCollapse.createFormCollapse!();

  const getSupports = () =>
    service.getSupports().then((resp) =>
      resp.result?.map((item: any) => ({
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
      nodeName: {
        title: '节点名称',
        'x-component': 'Select',
        'x-decorator': 'FormItem',
        // 'x-visible': false,
        'x-decorator-props': {
          gridSpan: 1,
          labelAlign: 'left',
          layout: 'vertical',
          tooltip: '绑定到服务器上的网卡地址,绑定到所有网卡:0.0.0.0 /',
        },
        'x-reactions': [
          {
            dependencies: ['....shareCluster'],
            fulfill: {
              state: {
                visible: '{{!$deps[0]}}',
              },
            },
          },
          '{{useAsyncDataSource(getResourcesClusters)}}',
        ],
      },
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
        type: 'number',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
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
          { value: 'DIRECT', label: '不处理' },
          { value: 'delimited', label: '分隔符' },
          { value: 'script', label: '自定义脚本' },
          { value: 'fixed_length', label: '固定长度' },
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
                // maxItems: 2,
                'x-validator': [
                  {
                    maxItems: 2,
                    message: '集群节点已全部配置，请勿重复添加',
                  },
                ],
                items: {
                  type: 'void',
                  'x-component': 'ArrayCollapse.CollapsePanel',
                  'x-component-props': {
                    header: '配置信息',
                  },
                  properties: {
                    index: {
                      type: 'void',
                      'x-component': 'ArrayCollapse.Index',
                    },
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
          <SchemaField
            schema={schema}
            scope={{ formCollapse, useAsyncDataSource, getSupports, getResourcesClusters }}
          />
        </Form>
      </Card>
    </PageContainer>
  );
};

export default Save;
