import SearchComponent from '@/components/SearchComponent';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { message, Modal, Space } from 'antd';
import { useRef, useState } from 'react';
import { service } from '@/pages/media/Cascade';
import { useIntl } from 'umi';
import BadgeStatus, { StatusColorEnum } from '@/components/BadgeStatus';

interface Props {
  data: string;
  close: () => void;
}

const BindChannel = (props: Props) => {
  const [param, setParam] = useState<any>({
    pageIndex: 0,
    pageSize: 10,
    terms: [
      {
        column: 'id',
        termType: 'cascade_channel$not',
        value: props.data,
        type: 'and',
      },
      {
        column: 'catalogType',
        termType: 'eq',
        value: 'device',
        type: 'and',
      },
    ],
    sorts: [
      {
        name: 'name',
        order: 'asc',
      },
    ],
  });
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [selectedRowKey, setSelectedRowKey] = useState<string[]>([]);

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
  ];

  return (
    <Modal
      title={'绑定通道'}
      visible
      onCancel={props.close}
      onOk={async () => {
        if (selectedRowKey.length > 0) {
          const resp = await service.bindChannel(props.data, selectedRowKey);
          if (resp.status === 200) {
            message.success('操作成功！');
            props.close();
          }
        } else {
          message.error('请勾选数据');
        }
      }}
      width={1200}
    >
      <SearchComponent<any>
        field={columns}
        target="bind-channel"
        enableSave={false}
        onSearch={(data) => {
          actionRef.current?.reload();
          const terms = [
            {
              column: 'id',
              termType: 'cascade_channel$not',
              value: props.data,
              type: 'and',
            },
            {
              column: 'catalogType',
              termType: 'eq',
              value: 'device',
              type: 'and',
            },
          ];
          setParam({
            ...param,
            terms: data?.terms ? [...data?.terms, ...terms] : [...terms],
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
          service.queryChannel({ ...params, sorts: [{ name: 'name', order: 'desc' }] })
        }
        rowKey="id"
        rowSelection={{
          selectedRowKeys: selectedRowKey,
          onChange: (keys) => {
            setSelectedRowKey(keys as string[]);
          },
        }}
        tableAlertRender={({ selectedRowKeys, onCleanSelected }) => (
          <Space size={24}>
            <span>
              {intl.formatMessage({
                id: 'pages.bindUser.bindTheNewUser.selected',
                defaultMessage: '已选',
              })}{' '}
              {selectedRowKeys?.length}{' '}
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
      />
    </Modal>
  );
};
export default BindChannel;
