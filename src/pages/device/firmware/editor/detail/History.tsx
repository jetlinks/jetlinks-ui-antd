import React, {useEffect, useState} from 'react';
import {Badge, Card, Spin, Table} from 'antd';
import {ColumnProps, PaginationConfig, SorterResult} from 'antd/lib/table';
import moment from 'moment';
import encodeQueryParam from '@/utils/encodeParam';
import apis from '@/services';
import {UpgradeHistoryData} from '@/pages/device/firmware/data';
import styles from '@/utils/table.less';
import SearchForm from '@/components/SearchForm';

interface Props {
  firmwareId?: string;
  productId?: string;
  taskId?: string;
  historyState?: string;
}

interface State {
  data: any;
  searchParam: any;
  spinning: boolean;
}

const UpgradeHistory: React.FC<Props> = (props) => {

  const initState: State = {
    data: {},
    searchParam: { pageSize: 10 },
    spinning: false,
  };

  const [searchParam, setSearchParam] = useState(initState.searchParam);
  const [data, setData] = useState(initState.data);
  const [spinning, setSpinning] = useState(initState.spinning);

  const upgradeStatus = new Map();
  upgradeStatus.set('waiting', 'warning');
  upgradeStatus.set('processing', 'processing');
  upgradeStatus.set('success', 'success');
  upgradeStatus.set('failed', 'error');
  upgradeStatus.set('canceled', 'default');

  const handleSearch = (params?: any) => {
    setSearchParam(params);
    apis.firmware.upgradeHistory(encodeQueryParam(params))
      .then((response: any) => {
          if (response.status === 200) {
            setData(response.result);
          }
          setSpinning(false);
        },
      ).catch(() => {
    });
  };

  useEffect(() => {
    setSpinning(true);
    let terms = {
      firmwareId: props.firmwareId,
    };
    if (props.taskId !== '' && props.taskId) {
      terms['taskId'] = props.taskId;
    }
    if (props.historyState !== '' && props.historyState) {
      terms['state'] = props.historyState;
    }
    handleSearch({
      pageSize: 10,
      terms: terms,
    });
  }, []);

  const columns: ColumnProps<UpgradeHistoryData>[] = [
    {
      title: '设备名称',
      dataIndex: 'deviceName',
    },
    {
      title: '任务名称',
      dataIndex: 'taskName',
    },
    {
      title: '版本',
      dataIndex: 'version',
    },
    {
      title: '状态',
      dataIndex: 'state',
      render: record => <Badge status={upgradeStatus.get(record.value)} text={record.text}/>,
    },
    {
      title: '进度',
      dataIndex: 'progress',
      render: (text: any) => text + ' %',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: '200px',
      render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
      sorter: true,
      defaultSortOrder: 'descend',
    },
  ];

  const onTableChange = (
    pagination: PaginationConfig,
    filters: any,
    sorter: SorterResult<UpgradeHistoryData>,
  ) => {
    handleSearch({
      pageIndex: Number(pagination.current) - 1,
      pageSize: pagination.pageSize,
      terms: searchParam.terms,
      sorts: sorter,
    });
  };

  return (
    <div>
      <Spin spinning={spinning}>
        <Card style={{ marginBottom: 20 }}>
          <div>
            <SearchForm
              search={(params: any) => {
                let terms = {
                  firmwareId: props.firmwareId,
                  taskName$LIKE:params['taskName$LIKE'],
                };
                if (props.taskId !== '' && props.taskId) {
                  terms['taskId'] = props.taskId;
                }
                if (props.historyState !== '' && props.historyState) {
                  terms['state'] = props.historyState;
                }

                handleSearch({
                  terms: { ...terms },
                  pageSize: 10,
                  sorts: searchParam.sorts,
                });
              }}
              formItems={[{
                label: '任务名称',
                key: 'taskName$LIKE',
                type: 'string',
              }]}
            />
          </div>
          <div className={styles.StandardTable}>
            <Table
              columns={columns}
              dataSource={data?.data}
              rowKey="id"
              onChange={onTableChange}
              pagination={{
                current: data.pageIndex + 1,
                total: data.total,
                pageSize: data.pageSize,
                showQuickJumper: true,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
                showTotal: (total: number) =>
                  `共 ${total} 条记录 第  ${data.pageIndex + 1}/${Math.ceil(
                    data.total / data.pageSize,
                  )}页`,
              }}
            />
          </div>
        </Card>
      </Spin>
    </div>
  );
};

export default UpgradeHistory;
