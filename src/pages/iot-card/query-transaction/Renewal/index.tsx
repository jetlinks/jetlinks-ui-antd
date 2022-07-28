import React, { useEffect, useState } from 'react';
import styles from '@/utils/table.less';
import SearchForm from '@/components/SearchForm';
import { Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import apis from '@/services';
import encodeQueryParam from '@/utils/encodeParam';
import { ColumnProps, PaginationConfig, SorterResult } from 'antd/lib/table';
import moment from 'moment';

interface State {
  searchParam: any;
  resultList: any;
  spinning: boolean;
}

const Renewal: React.FC<{}> = () => {
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
    apis.flowCard.rechargeLog(encodeQueryParam(params))
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
      title: '配置名称',
      align: 'center',
      dataIndex: 'configName',
    },
    {
      title: '配置ID',
      align: 'center',
      dataIndex: 'configId',
    },
    {
      title: '充值金额',
      align: 'center',
      dataIndex: 'chargeMoney',
    },
    {
      title: '支付方式',
      align: 'center',
      dataIndex: 'paymentType',
    },
    {
      title: '支付URL',
      align: 'center',
      dataIndex: 'url',
      ellipsis: true,
    },
    {
      title: '订单号',
      align: 'center',
      dataIndex: 'orderNumber',
    },
    {
      title: '消息',
      align: 'center',
      dataIndex: 'message',
    },
    {
      title: '	提交订单结果',
      align: 'center',
      dataIndex: 'result',
      render: (text: any) => `${text}`,
    },
    {
      title: '时间',
      align: 'center',
      dataIndex: 'time',
      render: (text: any) => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '/'),
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
          label: "配置ID",
          key: "configId$LIKE",
          type: 'string'
        },
        {
          label: "配置名称",
          key: "configName$LIKE",
          type: 'string'
        },
        {
          label: "订单号",
          key: "orderNumber$LIKE",
          type: 'string',
        }]}
      />
      <Table
        loading={spinning}
        columns={columns}
        dataSource={resultList.data}
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
  )
}

export default Renewal;
