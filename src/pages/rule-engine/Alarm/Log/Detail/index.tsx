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
import useLocation from '@/hooks/route/useLocation';
import { useDomFullHeight } from '@/hooks';

const Detail = observer(() => {
  const params = useParams<{ id: string }>();
  const location = useLocation();
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<Partial<AlarmLogHistoryItem>>({});
  const { minHeight } = useDomFullHeight(`.alarm-log`, 24);
  const [detail, setDetail] = useState<any>({});

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
      fixed: 'left',
      render: (text: any, record: any) => (
        <span>{moment(record.alarmTime).format('YYYY-MM-DD HH:mm:ss')}</span>
      ),
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
      fixed: 'right',
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

  useEffect(() => {
    const { state } = location;
    setCurrent(detail);
    if (state?.param.detail && detail) {
      setVisible(true);
    }
  }, [location, detail]);

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
        columnEmptyText={''}
        tableClassName={'alarm-log'}
        tableStyle={{ minHeight }}
        scroll={{ x: 1366 }}
        // headerTitle={'记录列表'}
        request={async (data) => {
          const res = await service.queryHistoryList({
            ...data,
            sorts: [{ name: 'alarmTime', order: 'desc' }],
          });
          if (res.status === 200) {
            setDetail(res.result.data[0]);
            return {
              code: res.message,
              result: {
                data: res.result.data,
                pageIndex: res.result.pageIndex,
                pageSize: res.result.pageSize,
                total: res.result.total,
              },
              status: res.status,
            };
          } else {
            return {
              code: 200,
              result: {
                data: [],
                pageIndex: 0,
                pageSize: 0,
                total: 0,
              },
              status: 200,
            };
          }
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
