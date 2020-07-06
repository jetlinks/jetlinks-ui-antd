import React, { Fragment, useEffect, useState } from 'react';
import { Button, Card, Divider, message, Popconfirm, Spin, Table } from 'antd';
import { ColumnProps, PaginationConfig, SorterResult } from 'antd/lib/table';
import moment from 'moment';
import encodeQueryParam from '@/utils/encodeParam';
import apis from '@/services';
import { UpgradeTaskData } from '@/pages/device/firmware/data';
import styles from '@/utils/table.less';

interface Props {
  firmwareId?: string;
  productId?: string;
  jumpPedal: Function;
}

interface State {
  data: any;
  saveUpgradeTaskData: any;
  searchParam: any;
  spinning: boolean;
}

const UpgradeTask: React.FC<Props> = (props) => {

  const initState: State = {
    data: {},
    saveUpgradeTaskData: {},
    searchParam: { pageSize: 10 },
    spinning: false,
  };

  const [searchParam, setSearchParam] = useState(initState.searchParam);
  const [data, setData] = useState(initState.data);
  const [spinning, setSpinning] = useState(initState.spinning);

  const handleSearch = (params?: any) => {
    setSearchParam(params);
    apis.firmware.upgradeTask(encodeQueryParam(params))
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
    handleSearch({
      pageSize: 10,
      terms: {
        firmwareId: props.firmwareId,
      },
    });
  }, []);

  const columns: ColumnProps<UpgradeTaskData>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '任务名称',
      dataIndex: 'name',
    },
    {
      title: '升级方式',
      dataIndex: 'mode.text',
    },
    {
      title: '超时时间',
      dataIndex: 'timeoutSeconds',
      render: (text: any) => text + ' 秒',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: '200px',
      render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
      sorter: true,
      defaultSortOrder: 'descend',
    },
    {
      title: '操作',
      width: '120px',
      align: 'center',
      render: (record: any) => (
        <Fragment>
          <a onClick={() => {
            props.jumpPedal(record);
          }}
          >
            查看
          </a>
          <Divider type="vertical"/>
          <Popconfirm title="确定删除此任务吗？请谨慎操作" onConfirm={() => removeUpgrade(record)}>
            <a>
              删除
            </a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  const onTableChange = (
    pagination: PaginationConfig,
    filters: any,
    sorter: SorterResult<UpgradeTaskData>,
  ) => {
    handleSearch({
      pageIndex: Number(pagination.current) - 1,
      pageSize: pagination.pageSize,
      terms: searchParam.terms,
      sorts: sorter,
    });
  };

  const removeUpgrade = (item: any) => {
    setSpinning(true);
    apis.firmware.removeUpgrade(item.id)
      .then((response: any) => {
        if (response.status === 200) {
          message.success('删除成功');
          handleSearch(searchParam);
        }
      }).catch(() => {
    });
  };

  return (
    <div>
      <Spin spinning={spinning}>
        <Card style={{ marginBottom: 20 }}>
          <div className={styles.tableListOperator} style={{ paddingBottom: 20 }}>
            <Button icon="plus" type="primary" onClick={() => {
              props.jumpPedal({});
            }}>
              新建
            </Button>
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

export default UpgradeTask;
