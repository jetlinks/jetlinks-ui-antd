import React, {useEffect, useState} from 'react';
import styles from '@/utils/table.less';
import {Card, Spin, Table, Tag} from 'antd';
import apis from '@/services';
import {ColumnProps, SorterResult} from 'antd/es/table';
import {alarm, AlarmLog} from '@/pages/device/alarm/data';
import moment from 'moment';
import {PaginationConfig} from 'antd/lib/table';
import encodeQueryParam from '@/utils/encodeParam';
import Search from "@/pages/analysis/components/Tenant/TenantAlarm/Search";

interface Props {

}

interface State {
  data: any[];
  saveAlarmData: Partial<alarm>;
  searchParam: any;
  alarmLogData: any;
  alarmDataList: any[];
}

const TenantAlarm: React.FC<Props> = (props) => {

  const initState: State = {
    data: [],
    saveAlarmData: {},
    searchParam: {
      pageSize: 10, sorts: {
        order: "descend",
        field: "alarmTime"
      }
    },
    alarmLogData: {},
    alarmDataList: [],
  };

  const [spinning, setSpinning] = useState(true);

  const [searchParam, setSearchParam] = useState(initState.searchParam);
  const [alarmLogData, setAlarmLogData] = useState(initState.alarmLogData);

  const statusMap = new Map();
  statusMap.set('在线', 'success');
  statusMap.set('离线', 'error');

  const handleSearch = (params?: any) => {
    setSearchParam(params);
    apis.deviceAlarm.findAlarmLog(encodeQueryParam(params))
      .then((response: any) => {
        if (response.status === 200) {
          setAlarmLogData(response.result);
        }
        setSpinning(false);
      })
      .catch(() => {
      });
  };

  useEffect(() => {
    handleSearch(searchParam);
  }, []);

  const alarmLogColumns: ColumnProps<AlarmLog>[] = [
    {
      title: '设备ID',
      dataIndex: 'deviceId',
    },
    {
      title: '设备名称',
      dataIndex: 'deviceName',
    },
    {
      title: '告警名称',
      dataIndex: 'alarmName',
    },
    {
      title: '告警时间',
      dataIndex: 'alarmTime',
      width: '180px',
      render: (text: any) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '/',
      sorter: true,
      defaultSortOrder: 'descend'
    },
    {
      title: '处理状态',
      dataIndex: 'state',
      align: 'center',
      width: '100px',
      render: text => text === 'solve' ? <Tag color="#87d068">已处理</Tag> : <Tag color="#f50">未处理</Tag>,
    },
  ];

  const onTableChange = (
    pagination: PaginationConfig,
    filters: any,
    sorter: SorterResult<AlarmLog>,
  ) => {
    handleSearch({
      pageIndex: Number(pagination.current) - 1,
      pageSize: pagination.pageSize,
      terms: searchParam.terms,
      sorts: sorter,
    });
  };

  return (
    <Spin spinning={spinning}>
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>
            <Search
              search={(params: any) => {
                setSpinning(true);
                handleSearch({terms: params, pageSize: 10, sorts: searchParam.sorts});
              }}
            />
          </div>
          <div className={styles.StandardTable} style={{marginTop: 10}}>
            <Table
              size='middle'
              dataSource={(alarmLogData || {}).data}
              columns={alarmLogColumns}
              rowKey='id'
              onChange={onTableChange}
              pagination={{
                current: alarmLogData.pageIndex + 1,
                total: alarmLogData.total,
                pageSize: alarmLogData.pageSize,
              }}
            />
          </div>
        </div>
      </Card>
    </Spin>
  );
};
export default TenantAlarm;
