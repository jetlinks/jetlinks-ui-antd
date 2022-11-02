import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import type { LogItem } from '@/pages/device/Instance/Detail/Log/typings';
import { Badge, Button, Card, Popconfirm, Tooltip } from 'antd';
import { DisconnectOutlined, SearchOutlined } from '@ant-design/icons';
import { useIntl } from '@@/plugin-locale/localeExports';
import { InstanceModel, service } from '@/pages/device/Instance';
import { useRef, useState } from 'react';
import SearchComponent from '@/components/SearchComponent';
import BindChildDevice from './BindChildDevice';
import moment from 'moment';
import { Link } from 'umi';
import { getMenuPathByParams, MENUS_CODE } from '@/utils/menu';
import { useDomFullHeight } from '@/hooks';
import { onlyMessage } from '@/utils/util';
import SaveChild from './SaveChild';

const statusMap = new Map();
statusMap.set('online', 'success');
statusMap.set('offline', 'error');
statusMap.set('notActive', 'warning');

const ChildDevice = () => {
  const intl = useIntl();
  const [visible, setVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [searchParams, setSearchParams] = useState<any>({});
  const [bindKeys, setBindKeys] = useState<any[]>([]);
  const [childVisible, setChildVisible] = useState<boolean>(false);

  const { minHeight } = useDomFullHeight(`.device-detail-childDevice`);

  const unBindSingleDevice = async (id: string) => {
    const resp = await service.unbindDevice(InstanceModel.detail.id!, id, {});
    if (resp.status === 200) {
      actionRef.current?.reset?.();
      onlyMessage('操作成功！');
    }
  };

  const columns: ProColumns<LogItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      ellipsis: true,
      fixed: 'left',
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '所属产品',
      dataIndex: 'productName',
      ellipsis: true,
    },
    {
      title: '注册时间',
      dataIndex: 'registryTime',
      width: '200px',
      valueType: 'dateTime',
      render: (text: any, record: any) => {
        return !record?.registryTime
          ? ''
          : moment(record?.registryTime).format('YYYY-MM-DD HH:mm:ss');
      },
      sorter: true,
    },
    {
      title: '状态',
      dataIndex: 'state',
      renderText: (record) =>
        record ? <Badge status={statusMap.get(record.value)} text={record.text} /> : '',
      valueType: 'select',
      valueEnum: {
        notActive: {
          text: intl.formatMessage({
            id: 'pages.device.instance.status.notActive',
            defaultMessage: '未启用',
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
    },
    {
      title: intl.formatMessage({
        id: 'pages.data.option',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      align: 'left',
      width: 200,
      fixed: 'right',
      render: (text, record) => [
        <Link
          to={`${getMenuPathByParams(MENUS_CODE['device/Instance/Detail'], record.id)}`}
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
        <a key="unbind">
          <Popconfirm
            onConfirm={() => {
              unBindSingleDevice(record.id);
            }}
            title={'确认解绑吗？'}
          >
            <Tooltip title={'解绑'}>
              <DisconnectOutlined />
            </Tooltip>
          </Popconfirm>
        </a>,
      ],
    },
  ];

  return (
    <Card className={'device-detail-childDevice'} style={{ minHeight }}>
      {childVisible ? (
        <SaveChild
          close={() => {
            setChildVisible(false);
          }}
        />
      ) : (
        <>
          <SearchComponent<LogItem>
            field={[...columns]}
            target="child-device"
            enableSave={false}
            // pattern={'simple'}
            defaultParam={[
              { column: 'parentId', value: InstanceModel?.detail?.id || '', termType: 'eq' },
            ]}
            onSearch={(param) => {
              actionRef.current?.reset?.();
              setSearchParams(param);
            }}
            // onReset={() => {
            //   // 重置分页及搜索参数
            //   actionRef.current?.reset?.();
            //   setSearchParams({});
            // }}
          />
          <ProTable<LogItem>
            search={false}
            columns={columns}
            size="small"
            scroll={{ x: 1366 }}
            actionRef={actionRef}
            params={searchParams}
            rowKey="id"
            columnEmptyText={''}
            rowSelection={{
              selectedRowKeys: bindKeys,
              onChange: (selectedRowKeys, selectedRows) => {
                setBindKeys(selectedRows.map((item) => item.id));
              },
            }}
            toolBarRender={() => [
              <Button
                onClick={() => {
                  // actionRef.current?.reset?.();
                  setChildVisible(true);
                }}
                key="save"
                type="primary"
              >
                新增并绑定
              </Button>,
              <Button
                onClick={() => {
                  setVisible(true);
                  actionRef.current?.reset?.();
                }}
                key="bind"
                type="primary"
              >
                绑定
              </Button>,
              <Popconfirm
                key="unbind"
                onConfirm={async () => {
                  const resp = await service.unbindBatchDevice(InstanceModel.detail.id!, bindKeys);
                  if (resp.status === 200) {
                    onlyMessage('操作成功！');
                    setBindKeys([]);
                    actionRef.current?.reset?.();
                  }
                }}
                title={'确认解绑吗？'}
              >
                <Button>批量解绑</Button>
              </Popconfirm>,
            ]}
            pagination={{
              pageSize: 10,
            }}
            request={(params) => service.query(params)}
          />
          {visible && (
            <BindChildDevice
              data={{}}
              onCancel={() => {
                setVisible(false);
                actionRef.current?.reload?.();
              }}
            />
          )}
        </>
      )}
    </Card>
  );
};
export default ChildDevice;
