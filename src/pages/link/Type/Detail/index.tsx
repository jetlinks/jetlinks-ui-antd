import { PageContainer } from '@ant-design/pro-layout';
import { createSchemaField, observer } from '@formily/react';
import {
  ArrayCollapse,
  Form,
  FormButtonGroup,
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
import { Field, FieldDataSource } from '@formily/core';
import { createForm, onFieldReact, onFieldValueChange } from '@formily/core';
import { Card } from 'antd';
import styles from './index.less';
import { onlyMessage, useAsyncDataSource } from '@/utils/util';
import { service } from '../index';
import _ from 'lodash';
import FAutoComplete from '@/components/FAutoComplete';
import { Store } from 'jetlinks-store';
import { PermissionButton } from '@/components';
import usePermissions from '@/hooks/permission';
import { action } from '@formily/reactive';

/**
 *  根据类型过滤配置信息
 * @param data
 * @param type
 */
const filterConfigByType = (data: any[], type: string) => {
  const tcpList = ['TCP_SERVER', 'WEB_SOCKET_SERVER', 'HTTP_SERVER', 'MQTT_SERVER'];
  const udpList = ['UDP', 'COAP_SERVER'];

  let _temp = type;
  if (tcpList.includes(type)) {
    _temp = 'TCP';
  } else if (udpList.includes(type)) {
    _temp = 'UDP';
  }
  // 只保留ports 包含type的数据
  const _config = data?.filter((item) => Object.keys(item.ports).includes(_temp));
  // 只保留ports的type数据
  return _config?.map((i) => {
    i.ports = i.ports[_temp];
    return i;
  });
};
const Save = observer(() => {
  // const param = useParams<{ id: string }>();

  const configRef = useRef([]);

  useEffect(() => {
    service.getResourcesCurrent().then((resp) => {
      if (resp.status === 200) {
        // setConfig(resp.result);
        // console.log('test', resp);
        configRef.current = resp.result;
      }
    });
  }, []);

  const useAsyncData = (services: (arg0: Field) => Promise<FieldDataSource>) => (field: Field) => {
    field.loading = true;
    services(field).then(
      action.bound!((resp: any) => {
        const save = location.href.split('/');
        if (save[save.length - 1] === ':id') {
          field.value = resp[0].value;
        }
        field.dataSource = resp;
        field.loading = false;
      }),
    );
  };

  const getResourcesClusters = () => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const checked = form.getValuesIn('cluster')?.map((i: any) => i?.serverId) || [];
    // cache resourcesCluster
    if (Store.get('resources-cluster')?.length > 0) {
      return new Promise((resolve) => {
        resolve(Store.get('resources-cluster').filter((j: any) => !checked.includes(j.value)));
      });
    } else {
      return service.getResourceClusters().then((resp) => {
        const _data = resp.result?.map((item: any) => ({
          label: item.name,
          value: item.id,
        }));
        Store.set('resources-cluster', _data);
        return _data.filter((j: any) => !checked.includes(j.value));
      });
    }
  };
  const getCertificates = () =>
    service.getCertificates().then((resp: any) =>
      resp.result?.map((item: any) => ({
        label: item.name,
        value: item.id,
      })),
    );

  const getResourceById = (id: string, type: string) =>
    service.getResourceClustersById(id).then((resp) => filterConfigByType(resp.result, type));

  const form = useMemo(
    () =>
      createForm({
        // readPretty: true,
        // initialValues: {},
        effects() {
          onFieldValueChange('type', (field, f) => {
            const value = (field as Field).value;
            // console.log(field)
            if (f.modified) {
              f.deleteValuesIn('configuration');
              f.deleteValuesIn('cluster');
              f.clearErrors();
              // 设置默认值
              f.setFieldState('grid.configuration.panel1.layout2.host', (state) => {
                state.value = '0.0.0.0';
                state.disabled = true;
              });
            }
            const _host = filterConfigByType(_.cloneDeep(configRef.current), value);
            f.setFieldState('grid.configuration.panel1.layout2.host', (state) => {
              state.dataSource = _host.map((item) => ({ label: item.host, value: item.host }));
            });
            f.setFieldState('cluster.config.*.host', (state) => {
              state.dataSource = _host.map((item) => ({ label: item.host, value: item.host }));
            });
          });
          onFieldReact('grid.configuration.panel1.layout2.host', async (field, f1) => {
            const value = (field as Field).value;
            const type = (field.query('type').take() as Field).value;
            const resp = await service.getResourcesCurrent();
            const current = resp?.result;
            const _port = filterConfigByType(_.cloneDeep(current), type);
            const _host = _port.find((item) => item.host === value);
            f1.setFieldState('grid.configuration.panel1.layout2.port', (state) => {
              state.dataSource = _host?.ports.map((p: any) => ({ label: p, value: p }));
            });
          });
          onFieldValueChange('shareCluster', (field, f5) => {
            const value = (field as Field).value;
            if (value) {
              // 共享配置
              f5.setFieldState('grid.configuration.panel1.layout2.host', (state) => {
                state.value = '0.0.0.0';
                state.disabled = true;
              });
            } else {
              // 独立配置
              f5.setFieldState('grid.cluster.cluster', (state) => {
                state.value = [{}];
              });
            }
          });
          onFieldValueChange('grid.cluster.cluster.*.layout2.serverId', async (field, f3) => {
            const value = (field as Field).value;
            const type = (field.query('type').take() as Field).value;
            const response = await getResourceById(value, type);
            f3.setFieldState(field.query('.host'), (state) => {
              state.dataSource = response.map((item) => ({ label: item.host, value: item.host }));
            });
          });
          onFieldValueChange('grid.cluster.cluster.*.layout2.host', async (field, f4) => {
            const host = (field as Field).value;
            const value = (field.query('.serverId').take() as Field).value;
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

  useEffect(() => {
    const subscription = Store.subscribe('current-network-data', (data) => {
      if (!data) return;
      // form.readPretty = true;
      const _data = _.cloneDeep(data);
      // 处理一下集群模式数据
      if (!_data.shareCluster) {
        _data.cluster = _data.cluster?.map((item: any) => ({ ...item.configuration }));
      }
      form.setValues(_data);
    });
    return () => {
      subscription.unsubscribe();
      Store.set('current-network-data', undefined);
    };
  }, []);

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
      serverId: {
        title: '节点名称',
        'x-component': 'Select',
        'x-decorator': 'FormItem',
        // 'x-visible': false,
        'x-decorator-props': {
          gridSpan: 1,
          labelAlign: 'left',
          layout: 'vertical',
        },
        'x-component-props': {
          placeholder: '请选择节点名称',
        },
        'x-reactions': [
          {
            dependencies: ['shareCluster'],
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
        'x-component-props': {
          placeholder: '请选择本地地址',
        },
        'x-decorator-props': {
          gridSpan: 1,
          labelAlign: 'left',
          layout: 'vertical',
          tooltip: '绑定到服务器上的网卡地址,绑定到所有网卡:0.0.0.0',
        },
        required: true,
        'x-reactions': {
          dependencies: ['type'],
          fulfill: {
            state: {
              // visible: '{{$deps[0]==="UDP"}}',
              visible:
                '{{["COAP_SERVER","MQTT_SERVER","WEB_SOCKET_SERVER","TCP_SERVER","UDP","HTTP_SERVER"].includes($deps[0])}}',
            },
          },
        },
        'x-validator': ['ipv4'],
      },
      port: {
        title: '本地端口',
        'x-decorator-props': {
          gridSpan: 1,
          labelAlign: 'left',
          tooltip: '监听指定端口的请求',
          layout: 'vertical',
        },
        required: true,
        type: 'number',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-component-props': {
          placeholder: '请选择本地端口',
        },
        'x-reactions': {
          dependencies: ['type'],
          fulfill: {
            state: {
              // visible: '{{$deps[0]==="UDP"}}',
              visible:
                '{{["COAP_SERVER","MQTT_SERVER","WEB_SOCKET_SERVER","TCP_SERVER","UDP","HTTP_SERVER"].includes($deps[0])}}',
            },
          },
        },
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
        'x-component-props': {
          placeholder: '请输入公网地址',
        },
        'x-reactions': {
          dependencies: ['type'],
          fulfill: {
            state: {
              // visible: '{{$deps[0]==="UDP"}}',
              visible:
                '{{["COAP_SERVER","MQTT_SERVER","WEB_SOCKET_SERVER","TCP_SERVER","UDP","HTTP_SERVER"].includes($deps[0])}}',
            },
          },
        },
      },
      publicPort: {
        title: '公网端口',
        'x-decorator-props': {
          gridSpan: 1,
          tooltip: '对外提供访问的端口',
          layout: 'vertical',
          labelAlign: 'left',
        },
        'x-component-props': {
          placeholder: '请输入公网端口',
        },
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'NumberPicker',
        'x-reactions': {
          dependencies: ['type'],
          fulfill: {
            state: {
              // visible: '{{$deps[0]==="UDP"}}',
              visible:
                '{{["COAP_SERVER","MQTT_SERVER","WEB_SOCKET_SERVER","TCP_SERVER","UDP","HTTP_SERVER"].includes($deps[0])}}',
            },
          },
        },
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
      mqttClient: {
        type: 'void',
        'x-reactions': {
          dependencies: ['type'],
          fulfill: {
            state: {
              // visible: '{{$deps[0]==="UDP"}}',
              visible: '{{["MQTT_CLIENT"].includes($deps[0])}}',
            },
          },
        },
        properties: {
          remoteHost: {
            title: '远程地址',
            'x-decorator-props': {
              gridSpan: 1,
              layout: 'vertical',
              labelAlign: 'left',
            },
            'x-component-props': {
              placeholder: '请输入远程地址',
            },
            required: true,
            'x-validator': ['ipv4'],
            'x-decorator': 'FormItem',
            'x-component': 'Input',
          },
          remotePort: {
            title: '远程端口',
            'x-decorator-props': {
              gridSpan: 1,
              layout: 'vertical',
              labelAlign: 'left',
            },
            'x-component-props': {
              placeholder: '请输入远程端口',
            },
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'NumberPicker',
          },
          clientId: {
            title: 'clientId',
            'x-decorator-props': {
              gridSpan: 1,
              layout: 'vertical',
              labelAlign: 'left',
            },
            'x-component-props': {
              placeholder: '请输入ClientId',
            },
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
          },
          username: {
            title: '用户名',
            'x-decorator-props': {
              gridSpan: 1,
              layout: 'vertical',
              labelAlign: 'left',
            },
            'x-component-props': {
              placeholder: '请输入用户名',
            },
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
          },
          password: {
            title: '密码',
            'x-component-props': {
              placeholder: '请输入密码',
            },
            'x-decorator-props': {
              gridSpan: 1,
              layout: 'vertical',
              labelAlign: 'left',
            },
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
          },
          maxMessageSize: {
            title: '最大消息长度',
            'x-decorator-props': {
              gridSpan: 1,
              tooltip: '单次收发消息的最大长度,单位:字节;设置过大可能会影响性能',
              layout: 'vertical',
              labelAlign: 'left',
            },
            'x-component-props': {
              placeholder: '请输入最大消息长度',
            },
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
          },
          topicPrefix: {
            title: '订阅前缀',
            'x-component-props': {
              placeholder: '请输入订阅前缀',
            },
            'x-decorator-props': {
              gridSpan: 1,
              tooltip: '当连接的服务为EMQ时,可能需要使用共享的订阅前缀,如:$queue或$share',
              layout: 'vertical',
              labelAlign: 'left',
            },
            'x-decorator': 'FormItem',
            'x-component': 'Input',
          },
        },
      },
      maxMessageSize: {
        title: '最大消息长度',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-decorator-props': {
          gridSpan: 1,
          labelAlign: 'left',
          tooltip: '单次收发消息的最大长度,单位:字节;设置过大可能会影响性能',
          layout: 'vertical',
        },
        'x-component-props': {
          placeholder: '请输入最大消息长度',
        },
        'x-reactions': {
          dependencies: ['type'],
          fulfill: {
            state: {
              // visible: '{{$deps[0]==="UDP"}}',
              visible: '{{["MQTT_SERVER"].includes($deps[0])}}',
            },
          },
        },
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
        'x-component-props': {
          placeholder: '请选择粘拆包规则',
        },
        enum: [
          { value: 'DIRECT', label: '不处理' },
          { value: 'delimited', label: '分隔符' },
          { value: 'script', label: '自定义脚本' },
          { value: 'fixed_length', label: '固定长度' },
        ],
        'x-reactions': {
          dependencies: ['type'],
          fulfill: {
            state: {
              // visible: '{{$deps[0]==="UDP"}}',
              visible: '{{["TCP_SERVER"].includes($deps[0])}}',
            },
          },
        },
      },
      secure: {
        title: '开启DTLS',
        'x-decorator': 'FormItem',
        'x-component': 'Radio.Group',
        'x-decorator-props': {
          gridSpan: 1,
          labelAlign: 'left',
          layout: 'vertical',
        },
        required: true,
        default: false,
        enum: [
          { label: '是', value: true },
          { label: '否', value: false },
        ],
      },
      certId: {
        title: '证书',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-component-props': {
          placeholder: '请选择证书',
        },
        'x-decorator-props': {
          gridSpan: 1,
          labelAlign: 'left',
          layout: 'vertical',
        },
        required: true,
        'x-reactions': [
          '{{useAsyncDataSource(getCertificates)}}',
          {
            dependencies: ['..secure'],
            fulfill: {
              state: {
                visible: '{{$deps[0]===true}}',
              },
            },
          },
        ],
      },
      privateKeyAlias: {
        title: '私钥别名',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: '请输入私钥别名',
        },
        'x-decorator-props': {
          gridSpan: 1,
          labelAlign: 'left',
          layout: 'vertical',
        },
        required: true,
        'x-validator': [
          {
            max: 64,
            message: '最多可输入64个字符',
          },
          {
            required: true,
            message: '请输入私钥别名',
          },
        ],
        'x-reactions': {
          dependencies: ['..secure'],
          fulfill: {
            state: {
              visible: '{{$deps[0]===true}}',
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
            'x-component-props': {
              placeholder: '请输入名称',
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
            'x-component-props': {
              placeholder: '请选择类型',
            },
            default: {},
            'x-validator': [
              {
                required: true,
                message: '请输入名称',
              },
            ],
            'x-reactions': ['{{useAsyncData(getSupports)}}'],
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
            type: 'object',
            // 'x-visible': false,
            'x-decorator': 'FormItem',
            'x-component': 'FormCollapse',
            'x-component-props': {
              formCollapse: '{{formCollapse}}',
              className: styles.configuration,
            },
            'x-reactions': [
              {
                dependencies: ['.shareCluster', 'type'],
                fulfill: {
                  state: {
                    visible: '{{!!$deps[1]&&$deps[0]===true}}',
                  },
                },
              },
            ],
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
              dependencies: ['.shareCluster', 'type'],
              fulfill: {
                state: {
                  visible: '{{!!$deps[1]&&$deps[0]===false}}',
                },
              },
            },
            'x-visible': false,
            properties: {
              cluster: {
                type: 'array',
                'x-component': 'ArrayCollapse',
                'x-decorator': 'FormItem',
                items: {
                  type: 'object',
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
          description: {
            title: '说明',
            'x-component': 'Input.TextArea',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 3,
            },
            'x-component-props': {
              placeholder: '请输入说明',
              showCount: true,
              maxLength: 200,
              rows: 5,
            },
          },
        },
      },
    },
  };

  const handleSave = async () => {
    const data: any = await form.submit();
    if (data.shareCluster === false) {
      data.cluster = data.cluster?.map((item: any) => ({
        serverId: item.serverId,
        configuration: item,
      }));
    }
    const response: any = data.id ? await service.update(data) : await service.save(data);
    if (response.status === 200) {
      onlyMessage('保存成功');
      history.back();
      if ((window as any).onTabSaveSuccess) {
        if (response.result?.id) {
          service.changeState(response.result?.id, 'start').then(() => {
            (window as any).onTabSaveSuccess(response);
            setTimeout(() => window.close(), 300);
          });
        }
      }
    }
  };

  const { getOtherPermission } = usePermissions('link/Type');
  return (
    <PageContainer>
      <Card>
        <Form form={form} layout="vertical" style={{ padding: 30 }}>
          <SchemaField
            schema={schema}
            scope={{
              formCollapse,
              useAsyncDataSource,
              useAsyncData,
              getSupports,
              getResourcesClusters,
              getCertificates,
            }}
          />
          <FormButtonGroup.Sticky>
            <FormButtonGroup.FormItem>
              <PermissionButton
                type="primary"
                isPermission={getOtherPermission(['add', 'update'])}
                onClick={() => handleSave()}
              >
                保存
              </PermissionButton>
            </FormButtonGroup.FormItem>
          </FormButtonGroup.Sticky>
        </Form>
      </Card>
    </PageContainer>
  );
});

export default Save;
