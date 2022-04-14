import { service } from '@/pages/media/Cascade';
import SearchComponent from '@/components/SearchComponent';
import { DisconnectOutlined, EditOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { Button, Input, message, Popconfirm, Popover, Space, Tooltip } from 'antd';
import { useRef, useState } from 'react';
import { useIntl, useLocation } from 'umi';
import BindChannel from './BindChannel';
import BadgeStatus, { StatusColorEnum } from '@/components/BadgeStatus';

const Channel = () => {
  const location: any = useLocation();
  const actionRef = useRef<ActionType>();
  const [param, setParam] = useState({});
  const intl = useIntl();
  const [visible, setVisible] = useState<boolean>(false);
  const [selectedRowKey, setSelectedRowKey] = useState<string[]>([]);
  const id = location?.query?.id || '';
  const [data, setData] = useState<string>('');

  const unbind = async (list: string[]) => {
    const resp = await service.unbindChannel(id, list);
    if (resp.status === 200) {
      actionRef.current?.reload();
      message.success('操作成功！');
    }
  };

  const content = (record: any) => {
    return (
      <div>
        <Input
          value={data}
          placeholder="请输入国标ID"
          onChange={(e) => {
            setData(e.target.value);
          }}
        />
        <Button
          type="primary"
          style={{ marginTop: 10, width: '100%' }}
          onClick={async () => {
            if (!!data) {
              const resp: any = service.editBindInfo(record.id, { gbChannelId: data });
              if (resp.status === 200) {
                actionRef.current?.reload();
              }
            } else {
              message.error('请输入国标ID');
            }
          }}
        >
          保存
        </Button>
      </div>
    );
  };

  const columns: ProColumns<any>[] = [
    {
      dataIndex: 'deviceName',
      title: '设备名称',
    },
    {
      dataIndex: 'name',
      title: '通道名称',
    },
    {
      dataIndex: 'channelId',
      title: '国标ID',
      tooltip: '国标级联有18位、20位两种格式。在当前页面修改不会修改视频设备-通道页面中的国标ID',
      render: (text: any, record: any) => (
        <span>
          {text}
          <Popover trigger="click" content={content(record)} title="编辑通道ID">
            <a
              style={{ marginLeft: 10 }}
              onClick={() => {
                setData('');
              }}
            >
              <EditOutlined />
            </a>
          </Popover>
        </span>
      ),
    },
    {
      dataIndex: 'address',
      title: '安装地址',
    },
    {
      dataIndex: 'manufacturer',
      title: '厂商',
    },
    {
      dataIndex: 'status',
      title: '在线状态',
      render: (text: any, record: any) => (
        <BadgeStatus
          status={record.status?.value}
          text={record.status?.text}
          statusNames={{
            online: StatusColorEnum.success,
            offline: StatusColorEnum.error,
          }}
        />
      ),
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      width: 200,
      render: (text: any, record: any) => [
        <Popconfirm
          key={'unbinds'}
          title="确认解绑"
          onConfirm={() => {
            unbind([record.id]);
          }}
        >
          <a>
            <Tooltip title={'解绑'}>
              <DisconnectOutlined />
            </Tooltip>
          </a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <SearchComponent<any>
        field={columns}
        target="unbind-channel"
        onSearch={(params) => {
          actionRef.current?.reload();
          setParam({
            ...param,
            terms: params?.terms ? [...params?.terms] : [],
          });
        }}
      />
      <ProTable<any>
        actionRef={actionRef}
        params={param}
        columns={columns}
        search={false}
        headerTitle={'通道列表'}
        request={async (params) =>
          service.queryBindChannel(id, {
            ...params,
            sorts: [{ name: 'createTime', order: 'desc' }],
          })
        }
        rowKey="id"
        rowSelection={{
          selectedRowKeys: selectedRowKey,
          onChange: (selectedRowKeys) => {
            setSelectedRowKey(selectedRowKeys as string[]);
          },
        }}
        tableAlertRender={({ selectedRowKeys, onCleanSelected }) => (
          <Space size={24}>
            <span>
              {intl.formatMessage({
                id: 'pages.bindUser.bindTheNewUser.selected',
                defaultMessage: '已选',
              })}{' '}
              {selectedRowKeys.length}{' '}
              {intl.formatMessage({
                id: 'pages.bindUser.bindTheNewUser.item',
                defaultMessage: '项',
              })}
              <a style={{ marginLeft: 8 }} onClick={onCleanSelected}>
                {intl.formatMessage({
                  id: 'pages.bindUser.bindTheNewUser.deselect',
                  defaultMessage: '取消选择',
                })}
              </a>
            </span>
          </Space>
        )}
        toolBarRender={() => [
          <Button
            onClick={() => {
              setVisible(true);
            }}
            key="bind"
            type="primary"
          >
            绑定通道
          </Button>,
          <Button
            onClick={() => {
              if (selectedRowKey.length > 0) {
                unbind(selectedRowKey);
              } else {
                message.error('请先选择需要解绑的通道列表');
              }
            }}
            key="unbind"
          >
            批量解绑
          </Button>,
        ]}
      />
      {visible && (
        <BindChannel
          data={id}
          close={() => {
            setVisible(false);
            actionRef.current?.reload();
          }}
        />
      )}
    </PageContainer>
  );
};

export default Channel;
