import { useIntl } from '@/.umi/plugin-locale/localeExports';
import PermissionButton from '@/components/PermissionButton';
import SearchComponent from '@/components/SearchComponent';
import BaseService from '@/utils/BaseService';
import { ReadOutlined, SearchOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { useRef, useState } from 'react';
import type { NotifitionRecord } from './typings';
import Detail from './detail';

export const service = new BaseService<NotifitionRecord>('network/certificate');

const NotificationRecord = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [param, setParam] = useState({});
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<NotifitionRecord | undefined>(undefined);

  const columns: ProColumns<NotifitionRecord>[] = [
    {
      dataIndex: 'instance',
      title: '类型',
    },
    {
      dataIndex: 'name',
      title: '消息',
    },
    {
      dataIndex: 'description',
      title: '通知时间',
    },
    {
      dataIndex: 'state',
      title: '状态',
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
        <PermissionButton
          key={'update'}
          type={'link'}
          isPermission={true}
          style={{ padding: 0 }}
          tooltip={{
            title: '标为已读',
          }}
          onClick={() => {
            setCurrent(record);
            setVisible(true);
          }}
        >
          <ReadOutlined />
        </PermissionButton>,
        <PermissionButton
          key={'action'}
          type={'link'}
          isPermission={true}
          style={{ padding: 0 }}
          tooltip={{
            title: '查看',
          }}
        >
          <SearchOutlined />
        </PermissionButton>,
      ],
    },
  ];

  return (
    <PageContainer>
      <SearchComponent<NotifitionRecord>
        field={columns}
        target="notification-record"
        onSearch={(data) => {
          // 重置分页数据
          actionRef.current?.reset?.();
          setParam(data);
        }}
      />
      <ProTable<NotifitionRecord>
        actionRef={actionRef}
        params={param}
        columns={columns}
        search={false}
        request={async (params) =>
          service.query({ ...params, sorts: [{ name: 'createTime', order: 'desc' }] })
        }
      />
      {visible && (
        <Detail
          close={() => {
            actionRef.current?.reload();
          }}
          data={current}
        />
      )}
    </PageContainer>
  );
};

export default NotificationRecord;
