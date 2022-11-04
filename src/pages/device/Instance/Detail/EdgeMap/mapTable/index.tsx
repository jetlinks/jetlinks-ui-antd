import PermissionButton from '@/components/PermissionButton';
import TitleComponent from '@/components/TitleComponent';
import { DisconnectOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { FormItem, ArrayTable, Editable, Select, NumberPicker } from '@formily/antd';
import { createForm, Field, FormPath, onFieldReact } from '@formily/core';
import type { Response } from '@/utils/typings';
import { FormProvider, createSchemaField } from '@formily/react';
import { action } from '@formily/reactive';
import { Badge, Button, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import MapTree from '../mapTree';
import './index.less';
import { service } from '..';
import { onlyMessage } from '@/utils/util';

interface Props {
  metaData: Record<string, string>[];
  deviceId?: string;
  edgeId: string;
  reload?: any;
  close?: any;
  title?: string;
  formRef?: any;
  productList?: any;
}

const MapTable = (props: Props) => {
  const { metaData, deviceId, reload, edgeId, productList } = props;
  const [visible, setVisible] = useState<boolean>(false);
  const [channelList, setChannelList] = useState<any>([]);

  const remove = async (params: any) => {
    const res = await service.removeMap(edgeId, {
      deviceId: deviceId,
      idList: [params],
    });
    if (res.status === 200) {
      onlyMessage('解绑成功');
      if (props.formRef) {
        props.close();
      } else {
        reload('save');
      }
    }
  };

  const Render = (propsName: any) => {
    const text = metaData.find((item: any) => item.metadataId === propsName.value);
    return <>{text?.metadataName}</>;
  };
  const StatusRender = (propsRender: any) => {
    if (propsRender.value) {
      return <Badge status="success" text={'已绑定'} />;
    } else {
      return <Badge status="error" text={'未绑定'} />;
    }
  };
  const ActionButton = () => {
    const record = ArrayTable.useRecord?.();
    const index = ArrayTable.useIndex?.();
    return (
      <PermissionButton
        isPermission={true}
        style={{ padding: 0 }}
        disabled={!record(index)?.id}
        tooltip={{
          title: '解绑',
        }}
        popConfirm={{
          title: '确认解绑',
          disabled: !record(index)?.id,
          onConfirm: async () => {
            remove(record(index)?.id);
          },
        }}
        key="unbind"
        type="link"
      >
        <DisconnectOutlined />
      </PermissionButton>
    );
  };

  const useAsyncDataSource = (api: any) => (field: Field) => {
    field.loading = true;
    api(field)?.then(
      action.bound!((resp: Response<any>) => {
        field.dataSource = resp.result?.[0]?.map((item: any) => ({
          label: item.name,
          value: item.id,
        }));
        field.loading = false;
      }),
    );
  };

  const getCollector = async (field: Field) => {
    const path = FormPath.transform(
      field.path,
      /\d+/,
      (index) => `requestList.${parseInt(index)}.channelId`,
    );
    const channelId = field.query(path).get('value');
    if (!channelId) return [];
    return service.edgeCollector(edgeId, {
      terms: [
        {
          terms: [
            {
              column: 'channelId',
              value: channelId,
            },
          ],
        },
      ],
    });
  };
  const getPoint = async (field: Field) => {
    const path = FormPath.transform(
      field.path,
      /\d+/,
      (index) => `requestList.${parseInt(index)}.collectorId`,
    );
    const collectorId = field.query(path).get('value');
    if (!collectorId) return [];
    return service.edgePoint(edgeId, {
      terms: [
        {
          terms: [
            {
              column: 'collectorId',
              value: collectorId,
            },
          ],
        },
      ],
    });
  };

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Editable,
      ArrayTable,
      Select,
      NumberPicker,
      Render,
      ActionButton,
      StatusRender,
    },
  });

  const save = async (item: any) => {
    const res = await service.saveMap(edgeId, item);
    if (res.status === 200) {
      onlyMessage('保存成功');
      if (props.formRef) {
        props.close();
      } else {
        reload('save');
      }
    }
  };

  const form = createForm({
    values: {
      requestList: metaData,
    },
    effects: () => {
      onFieldReact('requestList.*.channelId', async (field, f) => {
        const value = (field as Field).value;
        // console.log(field, 'provider')
        if (value) {
          const param = channelList.find((item: any) => item.value === value);
          const providerPath = FormPath.transform(
            field.path,
            /\d+/,
            (index) => `requestList.${parseInt(index)}.provider`,
          );
          f.setFieldState(providerPath, (state) => {
            state.value = param?.provider;
          });
        }
        const path = FormPath.transform(
          field.path,
          /\d+/,
          (index) => `requestList.${parseInt(index)}.collectorId`,
        );
        const path1 = FormPath.transform(
          field.path,
          /\d+/,
          (index) => `requestList.${parseInt(index)}.pointId`,
        );
        f.setFieldState(path, (state) => {
          if (value) {
            state.required = true;
            form.validate();
          } else {
            state.required = false;
            form.validate();
          }
        });
        f.setFieldState(path1, (state) => {
          if (value) {
            state.required = true;
            form.validate();
          } else {
            state.required = false;
            form.validate();
          }
        });
      });
    },
  });
  const add = async () => {
    const value = await props.formRef.validateFields();
    const mapValue: any = await form.submit();
    // console.log(value)
    if (value && mapValue) {
      if (mapValue.requestList.length === 0) {
        onlyMessage('请配置物模型', 'warning');
      } else {
        const formData = {
          ...value,
          productName: productList.find((item: any) => item.id === value.productId).name,
          parentId: edgeId,
          id: deviceId ? deviceId : undefined,
        };
        console.log(formData);
        const res = await service.addDevice(formData);
        if (res.status === 200) {
          const array = mapValue.requestList.filter((item: any) => item.channelId);
          const submitData = {
            deviceId: res.result.id,
            provider: array?.[0]?.provider,
            requestList: array,
          };
          save(submitData);
        }
      }
      console.log(value, mapValue);
    }
  };

  const schema = {
    type: 'object',
    properties: {
      requestList: {
        type: 'array',
        'x-decorator': 'FormItem',
        'x-component': 'ArrayTable',
        'x-component-props': {
          pagination: {
            pageSize: 10,
          },
          scroll: { x: '100%' },
        },
        items: {
          type: 'object',
          properties: {
            column1: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': { width: 200, title: '名称' },
              properties: {
                metadataId: {
                  type: 'string',
                  'x-component': 'Render',
                },
              },
            },
            column2: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': { width: 200, title: '通道' },
              properties: {
                channelId: {
                  type: 'string',
                  'x-decorator': 'FormItem',
                  'x-component': 'Select',
                  'x-component-props': {
                    placeholder: '请选择',
                    showSearch: true,
                    allowClear: true,
                    showArrow: true,
                    filterOption: (input: string, option: any) =>
                      option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0,
                  },
                  enum: channelList,
                },
              },
            },
            column3: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': {
                width: 200,
                title: (
                  <>
                    采集器
                    <Tooltip title="边缘网关代理的真实物理设备">
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </>
                ),
              },
              properties: {
                collectorId: {
                  type: 'string',
                  'x-decorator': 'FormItem',
                  'x-component': 'Select',
                  'x-component-props': {
                    placeholder: '请选择',
                    showSearch: true,
                    allowClear: true,
                    showArrow: true,
                    filterOption: (input: string, option: any) =>
                      option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0,
                  },
                  'x-reactions': ['{{useAsyncDataSource(getCollector)}}'],
                  'x-validator': [
                    {
                      required: true,
                      message: '请选择采集器',
                    },
                  ],
                },
              },
            },
            column4: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': { width: 200, title: '点位' },
              properties: {
                pointId: {
                  type: 'string',
                  'x-decorator': 'FormItem',
                  'x-component': 'Select',
                  'x-component-props': {
                    placeholder: '请选择',
                    showSearch: true,
                    allowClear: true,
                    showArrow: true,
                    filterOption: (input: string, option: any) =>
                      option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0,
                  },
                  'x-reactions': ['{{useAsyncDataSource(getPoint)}}'],
                },
              },
            },
            column5: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': { width: 0 },
              properties: {
                provider: {
                  type: 'string',
                  'x-hidden': true,
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                },
              },
            },
            column6: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': {
                width: 100,
                title: '状态',
                // sorter: (a: any, b: any) => a.state.value.length - b.state.value.length,
              },
              properties: {
                id: {
                  type: 'string',
                  'x-decorator': 'FormItem',
                  'x-component': 'StatusRender',
                },
              },
            },
            column7: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': {
                title: '操作',
                dataIndex: 'operations',
                width: 50,
                fixed: 'right',
              },
              properties: {
                item: {
                  type: 'void',
                  'x-component': 'FormItem',
                  properties: {
                    remove: {
                      type: 'void',
                      'x-component': 'ActionButton',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  useEffect(() => {
    service.edgeChannel(edgeId).then((res) => {
      if (res.status === 200) {
        const list = res.result?.[0].map((item: any) => ({
          label: item.name,
          value: item.id,
          provider: item.provider,
        }));
        setChannelList(list);
      }
    });
  }, []);

  return (
    <div>
      <div className="top-button">
        {props.title && <TitleComponent data={props.title} />}
        <Button
          style={{ marginRight: 10 }}
          onClick={() => {
            setVisible(true);
          }}
        >
          批量映射
        </Button>
        <Button
          type="primary"
          onClick={async () => {
            if (props.formRef) {
              add();
            } else {
              const value: any = await form.submit();
              const array = value.requestList.filter((item: any) => item.channelId);
              const submitData = {
                deviceId: deviceId,
                provider: array[0].provider,
                requestList: array,
              };
              save(submitData);
            }
          }}
        >
          保存
        </Button>
      </div>
      <div>
        <FormProvider form={form}>
          <SchemaField schema={schema} scope={{ useAsyncDataSource, getCollector, getPoint }} />
        </FormProvider>
      </div>
      {visible && (
        <MapTree
          close={() => {
            setVisible(false);
            reload('map');
          }}
          deviceId={deviceId || ''}
          edgeId={edgeId}
          metaData={metaData}
        />
      )}
    </div>
  );
};
export default MapTable;
