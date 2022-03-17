import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import type { LogItem } from '@/pages/device/Instance/Detail/Log/typings';
import { Badge, Button, Card, message, Popconfirm, Tooltip } from 'antd';
import { DisconnectOutlined, SearchOutlined } from '@ant-design/icons';
import { useIntl } from '@@/plugin-locale/localeExports';
import { InstanceModel, service, statusMap } from '@/pages/device/Instance';
import { useRef, useState } from 'react';
import SearchComponent from '@/components/SearchComponent';
import BindChildDevice from './BindChildDevice';
import moment from 'moment';
import { Link } from 'umi';

const ChildDevice = () => {
  const intl = useIntl();
  const [visible, setVisible] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [searchParams, setSearchParams] = useState<any>({});
  const [bindKeys, setBindKeys] = useState<any[]>([]);

  const unBindSingleDevice = async (id: string) => {
    const resp = await service.unbindDevice(InstanceModel.detail.id!, id, {});
    if (resp.status === 200) {
      actionRef.current?.reset?.();
      message.success('操作成功！');
    }
  };

  const columns: ProColumns<LogItem>[] = [
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
      title: '设备名称',
      dataIndex: 'name',
    },
    {
      title: '所属产品',
      dataIndex: 'productName',
    },
    {
      title: '注册时间',
      dataIndex: 'registryTime',
      width: '200px',
      render: (text: any) => (!!text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '/'),
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
          value: 'notActive',
        },
        offline: {
          text: intl.formatMessage({
            id: 'pages.device.instance.status.offLine',
            defaultMessage: '离线',
          }),
          value: 'offline',
        },
        online: {
          text: intl.formatMessage({
            id: 'pages.device.instance.status.onLine',
            defaultMessage: '在线',
          }),
          value: 'online',
        },
      },
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
        <Link to={`/device/instance/detail/${record.id}`} key="link">
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
            <DisconnectOutlined />
          </Popconfirm>
        </a>,
      ],
    },
  ];

  return (
    <Card>
      <SearchComponent<LogItem>
        field={[...columns]}
        target="child-device"
        pattern={'simple'}
        defaultParam={[
          { column: 'parentId', value: InstanceModel?.detail?.id || '', termType: 'eq' },
        ]}
        onSearch={(param) => {
          actionRef.current?.reset?.();
          setSearchParams(param);
        }}
        onReset={() => {
          // 重置分页及搜索参数
          actionRef.current?.reset?.();
          setSearchParams({});
        }}
      />
      <ProTable<LogItem>
        search={false}
        columns={columns}
        size="small"
        actionRef={actionRef}
        params={searchParams}
        rowKey="id"
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
                message.success('操作成功！');
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
      <BindChildDevice
        visible={visible}
        data={{}}
        onCancel={() => {
          setVisible(false);
        }}
      />
    </Card>
  );
};
export default ChildDevice;
