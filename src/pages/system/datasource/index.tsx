import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Card, Divider, message, Popconfirm } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';
import styles from '@/utils/table.less';
import SearchForm from '@/components/SearchForm';
import ProTable from '../permission/component/ProTable';
import Service from './service';
import encodeQueryParam from '@/utils/encodeParam';
import Save from './save';

export const service = new Service('datasource/config');

const Datasource = () => {
  const [result, setResult] = useState<any>({});
  const [searchParam, setSearchParam] = useState<any>({
    pageIndex: 0,
    pageSize: 10,
    sorts: { field: 'id', order: 'desc' },
  });
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<any>({});

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '类型',
      dataIndex: 'typeId',
    },
    {
      title: '说明',
      dataIndex: 'description',
    },
    {
      title: '状态',
      dataIndex: 'state',
      render: (value: any) => value.text,
    },
    {
      title: '操作',
      render: (_: any, record: any) => (
        <Fragment>
          <a
            onClick={() => {
              setCurrent(record);
              setVisible(true);
            }}
          >
            编辑
          </a>
          <Divider type="vertical" />
          {record.state.value === 'enabled' ? (
            <Popconfirm
              title="确认禁用吗？"
              onConfirm={() => {
                service.changeStatus(record.id, 'disable').subscribe(
                  () => message.success('操作成功'),
                  () => {},
                  () => handleSearch(searchParam),
                );
              }}
            >
              <a>禁用</a>
            </Popconfirm>
          ) : (
            <>
              <Popconfirm
                title="确认启用吗？"
                onConfirm={() => {
                  service.changeStatus(record.id, 'enable').subscribe(
                    () => message.success('操作成功'),
                    () => {},
                    () => handleSearch(searchParam),
                  );
                }}
              >
                <a>启用</a>
              </Popconfirm>
              <Divider type="vertical" />
              <Popconfirm
                title="确认删除吗？"
                onConfirm={() => {
                  service.remove(record.id).subscribe(() => {
                    message.success('操作成功');
                    handleSearch(searchParam);
                  });
                }}
              >
                <a>删除</a>
              </Popconfirm>
            </>
          )}
        </Fragment>
      ),
    },
  ];

  useEffect(() => {
    handleSearch(searchParam);
  }, []);

  const handleSearch = (param: any) => {
    setSearchParam(param);
    service.query(encodeQueryParam(param)).subscribe(data => {
      setResult(data);
    });
  };
  return (
    <PageHeaderWrapper title="数据源管理">
      <Card bordered={false} style={{ marginBottom: 16 }}>
        <div className={styles.tableList}>
          <div>
            <SearchForm
              search={(params: any) => {
                setSearchParam(params);
                handleSearch({ terms: params, pageSize: 10 });
              }}
              formItems={[
                {
                  label: 'id',
                  key: 'id',
                  type: 'string',
                },
                {
                  label: '名称',
                  key: 'name$LIKE',
                  type: 'string',
                },
              ]}
            />
            <div>
              <Button
                icon="plus"
                type="primary"
                onClick={() => {
                  setVisible(true);
                }}
              >
                新建
              </Button>
            </div>
          </div>
        </div>
      </Card>
      <Card className={styles.StandardTable}>
        <ProTable
          dataSource={result?.data}
          columns={columns}
          rowKey="id"
          onSearch={(params: any) => {
            handleSearch({ ...params, terms: { ...params?.terms, ...searchParam?.terms } });
          }}
          paginationConfig={result}
        />
      </Card>
      {visible && (
        <Save
          close={() => {
            setVisible(false);
            setCurrent({});
            handleSearch(searchParam);
          }}
          //   visible={visible}
          data={current}
        />
      )}
    </PageHeaderWrapper>
  );
};
export default Datasource;
