import useDomFullHeight from '@/hooks/document/useDomFullHeight';
import { createForm, Field, FormPath, onFieldReact } from '@formily/core';
import { FormProvider, createSchemaField } from '@formily/react';
import { Badge, Button, Card, Empty, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { FormItem, ArrayTable, Editable, Select } from '@formily/antd';
import PermissionButton from '@/components/PermissionButton';
import { DisconnectOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import Service from './service';
import { action } from '@formily/reactive';
import type { Response } from '@/utils/typings';
import './index.less';
import { onlyMessage } from '@/utils/util';
import ChannelTree from './Tree';

interface Props {
  type: 'MODBUS_TCP' | 'OPC_UA';
  data: any;
}
export const service = new Service();

const MapChannel = (props: Props) => {
  const { data, type } = props;
  const { minHeight } = useDomFullHeight('.metadataMap');
  const [empty, setEmpty] = useState<boolean>(false);
  const [reload, setReload] = useState<string>('');
  const [properties, setProperties] = useState<any>([]);
  const [channelList, setChannelList] = useState<any>([]);
  const [visible, setVisible] = useState<boolean>(false);

  const Render = (propsName: any) => {
    const text = properties.find((item: any) => item.metadataId === propsName.value);
    return <>{text?.metadataName}</>;
  };
  const StatusRender = (propsRender: any) => {
    if (propsRender.value) {
      return <Badge status="success" text={'已绑定'} />;
    } else {
      return <Badge status="error" text={'未绑定'} />;
    }
  };
  const remove = async (params: any) => {
    const res = await service.removeMap('device', data.id, [params]);
    if (res.status === 200) {
      onlyMessage('解绑成功');
      setReload('remove');
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
        field.dataSource = resp.result?.map((item: any) => ({
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
    return service.getCollector({
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
    return service.getPoint({
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
      Render,
      ActionButton,
      StatusRender,
    },
  });

  const form = createForm({
    values: {
      requestList: properties,
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

  const save = async (item: any) => {
    const res = await service.saveMap(data.id, type, item);
    if (res.status === 200) {
      onlyMessage('保存成功');
      setReload('save');
    }
  };

  useEffect(() => {
    service
      .getChannel({
        paging: false,
        terms: [
          {
            terms: [
              {
                column: 'provider',
                value: type,
              },
            ],
          },
        ],
      })
      .then((res) => {
        if (res.status === 200) {
          const list = res.result?.map((item: any) => ({
            label: item.name,
            value: item.id,
            provider: item.provider,
          }));
          setChannelList(list);
        }
      });
  }, []);

  useEffect(() => {
    const metadata = JSON.parse(data.metadata || '{}').properties?.map((item: any) => ({
      metadataId: item.id,
      metadataName: `${item.name}(${item.id})`,
      metadataType: 'property',
      name: item.name,
    }));
    if (metadata && metadata.length !== 0) {
      service.getMap('device', data.id).then((res) => {
        if (res.status === 200) {
          // console.log(res.result)
          const array = res.result.reduce((x: any, y: any) => {
            const metadataId = metadata.find((item: any) => item.metadataId === y.metadataId);
            if (metadataId) {
              Object.assign(metadataId, y);
            } else {
              x.push(y);
            }
            return x;
          }, metadata);
          //删除物模型
          const items = array.filter((item: any) => item.metadataName);
          setProperties(items);
          const delList = array.filter((a: any) => !a.metadataName).map((b: any) => b.id);
          //删除后解绑
          if (delList && delList.length !== 0) {
            service.removeMap('device', data.id, delList);
          }
        }
      });
    } else {
      setEmpty(true);
    }
  }, [reload]);

  return (
    <Card className="metadataMap" style={{ minHeight }}>
      {empty ? (
        <Empty description={'暂无数据，请配置物模型'} style={{ marginTop: '10%' }} />
      ) : (
        <>
          <div className="top-button">
            <Button
              style={{ marginRight: 10 }}
              onClick={async () => {
                setVisible(true);
              }}
            >
              批量映射
            </Button>
            <Button
              type="primary"
              onClick={async () => {
                const value: any = await form.submit();
                if (value) {
                  const array = value.requestList.filter((item: any) => item.channelId);
                  save(array);
                }
              }}
            >
              保存
            </Button>
          </div>
          <FormProvider form={form}>
            <SchemaField schema={schema} scope={{ useAsyncDataSource, getCollector, getPoint }} />
          </FormProvider>
        </>
      )}
      {visible && (
        <ChannelTree
          close={() => {
            setVisible(false);
            setReload('map');
          }}
          deviceId={data.id}
          metaData={properties}
          type={type}
        />
      )}
    </Card>
  );
};
export default MapChannel;
