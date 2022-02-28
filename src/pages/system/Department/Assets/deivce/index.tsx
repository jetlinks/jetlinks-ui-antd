// 资产分配-产品分类
import ProTable from '@jetlinks/pro-table';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import { useIntl } from '@@/plugin-locale/localeExports';
import { Button, message, Popconfirm, Tooltip, Badge } from 'antd';
import { useRef, useState } from 'react';
import { useParams } from 'umi';
import { observer } from '@formily/react';
import type { DeviceItem } from '@/pages/system/Department/typings';
import { DisconnectOutlined, PlusOutlined } from '@ant-design/icons';
import Models from './model';
import Service from '@/pages/system/Department/Assets/service';
import Bind from './bind';
import SearchComponent from '@/components/SearchComponent';

export const service = new Service<DeviceItem>('assets');

type DeviceBadgeProps = {
  type: string;
  text: string;
};
export const DeviceBadge = (props: DeviceBadgeProps) => {
  const STATUS = {
    notActive: 'processing',
    offline: 'error',
    online: 'success',
  };
  return <Badge status={STATUS[props.type]} text={props.text} />;
};

export default observer(() => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();

  const param = useParams<{ id: string }>();
  const [searchParam, setSearchParam] = useState({});
  /**
   * 解除资产绑定
   */
  const handleUnBind = () => {
    service
      .unBind('device', [
        {
          targetType: 'org',
          targetId: param.id,
          assetType: 'device',
          assetIdList: Models.unBindKeys,
        },
      ])
      .subscribe({
        next: () => message.success('操作成功'),
        error: () => message.error('操作失败'),
        complete: () => {
          Models.unBindKeys = [];
          actionRef.current?.reload();
        },
      });
  };

  const singleUnBind = (key: string) => {
    Models.unBindKeys = [key];
    handleUnBind();
  };

  const columns: ProColumns<DeviceItem>[] = [
    {
      dataIndex: 'id',
      title: 'ID',
      width: 220,
    },
    {
      dataIndex: 'name',
      title: intl.formatMessage({
        id: 'pages.table.name',
        defaultMessage: '名称',
      }),
      search: {
        transform: (value) => ({ name$LIKE: value }),
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.firmware.productName',
        defaultMessage: '所属产品',
      }),
      dataIndex: 'configuration',
      render: (_, row) => {
        return row.productName;
      },
      search: false,
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.instance.registrationTime',
        defaultMessage: '注册时间',
      }),
      dataIndex: 'registryTime',
      search: false,
    },
    {
      title: intl.formatMessage({
        id: 'pages.searchTable.titleStatus',
        defaultMessage: '状态',
      }),
      dataIndex: 'state',
      filters: true,
      onFilter: true,
      valueType: 'select',
      valueEnum: {
        all: {
          text: intl.formatMessage({
            id: 'pages.searchTable.titleStatus.all',
            defaultMessage: '全部',
          }),
          status: 'Default',
        },
        onLine: {
          text: intl.formatMessage({
            id: 'pages.device.instance.status.onLine',
            defaultMessage: '在线',
          }),
          status: 'onLine',
        },
        offLine: {
          text: intl.formatMessage({
            id: 'pages.device.instance.status.offLine',
            defaultMessage: '离线',
          }),
          status: 'offLine',
        },
        notActive: {
          text: intl.formatMessage({
            id: 'pages.device.instance.status.notActive',
            defaultMessage: '未启用',
          }),
          status: 'notActive',
        },
      },
      render: (_, row) => <DeviceBadge type={row.state.value} text={row.state.text} />,
      search: false,
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
        <Popconfirm
          title={intl.formatMessage({
            id: 'pages.system.role.option.unBindUser',
            defaultMessage: '是否解除绑定',
          })}
          key="unBind"
          onConfirm={() => {
            singleUnBind(record.id);
          }}
        >
          <a href="#">
            <Tooltip
              title={intl.formatMessage({
                id: 'pages.system.role.option.unBindUser',
                defaultMessage: '解除绑定',
              })}
            >
              <DisconnectOutlined />
            </Tooltip>
          </a>
        </Popconfirm>,
      ],
    },
  ];

  const closeModal = () => {
    Models.bind = false;
    Models.bindKeys = [];
  };

  return (
    <>
      <Bind
        visible={Models.bind}
        onCancel={closeModal}
        reload={() => actionRef.current?.reload()}
      />
      <SearchComponent<DeviceItem>
        field={columns}
        defaultParam={[
          {
            column: 'id',
            termType: 'dim-assets',
            value: {
              assetType: 'device',
              targets: [
                {
                  type: 'org',
                  id: param.id,
                },
              ],
            },
          },
        ]}
        onSearch={async (data) => {
          actionRef.current?.reset?.();
          setSearchParam(data);
        }}
        target="department-assets-device"
      />
      <ProTable<DeviceItem>
        actionRef={actionRef}
        columns={columns}
        rowKey="id"
        search={false}
        params={searchParam}
        request={(params) => service.queryDeviceList(params)}
        rowSelection={{
          selectedRowKeys: Models.unBindKeys,
          onChange: (selectedRowKeys, selectedRows) => {
            Models.unBindKeys = selectedRows.map((item) => item.id);
          },
        }}
        toolBarRender={() => [
          <Button
            onClick={() => {
              Models.bind = true;
            }}
            icon={<PlusOutlined />}
            type="primary"
            key="bind"
          >
            {intl.formatMessage({
              id: 'pages.data.option.assets',
              defaultMessage: '资产分配',
            })}
          </Button>,
          <Popconfirm
            title={intl.formatMessage({
              id: 'pages.system.role.option.unBindUser',
              defaultMessage: '是否批量解除绑定',
            })}
            key="unBind"
            onConfirm={handleUnBind}
          >
            <Button icon={<DisconnectOutlined />} key="bind">
              {intl.formatMessage({
                id: 'pages.system.role.option.unBindUser',
                defaultMessage: '批量解绑',
              })}
            </Button>
          </Popconfirm>,
        ]}
      />
    </>
  );
});
