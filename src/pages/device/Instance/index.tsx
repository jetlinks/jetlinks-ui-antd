import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import type { DeviceInstance } from '@/pages/device/Instance/typings';
import moment from 'moment';
import { Badge, Button, Dropdown, Menu, message, Popconfirm, Tooltip } from 'antd';
import { useRef, useState } from 'react';
import { Link } from 'umi';
import {
  CheckCircleOutlined,
  DeleteOutlined,
  ExportOutlined,
  ImportOutlined,
  PlusOutlined,
  SearchOutlined,
  StopOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { model } from '@formily/reactive';
import Service from '@/pages/device/Instance/service';
import type { MetadataItem } from '@/pages/device/Product/typings';
import { useIntl } from '@@/plugin-locale/localeExports';
import Save from './Save';
import Export from './Export';
import Import from './Import';
import Process from './Process';
import SearchComponent from '@/components/SearchComponent';
import SystemConst from '@/utils/const';
import Token from '@/utils/token';

const statusMap = new Map();
statusMap.set('在线', 'success');
statusMap.set('离线', 'error');
statusMap.set('未激活', 'processing');
statusMap.set('online', 'success');
statusMap.set('offline', 'error');
statusMap.set('notActive', 'processing');

export const InstanceModel = model<{
  current: Partial<DeviceInstance>;
  detail: Partial<DeviceInstance>;
  config: any;
  metadataItem: MetadataItem;
  params: Set<string>; // 处理无限循环Card
  active?: string; // 当前编辑的Card
}>({
  current: {},
  detail: {},
  config: {},
  metadataItem: {},
  params: new Set<string>(['test']),
});
export const service = new Service('device/instance');
const Instance = () => {
  const actionRef = useRef<ActionType>();
  const [visible, setVisible] = useState<boolean>(false);
  const [exportVisible, setExportVisible] = useState<boolean>(false);
  const [importVisible, setImportVisible] = useState<boolean>(false);
  const [operationVisible, setOperationVisible] = useState<boolean>(false);
  const [type, setType] = useState<'active' | 'sync'>('active');
  const [api, setApi] = useState<string>('');
  const [current, setCurrent] = useState<Partial<DeviceInstance>>({});
  const [searchParams, setSearchParams] = useState<any>({});
  const [bindKeys, setBindKeys] = useState<any[]>([]);
  const intl = useIntl();

  const columns: ProColumns<DeviceInstance>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: intl.formatMessage({
        id: 'pages.table.deviceName',
        defaultMessage: '设备名称',
      }),
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.table.productName',
        defaultMessage: '产品名称',
      }),
      dataIndex: 'productName',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.instance.registrationTime',
        defaultMessage: '注册时间',
      }),
      dataIndex: 'registryTime',
      width: '200px',
      render: (text: any) => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '/'),
      sorter: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.searchTable.titleStatus',
        defaultMessage: '状态',
      }),
      dataIndex: 'state',
      width: '90px',
      renderText: (record) =>
        record ? <Badge status={statusMap.get(record.value)} text={record.text} /> : '',
      filters: [
        {
          text: intl.formatMessage({
            id: 'pages.device.instance.status.notActive',
            defaultMessage: '未启用',
          }),
          value: 'notActive',
        },
        {
          text: intl.formatMessage({
            id: 'pages.device.instance.status.offLine',
            defaultMessage: '离线',
          }),
          value: 'offline',
        },
        {
          text: intl.formatMessage({
            id: 'pages.device.instance.status.onLine',
            defaultMessage: '在线',
          }),
          value: 'online',
        },
      ],
      filterMultiple: false,
    },
    {
      title: intl.formatMessage({
        id: 'pages.table.description',
        defaultMessage: '说明',
      }),
      dataIndex: 'description',
      width: '15%',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.data.option',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      align: 'center',
      width: 200,
      render: (text, record) => [
        <Link
          onClick={() => {
            InstanceModel.current = record;
          }}
          to={`/device/instance/detail/${record.id}`}
          key="link"
        >
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.detail',
              defaultMessage: '查看',
            })}
            key={'detail'}
          >
            <SearchOutlined />
          </Tooltip>
        </Link>,
        <a href={record.id} target="_blank" rel="noopener noreferrer" key="view">
          <Popconfirm
            title={intl.formatMessage({
              id: 'pages.data.option.disabled.tips',
              defaultMessage: '确认禁用？',
            })}
            onConfirm={async () => {
              if (record.state.value !== 'notActive') {
                await service.undeployDevice(record.id);
              } else {
                await service.deployDevice(record.id);
              }
              message.success(
                intl.formatMessage({
                  id: 'pages.data.option.success',
                  defaultMessage: '操作成功!',
                }),
              );
              actionRef.current?.reload();
            }}
          >
            <Tooltip
              title={intl.formatMessage({
                id: `pages.data.option.${
                  record.state.value !== 'notActive' ? 'disabled' : 'enabled'
                }`,
                defaultMessage: record.state.value !== 'notActive' ? '禁用' : '启用',
              })}
            >
              {record.state.value !== 'notActive' ? <StopOutlined /> : <CheckCircleOutlined />}
            </Tooltip>
          </Popconfirm>
        </a>,

        <a key={'delete'}>
          <Popconfirm
            title="确认删除"
            onConfirm={async () => {
              await service.remove(record.id);
              message.success(
                intl.formatMessage({
                  id: 'pages.data.option.success',
                  defaultMessage: '操作成功!',
                }),
              );
              actionRef.current?.reload();
            }}
          >
            <Tooltip title={'删除'}>
              <DeleteOutlined />
            </Tooltip>
          </Popconfirm>
        </a>,
      ],
    },
  ];

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <Button
          icon={<ExportOutlined />}
          type="default"
          onClick={() => {
            setExportVisible(true);
          }}
        >
          批量导出设备
        </Button>
      </Menu.Item>
      <Menu.Item key="2">
        <Button
          icon={<ImportOutlined />}
          onClick={() => {
            setImportVisible(true);
          }}
        >
          批量导入设备
        </Button>
      </Menu.Item>
      <Menu.Item key="4">
        <Popconfirm
          title={'确认激活全部设备？'}
          onConfirm={() => {
            setType('active');
            const activeAPI = `/${
              SystemConst.API_BASE
            }/device-instance/deploy?:X_Access_Token=${Token.get()}`;
            setApi(activeAPI);
            setOperationVisible(true);
          }}
        >
          <Button icon={<CheckCircleOutlined />} type="primary" ghost>
            激活全部设备
          </Button>
        </Popconfirm>
      </Menu.Item>
      <Menu.Item key="5">
        <Button
          icon={<SyncOutlined />}
          type="primary"
          onClick={() => {
            setType('sync');
            const syncAPI = `/${
              SystemConst.API_BASE
            }/device-instance/state/_sync?:X_Access_Token=${Token.get()}`;
            setApi(syncAPI);
            setOperationVisible(true);
          }}
        >
          同步设备状态
        </Button>
      </Menu.Item>
      {bindKeys.length > 0 && (
        <Menu.Item key="3">
          <Popconfirm
            title="确认删除选中设备?"
            onConfirm={() => {
              service.batchDeleteDevice(bindKeys).then((resp) => {
                if (resp.status === 200) {
                  message.success('操作成功');
                  actionRef.current?.reset?.();
                }
              });
            }}
            okText="确认"
            cancelText="取消"
          >
            <Button icon={<DeleteOutlined />} type="primary" danger>
              删除选中设备
            </Button>
          </Popconfirm>
        </Menu.Item>
      )}
      {bindKeys.length > 0 && (
        <Menu.Item key="6">
          <Popconfirm
            title="确认禁用选中设备?"
            onConfirm={() => {
              service.batchUndeployDevice(bindKeys).then((resp) => {
                if (resp.status === 200) {
                  message.success('操作成功');
                  actionRef.current?.reset?.();
                }
              });
            }}
            okText="确认"
            cancelText="取消"
          >
            <Button icon={<StopOutlined />} type="primary" danger>
              禁用选中设备
            </Button>
          </Popconfirm>
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <PageContainer>
      <SearchComponent<DeviceInstance>
        field={columns}
        target="device-instance"
        onSearch={(data) => {
          // 重置分页数据
          actionRef.current?.reset?.();
          setSearchParams(data);
        }}
        onReset={() => {
          // 重置分页及搜索参数
          actionRef.current?.reset?.();
          setSearchParams({});
        }}
      />
      <ProTable<DeviceInstance>
        columns={columns}
        actionRef={actionRef}
        params={searchParams}
        options={{ fullScreen: true }}
        request={(params) =>
          service.query({
            ...params,
            sorts: [
              {
                name: 'id',
                order: 'ascend',
              },
            ],
          })
        }
        rowKey="id"
        search={false}
        pagination={{ pageSize: 10 }}
        rowSelection={{
          selectedRowKeys: bindKeys,
          onChange: (selectedRowKeys, selectedRows) => {
            setBindKeys(selectedRows.map((item) => item.id));
          },
        }}
        toolBarRender={() => [
          <Button
            onClick={() => {
              setVisible(true);
              setCurrent({});
            }}
            key="button"
            icon={<PlusOutlined />}
            type="primary"
          >
            {intl.formatMessage({
              id: 'pages.data.option.add',
              defaultMessage: '新增',
            })}
          </Button>,
          <Dropdown key={'more'} overlay={menu} placement="bottom">
            <Button>批量操作</Button>
          </Dropdown>,
        ]}
      />
      <Save
        data={current}
        close={() => {
          setVisible(false);
          actionRef.current?.reload();
        }}
        visible={visible}
      />
      <Export
        data={searchParams}
        close={() => {
          setExportVisible(false);
          actionRef.current?.reload();
        }}
        visible={exportVisible}
      />
      <Import
        data={current}
        close={() => {
          setImportVisible(false);
          actionRef.current?.reload();
        }}
        visible={importVisible}
      />
      {operationVisible && (
        <Process
          api={api}
          action={type}
          closeVisible={() => {
            setOperationVisible(false);
            actionRef.current?.reload();
          }}
        />
      )}
    </PageContainer>
  );
};
export default Instance;
