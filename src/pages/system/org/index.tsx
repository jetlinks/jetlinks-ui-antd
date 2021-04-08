import React, { useEffect, useState, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from '@/utils/table.less';
import { Card, Button, Table, message, Divider, Popconfirm } from 'antd';
import { Dispatch, connect } from 'dva';
import { PaginationConfig, ColumnProps } from 'antd/lib/table';
import { OrgItem } from './data.d';
import { ConnectState } from '@/models/connect';
import encodeQueryParam from '@/utils/encodeParam';
import Save from './save';
import Authorization from '@/components/Authorization';
import BindUser from './user';
import apis from '@/services';

interface Props {
  org: any;
  dispatch: Dispatch;
  location: Location;
  loading: boolean;
}

interface State {
  data: any;
  searchParam: any;
  saveVisible: boolean;
  currentItem: Partial<OrgItem>;
  parentId: string | null;
  autzVisible: boolean;
  userVisible: boolean;
}

const OrgList: React.FC<Props> = props => {
  const {
    dispatch,
    org: { result },
  } = props;

  const initState: State = {
    data: result,
    searchParam: { pageSize: 10 },
    saveVisible: false,
    currentItem: {},
    parentId: null,
    autzVisible: false,
    userVisible: false,
  };

  const [searchParam, setSearchParam] = useState(initState.searchParam);
  const [saveVisible, setSaveVisible] = useState(initState.saveVisible);
  const [currentItem, setCurrentItem] = useState(initState.currentItem);
  const [parentId, setParentId] = useState(initState.parentId);
  const [autzVisible, setAutzVisible] = useState(initState.autzVisible);
  const [userVisible, setUserVisible] = useState(initState.userVisible);

  const handleSearch = (params?: any) => {
    dispatch({
      type: 'org/query',
      payload: encodeQueryParam(params),
    });
    setSearchParam(params);
  };

  useEffect(() => {
    handleSearch({
      terms: {
        typeId: 'org',
      },
      paging: false,
    });
  }, []);

  const saveOrUpdate = (item: OrgItem) => {
    if (currentItem.id) {
      dispatch({
        //编辑
        type: 'org/insert',
        payload: encodeQueryParam(item),
        callback: (response: any) => {
          if (response.status === 200) {
            message.success('保存成功');
          }
          setSaveVisible(false);
          handleSearch(searchParam);
        },
      });
    } else {
      apis.org.add(item).then(res => {
        if (res.status === 200) {
          message.success('保存成功');
        }
        setSaveVisible(false);
        handleSearch(searchParam);
      });
    }
  };
  const handleDelete = (item: any) => {
    dispatch({
      type: 'org/remove',
      payload: item.id,
      callback: (response: any) => {
        if (response) {
          message.success('删除成功');
          handleSearch(searchParam);
        }
      },
    });
  };

  const onTableChange = (pagination: PaginationConfig, filters: any, sorter: any) => {
    handleSearch({
      pageIndex: Number(pagination.current) - 1,
      pageSize: pagination.pageSize,
      terms: searchParam.terms,
      sorts: sorter,
    });
  };

  const columns: ColumnProps<OrgItem>[] = [
    {
      title: '机构标识',
      dataIndex: 'id',
      width: '45%',
    },
    {
      title: '机构名称',
      dataIndex: 'name',
      width: '15%',
    },
    {
      title: '描述',
      dataIndex: 'describe',
      width: '10%',
    },
    {
      title: '操作',
      width: '20%',
      render: (text, record) => (
        <Fragment>
          <a
            onClick={() => {
              setCurrentItem(record);
              setParentId(null);
              setSaveVisible(true);
            }}
          >
            编辑
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              setCurrentItem({});
              setSaveVisible(true);
              setParentId(record.id);
            }}
          >
            添加子机构
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              setCurrentItem(record);
              setAutzVisible(true);
            }}
          >
            权限分配
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              setCurrentItem(record);
              setUserVisible(true);
            }}
          >
            绑定用户
          </a>
          <Divider type="vertical" />
          <Popconfirm
            title="确认删除此机构吗？"
            onConfirm={() => {
              handleDelete(record);
            }}
          >
            <a>删除</a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];
  return (
    <PageHeaderWrapper title="机构管理">
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>
            {/* <Search search={(params: any) => {
                            setSearchParam(params);
                            handleSearch({ terms: params, pageSize: 10 })
                        }} /> */}
          </div>
          <div className={styles.tableListOperator}>
            <Button
              icon="plus"
              type="primary"
              onClick={() => {
                setParentId(null);
                setCurrentItem({});
                setSaveVisible(true);
              }}
            >
              新建
            </Button>
          </div>
          <div className={styles.StandardTable}>
            <Table
              loading={props.loading}
              dataSource={result}
              columns={columns}
              rowKey="id"
              onChange={onTableChange}
              pagination={false}
              // pagination={{
              //     current: result.pageIndex + 1,
              //     total: result.total,
              //     pageSize: result.pageSize,
              //     showQuickJumper: true,
              //     showSizeChanger: true,
              //     pageSizeOptions: ['10', '20', '50', '100'],
              //     showTotal: (total: number) => `共 ${total} 条记录 第  ${result.pageIndex + 1}/${Math.ceil(result.total / result.pageSize)}页`
              // }}
            />
          </div>
        </div>
      </Card>
      {saveVisible && (
        <Save
          parentId={parentId}
          save={(item: any) => saveOrUpdate(item)}
          data={currentItem}
          close={() => {
            setSaveVisible(false);
            setCurrentItem({});
          }}
        />
      )}
      {autzVisible && (
        <Authorization
          close={() => {
            setAutzVisible(false);
            setCurrentItem({});
          }}
          target={currentItem}
          targetType="org"
        />
      )}
      {userVisible && (
        <BindUser
          data={currentItem}
          close={() => {
            setUserVisible(false);
          }}
        />
      )}
    </PageHeaderWrapper>
  );
};
export default connect(({ org, loading }: ConnectState) => ({
  org,
  loading: loading.models.org,
}))(OrgList);
