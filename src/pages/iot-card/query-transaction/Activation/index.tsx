import React, { useState, useEffect } from 'react';
import styles from '@/utils/table.less';
import SearchForm from '@/components/SearchForm';
import { Table } from 'antd';
import apis from '@/services';
import encodeQueryParam from '@/utils/encodeParam';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import moment from 'moment';

interface State {
  searchParam: any;
  resultList: any;
  spinning: boolean;
}

const Activation: React.FC<{}> = () => {

  const initState: State = {
    searchParam: {
      pageSize: 10,
      sorts: {
        field: 'time',
        order: 'desc',
      },
    },
    spinning: true,
    resultList: {},
  };

  const [searchParam, setSearchParam] = useState(initState.searchParam);
  const [resultList, setResultList] = useState(initState.resultList);
  const [spinning, setSpinning] = useState(initState.spinning);

  const handleSearch = (params?: any) => {
    setSearchParam(params);
    apis.flowCard.stateOperateLog(encodeQueryParam(params))
      .then((response: any) => {
        if (response.status === 200) {
          setResultList(response.result)
          setSpinning(false)
        }
      }).catch(() => {
      });
  };

  useEffect(() => {
    handleSearch(searchParam);
  }, [])

  const columns: ColumnProps<any>[] = [
    {
      title: '物联卡Id',
      align: 'center',
      dataIndex: 'cardId',
    },
    {
      title: '订单号',
      align: 'center',
      dataIndex: 'transactionId',
    },
    {
      title: '操作类型',
      align: 'center',
      dataIndex: 'type',
    },
    {
      title: '消息',
      align: 'center',
      dataIndex: 'message',
      // ellipsis: true,
    },
    {
      title: '时间',
      align: 'center',
      dataIndex: 'time',
      render: (text: any) => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '/'),
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'result',
      render: (text: any) => `${text}`,
    }
  ];

  const onTableChange = (
    pagination: PaginationConfig
  ) => {
    let { terms } = searchParam;
    handleSearch({
      pageIndex: Number(pagination.current) - 1,
      pageSize: pagination.pageSize,
      terms,
      sorts: searchParam.sorts,
    });
  };

  return (
    <div className={styles.StandardTable}>
      <SearchForm
        search={(params: any) => {
          setSearchParam(params);
          handleSearch({ terms: params, pageSize: 10, sorts: searchParam.sorts });
        }}
        formItems={[{
          label: "物联卡Id",
          key: "cardId$LIKE",
          type: 'string',
        },
        {
          label: "订单号",
          key: "transactionId$LIKE",
          type: 'string'
        },
        {
          label: "操作类型",
          key: "type$LIKE",
          type: 'list',
          props: {
            data: [
              { id: '激活', name: '激活'},
              { id: '停机', name: '停机'},
              { id: '复机', name: '复机'},
            ],
            mode: 'radio'
          }
        }]}
      />
      <div className={styles.StandardTable}>
        <Table
          loading={spinning}
          columns={columns}
          dataSource={resultList?.data}
          rowKey="id"
          onChange={onTableChange}
          pagination={{
            current: resultList.pageIndex + 1,
            total: resultList.total,
            pageSize: resultList.pageSize,
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total: number) =>
              `共 ${total} 条记录 第  ${resultList.pageIndex + 1}/${Math.ceil(
                resultList.total / resultList.pageSize,
              )}页`,
          }}
        />
      </div>
    </div>
  )
}

export default Activation;
