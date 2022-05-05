import SearchComponent from '@/components/SearchComponent';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { useEffect, useRef, useState } from 'react';
import { service } from '@/pages/rule-engine/Alarm/Log';
import { PageContainer } from '@ant-design/pro-layout';
import { useParams } from 'umi';
import { AlarmLogModel } from '../model';
import { observer } from '@formily/reactive-react';
import { SearchOutlined } from '@ant-design/icons';
import Info from './Info';
import { Button } from 'antd';
import moment from 'moment';

const Detail = observer(() => {
  const params = useParams<{ id: string }>();

  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<Partial<AlarmLogHistoryItem>>({});

  const [param, setParam] = useState<any>({
    terms: [
      {
        column: 'alarmRecordId',
        termType: 'eq$not',
        value: params.id || AlarmLogModel.current?.id,
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
  const actionRef = useRef<ActionType>();

  const initColumns: ProColumns<AlarmLogHistoryItem>[] = [
    {
      dataIndex: 'alarmTime',
      title: '告警时间',
      valueType: 'dateTime',
      render: (text: any) => <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      dataIndex: 'alarmConfigName',
      title: '告警名称',
      hideInSearch: true,
    },
    {
      dataIndex: 'description',
      title: '说明',
      hideInSearch: true,
    },
    {
      dataIndex: 'action',
      title: '操作',
      hideInSearch: true,
      valueType: 'option',
      render: (_: any, record: any) => (
        <Button type="link">
          <SearchOutlined
            onClick={() => {
              setVisible(true);
              setCurrent(record);
            }}
          />
        </Button>
      ),
    },
  ];

  useEffect(() => {
    service.detail(params.id).then((resp) => {
      if (resp.status === 200) {
        AlarmLogModel.current = resp.result;
        if (resp.result.targetType === 'device') {
          initColumns.splice(2, 0, {
            dataIndex: 'targetName',
            title: '告警设备',
            hideInSearch: true,
          });
        }
        AlarmLogModel.columns = [...initColumns];
      }
    });
  }, [params.id]);

  return (
    <PageContainer>
      <SearchComponent<AlarmLogHistoryItem>
        field={AlarmLogModel.columns}
        target="alarm-log-detail"
        enableSave={false}
        onSearch={(data) => {
          actionRef.current?.reload();
          const terms = [
            {
              column: 'alarmRecordId',
              termType: 'eq$not',
              value: params.id || AlarmLogModel.current?.id,
              type: 'and',
            },
          ];
          setParam({
            ...param,
            terms: data?.terms ? [...data?.terms, ...terms] : [...terms],
          });
        }}
      />
      <ProTable<AlarmLogHistoryItem>
        actionRef={actionRef}
        params={param}
        columns={AlarmLogModel.columns}
        search={false}
        headerTitle={'记录列表'}
        request={async (data) => {
          return service.queryHistoryList({
            ...data,
            sorts: [{ name: 'alarmTime', order: 'desc' }],
          });
        }}
        rowKey="id"
      />
      {visible && (
        <Info
          close={() => {
            setVisible(false);
            setCurrent({});
          }}
          data={current}
        />
      )}
    </PageContainer>
  );
});

export default Detail;
