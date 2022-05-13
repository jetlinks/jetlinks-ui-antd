import { useIntl } from '@/.umi/plugin-locale/localeExports';
import PermissionButton from '@/components/PermissionButton';
import SearchComponent from '@/components/SearchComponent';
import BaseService from '@/utils/BaseService';
import {
  DeleteOutlined,
  EditOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { useRef, useState } from 'react';
import type { NotifitionSubscriptionItem } from './typings';
import Save from './save';

export const service = new BaseService<NotifitionSubscriptionItem>('network/certificate');

const NotificationSubscription = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [param, setParam] = useState({});
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<NotifitionSubscriptionItem | undefined>(undefined);

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
            // const resp =
            //   record?.state?.value !== 'disabled'
            //     ? await service._disable(record.id)
            //     : await service._enable(record.id);
            // if (resp.status === 200) {
            //   message.success('操作成功！');
            //   actionRef.current?.reload?.();
            // } else {
            //   message.error('操作失败！');
            // }
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
        popConfirm={{
          title: '确认删除？',
          onConfirm: () => {},
        }}
        tooltip={{
          title: '删除',
        }}
      >
        <DeleteOutlined />
      </PermissionButton>,
    ];
  };

  const columns: ProColumns<NotifitionSubscriptionItem>[] = [
    {
      dataIndex: 'instance',
      title: '名称',
    },
    {
      dataIndex: 'name',
      title: '类型',
      hideInSearch: true,
    },
    {
      dataIndex: 'description',
      title: '告警规则',
      hideInSearch: true,
    },
    {
      dataIndex: 'state',
      title: '状态',
      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      width: 200,
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
        search={false}
        request={async (params) =>
          service.query({ ...params, sorts: [{ name: 'createTime', order: 'desc' }] })
        }
        headerTitle={[
          <PermissionButton
            onClick={() => {
              setVisible(true);
              setCurrent(undefined);
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
            actionRef.current?.reload();
          }}
          data={current}
        />
      )}
    </PageContainer>
  );
};

export default NotificationSubscription;
