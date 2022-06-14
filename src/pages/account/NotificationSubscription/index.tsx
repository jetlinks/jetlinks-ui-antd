import { useIntl } from '@/.umi/plugin-locale/localeExports';
import PermissionButton from '@/components/PermissionButton';
import SearchComponent from '@/components/SearchComponent';
import {
  DeleteOutlined,
  EditOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { observer } from '@formily/reactive-react';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { Badge, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import Save from './save';
import Service from './service';
import { useDomFullHeight } from '@/hooks';

export const service = new Service('notifications/subscriptions');

const NotificationSubscription = observer(() => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [param, setParam] = useState({});
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<Partial<NotifitionSubscriptionItem>>({});
  const [typeList, setTypeList] = useState<any>({});
  const { minHeight } = useDomFullHeight(`.subscription`, 24);

  useEffect(() => {
    service.getProvidersList().then((resp) => {
      const obj: any = {};
      resp.map((i: any) => {
        obj[i?.value] = i?.label || '';
      });
      setTypeList(obj);
    });
  }, []);

  const Tools = (record: any) => {
    return [
      <PermissionButton
        key={'update'}
        type={'link'}
        isPermission={true}
        style={{ padding: 0 }}
        tooltip={{
          title: intl.formatMessage({
            id: 'pages.data.option.edit',
            defaultMessage: '编辑',
          }),
        }}
        onClick={() => {
          setVisible(true);
          setCurrent(record);
        }}
      >
        <EditOutlined />
      </PermissionButton>,
      <PermissionButton
        key={'action'}
        type={'link'}
        style={{ padding: 0 }}
        isPermission={true}
        popConfirm={{
          title: intl.formatMessage({
            id: `pages.data.option.${
              record?.state?.value !== 'disabled' ? 'disabled' : 'enabled'
            }.tips`,
            defaultMessage: '确认禁用？',
          }),
          onConfirm: async () => {
            const resp =
              record?.state?.value !== 'disabled'
                ? await service._disabled(record.id)
                : await service._enabled(record.id);
            if (resp.status === 200) {
              message.success('操作成功！');
              actionRef.current?.reload?.();
            } else {
              message.error('操作失败！');
            }
          },
        }}
        tooltip={{
          title: intl.formatMessage({
            id: `pages.data.option.${record?.state?.value !== 'disabled' ? 'disabled' : 'enabled'}`,
            defaultMessage: '启用',
          }),
        }}
      >
        {record?.state?.value !== 'disabled' ? <StopOutlined /> : <PlayCircleOutlined />}
      </PermissionButton>,
      <PermissionButton
        key={'delete'}
        type={'link'}
        isPermission={true}
        style={{ padding: 0 }}
        disabled={record?.state?.value !== 'disabled'}
        popConfirm={{
          title: '确认删除？',
          disabled: record?.state?.value !== 'disabled',
          onConfirm: async () => {
            const resp: any = await service.remove(record.id);
            if (resp.status === 200) {
              message.success('操作成功！');
              actionRef.current?.reload?.();
            } else {
              message.error('操作失败！');
            }
          },
        }}
        tooltip={{
          title: record?.state?.value !== 'disabled' ? '请先禁用，再删除' : '删除',
        }}
      >
        <DeleteOutlined />
      </PermissionButton>,
    ];
  };

  const columns: ProColumns<NotifitionSubscriptionItem>[] = [
    {
      dataIndex: 'subscribeName',
      title: '名称',
      fixed: 'left',
      ellipsis: true,
      width: '25%',
    },
    {
      dataIndex: 'topicProvider',
      title: '类型',
      hideInSearch: true,
      render: (text: any, record: any) => {
        return <span>{typeList[record?.topicProvider] || text}</span>;
      },
    },
    {
      dataIndex: 'topicConfig',
      title: '告警规则',
      hideInSearch: true,
      ellipsis: true,
      render: (text: any, record: any) => (
        <span>{record?.topicConfig?.alarmConfigName || '-'}</span>
      ),
    },
    {
      dataIndex: 'state',
      title: '状态',
      hideInSearch: true,
      render: (text: any, record: any) => (
        <Badge
          status={record.state?.value === 'enabled' ? 'success' : 'error'}
          text={record?.state?.text || '-'}
        />
      ),
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      width: 200,
      fixed: 'right',
      render: (text, record) => [Tools(record)],
    },
  ];

  return (
    <PageContainer>
      <SearchComponent<NotifitionSubscriptionItem>
        field={columns}
        target="notification-subscription"
        onSearch={(data) => {
          // 重置分页数据
          actionRef.current?.reset?.();
          setParam(data);
        }}
      />
      <ProTable<NotifitionSubscriptionItem>
        actionRef={actionRef}
        params={param}
        columns={columns}
        scroll={{ x: 1366 }}
        search={false}
        tableClassName={'subscription'}
        tableStyle={{ minHeight }}
        rowKey="id"
        request={async (params) =>
          service.query({ ...params, sorts: [{ name: 'createTime', order: 'desc' }] })
        }
        headerTitle={[
          <PermissionButton
            onClick={() => {
              setVisible(true);
              setCurrent({});
            }}
            isPermission={true}
            style={{ marginRight: 12 }}
            key="button"
            icon={<PlusOutlined />}
            type="primary"
          >
            {intl.formatMessage({
              id: 'pages.data.option.add',
              defaultMessage: '新增',
            })}
          </PermissionButton>,
        ]}
      />
      {visible && (
        <Save
          close={() => {
            setVisible(false);
          }}
          data={current}
          reload={() => {
            setVisible(false);
            actionRef.current?.reload();
          }}
        />
      )}
    </PageContainer>
  );
});

export default NotificationSubscription;
