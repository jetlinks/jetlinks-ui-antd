import { ProTableCard } from '@/components';
import SearchComponent from '@/components/SearchComponent';
import type { DeviceInstance } from '@/pages/device/Instance/typings';
import { useEffect, useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import { service } from '@/pages/device/Instance/index';
import { SceneDeviceCard } from '@/components/ProTableCard/CardItems/device';
import { isNoCommunity } from '@/utils/util';
import { useIntl } from 'umi';
import { service as categoryService } from '@/pages/device/Category';
// import { service as deptService } from '@/pages/system/Department';
import DeviceModel from '../model';
import { observer } from '@formily/reactive-react';
import { Form, TreeSelect } from 'antd';
import '../index.less';
import TopCard from './TopCard';
// import { ExclamationCircleOutlined } from '@ant-design/icons';
import { FormModel } from '../../..';
import { BuiltInParamsHandleTreeData } from '@/pages/rule-engine/Scene/Save/components/BuiltInParams';
import { queryBuiltInParams } from '@/pages/rule-engine/Scene/Save/action/service';
import RelationSelect from '../../device/relationSelect';
import { getRelations } from '@/pages/rule-engine/Scene/Save/action/service';
import Tag from './Tag';

interface Props {
  name: number;
  parallel: boolean;
  thenName: number;
  branchGroup?: number;
  formProductId: any;
}

export default observer((props: Props) => {
  const actionRef = useRef<ActionType>();
  const intl = useIntl();
  const [searchParam, setSearchParam] = useState({});
  const [form] = Form.useForm();
  const [builtInList, setBuiltInList] = useState<any[]>([]);
  const selector = Form.useWatch('selector', form);
  const [tagList, setTagList] = useState([]);
  const [list, setList] = useState<any>([]);
  const [isFirst, setIsFirst] = useState(true);
  const [oldRowKey] = useState(DeviceModel.deviceId);

  const TypeList = [
    {
      label: '自定义',
      value: 'fixed',
      image: require('/public/images/scene/device-custom.png'),
      tip: '自定义选择当前产品下的任意设备',
    },
    {
      label: '按关系',
      value: 'relation',
      image: require('/public/images/scene/device-relation.png'),
      tip: '选择与触发设备具有相同关系的设备',
    },
    {
      label: '按标签',
      value: 'tag',
      image: require('/public/images/scene/device-tag.png'),
      tip: '按标签选择产品下具有特定标签的设备',
    },
    {
      label: '按变量',
      value: 'variable',
      image: require('/public/images/scene/device-variable.png'),
      tip: '选择设备ID为上游变量值的设备',
    },
  ];

  const columns: ProColumns<DeviceInstance>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 300,
      ellipsis: true,
      fixed: 'left',
    },
    {
      title: intl.formatMessage({
        id: 'pages.table.deviceName',
        defaultMessage: '设备名称',
      }),
      dataIndex: 'name',
      ellipsis: true,
      width: 200,
    },
    {
      title: intl.formatMessage({
        id: 'pages.table.productName',
        defaultMessage: '产品名称',
      }),
      dataIndex: 'productId',
      width: 200,
      ellipsis: true,
      hideInSearch: true,
      valueType: 'select',
      request: async () => {
        const res = await service.getProductList();
        if (res.status === 200) {
          return res.result.map((pItem: any) => ({ label: pItem.name, value: pItem.id }));
        }
        return [];
      },
      render: (_, row) => row.productName,
      filterMultiple: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: '200px',
      valueType: 'dateTime',
    },
    {
      title: intl.formatMessage({
        id: 'pages.searchTable.titleStatus',
        defaultMessage: '状态',
      }),
      dataIndex: 'state',
      width: '90px',
      valueType: 'select',
      valueEnum: {
        notActive: {
          text: intl.formatMessage({
            id: 'pages.device.instance.status.notActive',
            defaultMessage: '禁用',
          }),
          status: 'notActive',
        },
        offline: {
          text: intl.formatMessage({
            id: 'pages.device.instance.status.offLine',
            defaultMessage: '离线',
          }),
          status: 'offline',
        },
        online: {
          text: intl.formatMessage({
            id: 'pages.device.instance.status.onLine',
            defaultMessage: '在线',
          }),
          status: 'online',
        },
      },
      filterMultiple: false,
    },
    {
      dataIndex: 'classifiedId',
      title: '产品分类',
      valueType: 'treeSelect',
      hideInTable: true,
      hideInSearch: true,
      fieldProps: {
        fieldNames: {
          label: 'name',
          value: 'id',
        },
      },
      request: () =>
        categoryService
          .queryTree({
            paging: false,
          })
          .then((resp: any) => resp.result),
    },
    {
      title: '网关类型',
      dataIndex: 'accessProvider',
      hideInSearch: true,
      width: 150,
      ellipsis: true,
      valueType: 'select',
      hideInTable: true,
      request: () =>
        service.getProviders().then((resp: any) => {
          return (resp?.result || [])
            .filter((i: any) =>
              !isNoCommunity
                ? [
                    'mqtt-server-gateway',
                    'http-server-gateway',
                    'mqtt-client-gateway',
                    'tcp-server-gateway',
                  ].includes(i.id)
                : i,
            )
            .map((item: any) => ({
              label: item.name,
              value: `accessProvider is ${item.id}`,
            }));
        }),
    },
    {
      dataIndex: 'productId$product-info',
      title: '接入方式',
      valueType: 'select',
      hideInSearch: true,
      hideInTable: true,
      request: () =>
        service.queryGatewayList().then((resp: any) =>
          resp.result.map((item: any) => ({
            label: item.name,
            value: `accessId is ${item.id}`,
          })),
        ),
    },
    {
      dataIndex: 'deviceType',
      title: '设备类型',
      valueType: 'select',
      hideInTable: true,
      hideInSearch: true,
      valueEnum: {
        device: {
          text: '直连设备',
          status: 'device',
        },
        childrenDevice: {
          text: '网关子设备',
          status: 'childrenDevice',
        },
        gateway: {
          text: '网关设备',
          status: 'gateway',
        },
      },
    },
  ];

  const filterTree = (nodes: any[]) => {
    if (!nodes?.length) {
      return nodes;
    }
    return nodes.filter((it) => {
      if (
        it.children.find(
          (item: any) => item.id.indexOf('deviceId' || 'device_id' || 'device_Id') > -1,
        ) &&
        !it.children.find((item: any) => item.id.indexOf('bolaen') > -1)
      ) {
        return true;
      }
      return false;
    });
  };

  const sourceChangeEvent = async () => {
    // const params = props.name - 1 >= 0 ? { action: props.name - 1 } : undefined;
    const _params = {
      branch: props.thenName,
      branchGroup: props.branchGroup,
      action: props.name - 1,
    };
    queryBuiltInParams(FormModel.current, _params).then((res: any) => {
      if (res.status === 200) {
        const _data = BuiltInParamsHandleTreeData(res.result);
        const array = filterTree(_data);
        // console.log('--------', array);
        //判断相同产品才有按变量
        if (props.formProductId === DeviceModel.productId) {
          setBuiltInList(array);
        } else {
          setBuiltInList([]);
        }
      }
    });
  };

  const filterType = async () => {
    const _list = TypeList.filter((item) => item.value === 'fixed');
    if (FormModel.current.trigger?.type === 'device') {
      //关系
      const res = await getRelations();
      if (res.status === 200 && res.result.length !== 0) {
        const array = TypeList.filter((item) => item.value === 'relation');
        _list.push(...array);
      }
      //标签
      const tag = JSON.parse(DeviceModel.productDetail?.metadata || '{}')?.tags;
      if (tag && tag.length !== 0) {
        const array = TypeList.filter((item) => item.value === 'tag');
        _list.push(...array);
      }
      //变量
      if (builtInList.length !== 0 && !props.parallel && props.name !== 0) {
        const array = TypeList.filter((item) => item.value === 'variable');
        _list.push(...array);
      }
      setList(_list);
    } else {
      if (builtInList.length !== 0 && !props.parallel && props.name !== 0) {
        const array = TypeList.filter((item) => item.value === 'variable');
        _list.push(...array);
      }
      setList(_list);
    }
  };

  const contentRender = (type?: string) => {
    switch (type) {
      //自定义
      case 'fixed':
        return (
          <>
            <SearchComponent
              field={columns}
              model={'simple'}
              bodyStyle={{ padding: 0, paddingBottom: 16 }}
              enableSave={false}
              onSearch={async (data) => {
                actionRef.current?.reset?.();
                setSearchParam(data);
              }}
              target="device"
              defaultParam={[
                {
                  terms: [
                    {
                      column: 'productId',
                      value: DeviceModel.productId,
                    },
                  ],
                },
              ]}
            />
            <div>
              <ProTableCard<DeviceInstance>
                noPadding
                cardScrollY={460}
                actionRef={actionRef}
                columns={columns}
                rowKey="id"
                search={false}
                gridColumn={2}
                columnEmptyText={''}
                onlyCard={true}
                tableAlertRender={false}
                rowSelection={{
                  type: 'radio',
                  selectedRowKeys: [DeviceModel.deviceId],
                  onChange: (_, selectedRows) => {
                    if (!isFirst) {
                      if (selectedRows.length) {
                        const item = selectedRows?.[0];
                        DeviceModel.deviceId = item.id;
                        DeviceModel.deviceDetail = item;
                        DeviceModel.selectorValues = [
                          { value: DeviceModel.deviceId, name: item.name },
                        ];
                      } else {
                        DeviceModel.deviceId = '';
                        DeviceModel.selectorValues = [];
                      }
                    } else {
                      setIsFirst(false);
                    }
                  },
                }}
                request={(params) => {
                  const sorts: any = [];

                  if (oldRowKey) {
                    sorts.push({
                      name: 'id',
                      value: oldRowKey,
                    });
                  }
                  sorts.push({ name: 'createTime', order: 'desc' });
                  return service.query({
                    ...params,
                    sorts: sorts,
                  });
                }}
                params={searchParam}
                cardRender={(record) => (
                  <SceneDeviceCard showBindBtn={false} showTool={false} {...record} />
                )}
                height={'none'}
              />
            </div>
          </>
        );
      case 'relation':
        return (
          <Form.Item
            name="selectorValues"
            label="关系"
            rules={[{ required: true, message: '请选择关系人' }]}
          >
            <RelationSelect
              onChange={(value, options) => {
                // console.log(value,options)
                if (value) {
                  DeviceModel.deviceId = 'deviceId';
                  DeviceModel.source = 'upper';
                  DeviceModel.selectorValues = value;
                  DeviceModel.upperKey = 'deviceId';
                  DeviceModel.relationName = options.label;
                }
              }}
            />
          </Form.Item>
        );
      case 'tag':
        return (
          <Form.Item
            name="selectorValues"
            // label='标签'
            rules={[{ required: true, message: '请选择标签' }]}
          >
            <Tag
              tagData={tagList}
              onChange={(value) => {
                console.log(value);
                if (value) {
                  DeviceModel.deviceId = 'deviceId';
                  DeviceModel.source = 'fixed';
                  DeviceModel.selectorValues = value;
                }
              }}
            />
          </Form.Item>
        );
      default:
        return (
          <>
            <Form.Item name="selectorValues" label="变量" required>
              <TreeSelect
                style={{ width: '100%', height: '100%' }}
                treeData={builtInList}
                fieldNames={{ label: 'name', value: 'id' }}
                placeholder={'请选择参数'}
                onSelect={(value: any, node: any) => {
                  // console.log(value, node);
                  DeviceModel.deviceId = value;
                  DeviceModel.deviceDetail = node;
                  DeviceModel.selectorValues = [{ value: value, name: node.description }];
                }}
              />
            </Form.Item>
          </>
        );
    }
  };

  useEffect(() => {
    if (form) {
      form.setFieldsValue({ selector: DeviceModel.selector });
    }
    sourceChangeEvent();
    if (DeviceModel.deviceId) {
      service.detail(DeviceModel.deviceId).then((res) => {
        if (res.status === 200) {
          DeviceModel.deviceDetail = res.result || {};
        }
      });
    }
  }, []);

  useEffect(() => {
    if (DeviceModel.productDetail) {
      const metadata = JSON.parse(DeviceModel.productDetail?.metadata || '{}');
      setTagList(metadata.tags);
      filterType();
    }
    //处理变量
    if (builtInList && builtInList.length !== 0) {
      const param = DeviceModel.selectorValues?.[0]?.value;
      const isVariable = builtInList.find((item: any) => {
        return item.children.find((i: any) => i.id === param);
      });
      if (isVariable) {
        form.setFieldsValue({ selector: 'variable' });
      }
      console.log(isVariable);
    }
  }, [DeviceModel.productDetail, builtInList]);

  useEffect(() => {
    DeviceModel.selector = selector;
  }, [selector]);

  return (
    <div>
      <Form form={form} layout={'vertical'}>
        <Form.Item name="selector" label="选择方式" required hidden={list.length === 1}>
          <TopCard
            typeList={list}
            onChange={(value) => {
              if (value) {
                form.resetFields(['selectorValues']);
              }
            }}
          />
        </Form.Item>
        {contentRender(selector)}
      </Form>
    </div>
  );
});
