import SearchForm from '@/components/SearchForm';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Card, Divider, message, Popconfirm } from 'antd';
import Table, { ColumnProps } from 'antd/lib/table';
import React, { Fragment, useEffect, useState } from 'react';
import styles from '@/utils/table.less';
import Save from './save';
import Service from './service';

export type NodeItem = {
  id: string;
  name: string;
  descirption: string;
};

const NodeType = () => {
  const service = new Service('visualization-component');
  const [visible, setVisible] = useState<boolean>(false);
  const [result, setResult] = useState<any>();
  const [current, setCurrent] = useState<Partial<NodeItem>>();
  const [searchParam, setSearchParam] = useState<any>({});
  const columns: ColumnProps<NodeItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '分类名称',
      dataIndex: 'name',
    },

    {
      title: '操作',
      render: (text, record) => (
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
          <Popconfirm
            title="确认删除？"
            onConfirm={() => {
              service.remove(record.id).subscribe(
                () => message.success('删除成功'),
                () => message.error('删除失败'),
                () => handleSearch(searchParam),
              );
            }}
          >
            <a>删除</a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  useEffect(() => {
    handleSearch(searchParam);
  }, []);

  const handleSearch = (params?: any) => {
    service.queryTree(params).subscribe(data => {
      setResult(data);
    });
  };
  const save = (data: Partial<NodeItem>) => {
    service.saveOrUpdate(data).subscribe(
      () => {
        message.success('保存成功');
        handleSearch({});
      },
      () => {},
      () => setVisible(false),
    );
  };

  const onTableChange = () => {};

  // const importData = () => {
    // const list: any[] = [];
    // Tools.forEach(item => {
    //   list.push({ name: item.group, type: 'dir', id: item.id });
    //   const child = item.children;
    //   child.forEach(i => {
    //     list.push({
    //       name: i.name,
    //       icon: i.img,
    //       type: 'node',
    //       parentId: item.id,
    //       data: JSON.stringify(i.data),
    //     });
    //   });
    // });
    // service.add(list).subscribe(data => {
    //   message.success('保存成功');
    //   console.log(data, 'ddd');
    // });
  // };
  return (
    <PageHeaderWrapper title="组件管理">
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div>
            <SearchForm
              search={(params: any) => {
                setSearchParam(params);
                handleSearch({ terms: params, pageSize: 10 });
              }}
              formItems={[
                {
                  label: '组件分类',
                  key: 'name$LIKE',
                  type: 'string',
                },
              ]}
            />
          </div>
          <div className={styles.tableListOperator}>
            <Button
              icon="plus"
              type="primary"
              onClick={() => {
                setVisible(true);
              }}
            >
              新建
            </Button>

            {/* <Button onClick={importData}>导入数据</Button> */}
          </div>
          <div className={styles.StandardTable}>
            {result && (
              <Table
                loading={!result}
                dataSource={result}
                columns={columns}
                rowKey="id"
                onChange={onTableChange}
              />
            )}
          </div>
          {visible && <Save save={save} data={current} close={() => setVisible(false)} />}
        </div>
      </Card>
    </PageHeaderWrapper>
  );
};
export default NodeType;
