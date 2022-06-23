import { useIntl } from '@/.umi/plugin-locale/localeExports';
import PermissionButton from '@/components/PermissionButton';
import SearchComponent from '@/components/SearchComponent';
import Icon, { SearchOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { useEffect, useRef, useState } from 'react';
import Detail from './detail';
import { Badge } from 'antd';
import Service from './service';
import encodeQuery from '@/utils/encodeQuery';
import { useDomFullHeight } from '@/hooks';
import { onlyMessage } from '@/utils/util';
import type { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';
import { historyStateModel } from '@/hooks/route/useHistory';
import { observer } from '@formily/reactive-react';
export const service = new Service('notifications');

const NotificationRecord = observer(() => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [param, setParam] = useState({});
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<Partial<NotifitionRecord>>({});
  const [typeList, setTypeList] = useState<any>({});
  const { minHeight } = useDomFullHeight(`.record`, 24);

  useEffect(() => {
    service.getProvidersList().then((resp) => {
      const obj: any = {};
      resp.map((i: any) => {
        obj[i?.value] = { status: i?.value, text: i?.label };
      });
      setTypeList(obj);
    });
  }, []);

  useEffect(() => {
    if (historyStateModel.state.id) {
      setVisible(true);
      setCurrent(historyStateModel.state);
    }
  }, [historyStateModel.state]);

  const ReadSvg = () => (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 18H6L2 22V2C2 2 2.9 2 4 2H20C21.1 2 22 2 22 2V11H20V4H4V16H12V18ZM23 14.34L21.59 12.93L17.35 17.17L15.23 15.05L13.82 16.46L17.34 20L23 14.34Z"
        fill="currentColor"
      />
    </svg>
  );

  const ReadIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={ReadSvg} {...props} />
  );

  const columns: ProColumns<NotifitionRecord>[] = [
    {
      dataIndex: 'topicProvider',
      title: '类型',
      fixed: 'left',
      render: (text: any, record: any) => {
        return <span>{typeList[record?.topicProvider]?.text || text}</span>;
      },
      valueType: 'select',
      request: () =>
        service.getProvidersList().then((resp: any) =>
          resp.map((item: any) => ({
            label: item.label,
            value: item.value,
          })),
        ),
    },
    {
      dataIndex: 'message',
      title: '消息',
      ellipsis: true,
    },
    {
      dataIndex: 'notifyTime',
      title: '通知时间',
      valueType: 'dateTime',
    },
    {
      dataIndex: 'state',
      title: '状态',
      render: (text: any, record: any) => (
        <Badge
          status={record.state?.value === 'read' ? 'success' : 'error'}
          text={record?.state?.text || '-'}
        />
      ),
      valueType: 'select',
      valueEnum: {
        unread: {
          text: '未读',
          status: 'unread',
        },
        read: {
          text: '已读',
          status: 'read',
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
      fixed: 'right',
      render: (text, record) => [
        <PermissionButton
          key={'update'}
          type={'link'}
          isPermission={true}
          style={{ padding: 0 }}
          tooltip={{
            title: record?.state?.value !== 'read' ? '标为已读' : '标为未读',
          }}
          popConfirm={{
            title: `确认${record?.state?.value !== 'read' ? '标为已读' : '标为未读'}`,
            onConfirm: async () => {
              const state = record?.state?.value !== 'read' ? 'read' : 'unread';
              const resp = await service.saveData(state, [record.id]);
              if (resp.status === 200) {
                onlyMessage('操作成功');
                actionRef.current?.reload();
              }
            },
          }}
        >
          {/* <ReadOutlined /> */}
          <ReadIcon />
        </PermissionButton>,
        <PermissionButton
          key={'action'}
          type={'link'}
          isPermission={true}
          style={{ padding: 0 }}
          tooltip={{
            title: '查看',
          }}
          onClick={() => {
            setVisible(true);
            setCurrent(record);
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
        rowKey="id"
        scroll={{ x: 1366 }}
        search={false}
        tableClassName={'record'}
        tableStyle={{ minHeight }}
        request={async (params) =>
          service.queryList(encodeQuery({ ...params, sorts: { notifyTime: 'desc' } }))
        }
      />
      {visible && (
        <Detail
          close={() => {
            setCurrent({});
            setVisible(false);
          }}
          data={current}
        />
      )}
    </PageContainer>
  );
});

export default NotificationRecord;
