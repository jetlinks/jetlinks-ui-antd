import { service } from '@/pages/media/Cascade';
import SearchComponent from '@/components/SearchComponent';
import { CloseOutlined, DisconnectOutlined, EditOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { Button, Input, message, Popover, Space } from 'antd';
import { useRef, useState } from 'react';
import { useIntl, useLocation } from 'umi';
import BindChannel from './BindChannel';
import BadgeStatus, { StatusColorEnum } from '@/components/BadgeStatus';
import { PermissionButton } from '@/components';

const Channel = () => {
  const location: any = useLocation();
  const actionRef = useRef<ActionType>();
  const [param, setParam] = useState({});
  const intl = useIntl();
  const [visible, setVisible] = useState<boolean>(false);
  const [selectedRowKey, setSelectedRowKey] = useState<string[]>([]);
  const id = location?.query?.id || '';
  const [data, setData] = useState<string>('');
  const [popVisible, setPopvisible] = useState<string>('');
  const { permission } = PermissionButton.usePermission('media/Cascade');

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
              const resp: any = await service.editBindInfo(record.gbChannelId, {
                gbChannelId: data,
              });
              if (resp.status === 200) {
                message.success('操作成功');
                actionRef.current?.reload();
                setPopvisible('');
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
      dataIndex: 'gbChannelId',
      title: '国标ID',
      tooltip: '国标级联有18位、20位两种格式。在当前页面修改不会修改视频设备-通道页面中的国标ID',
      render: (text: any, record: any) => (
        <span>
          {text}
          <Popover
            visible={popVisible === record.gbChannelId}
            trigger="click"
            content={content(record)}
            title={
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>编辑国标ID</div>
                <CloseOutlined
                  onClick={() => {
                    setPopvisible('');
                    setData('');
                  }}
                />
              </div>
            }
          >
            <a
              style={{ marginLeft: 10 }}
              onClick={() => {
                setData('');
                setPopvisible(record.gbChannelId);
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
        <PermissionButton
          isPermission={permission.channel}
          key={'unbind'}
          type={'link'}
          popConfirm={{
            title: `确认解绑`,
            onConfirm: () => {
              unbind([record.channelId]);
            },
          }}
        >
          <DisconnectOutlined />
        </PermissionButton>,
      ],
    },
  ];

  return (
    <PageContainer>
      <SearchComponent<any>
        field={columns}
        target="bind-channel"
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
        rowKey="channelId"
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
          <PermissionButton
            isPermission={permission.channel}
            key={'bind'}
            onClick={() => {
              setVisible(true);
            }}
            type={'primary'}
          >
            绑定通道
          </PermissionButton>,
          <PermissionButton
            isPermission={permission.channel}
            key={'unbind'}
            popConfirm={{
              title: `确认解绑`,
              onConfirm: () => {
                if (selectedRowKey.length > 0) {
                  unbind(selectedRowKey);
                  setSelectedRowKey([]);
                } else {
                  message.error('请先选择需要解绑的通道列表');
                }
              },
            }}
          >
            批量解绑
          </PermissionButton>,
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
