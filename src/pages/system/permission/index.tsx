import React, { Fragment, useEffect, useState } from 'react';
import { Divider, Card, message, Button, Popconfirm } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from '@/utils/table.less';
import { connect } from 'dva';
import { Dispatch, ConnectState } from '@/models/connect';
import { PermissionItem } from './data.d';
import encodeQueryParam from '@/utils/encodeParam';
import Save from './Save';
import SearchForm from '@/components/SearchForm';
import ProTable from './component/ProTable';
// import SettingAutz from "../setting-autz";
interface Props {
  permission: any;
  dispatch: Dispatch;
  location: Location;
  loading: boolean;
}

interface State {
  data: any;
  searchParam: any;
  saveVisible: boolean;
  currentItem: Partial<PermissionItem>;
  saveLoading: boolean;
  autzVisible: boolean;
}

const PermissionList: React.FC<Props> = props => {
  const { dispatch } = props;
  const { result } = props.permission;

  const initState: State = {
    data: result,
    searchParam: { pageSize: 10 },
    saveVisible: false,
    saveLoading: false,
    currentItem: {},
    autzVisible: false,
  };

  const [currentItem, setCurrentItem] = useState(initState.currentItem);
  const [searchParam, setSearchParam] = useState(initState.searchParam);
  const [saveVisible, setSaveVisible] = useState(initState.saveVisible);
  const [saveLoading, setSaveLoading] = useState(initState.saveLoading);

  const handleSearch = (params?: any) => {
    const temp = { ...searchParam, ...params };
    setSearchParam(temp);
    dispatch({
      type: 'permission/query',
      payload: encodeQueryParam(temp),
    });
  };

  useEffect(() => {
    handleSearch(searchParam);
  }, []);

  const edit = (record: PermissionItem) => {
    setSaveVisible(true);
    setCurrentItem(record);
  };

  const saveOrUpdate = (permission: PermissionItem) => {
    setSaveLoading(true);
    dispatch({
      type: 'permission/insert',
      payload: encodeQueryParam(permission),
      callback: (response: any) => {
        if (response.status === 200) {
          setCurrentItem({});
          setSaveLoading(false);
          message.success('添加成功');
          setSaveVisible(false);
          handleSearch(setSearchParam);
        }
      },
    });
  };
  const handleDelete = (params: any) => {
    dispatch({
      type: 'permission/remove',
      payload: params.id,
      callback: () => {
        message.success('删除成功');
        handleSearch(searchParam);
      },
    });
  };

  const columns: any[] = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '状态',
      dataIndex: 'status',
      filters: [
        {
          text: '启用',
          value: 1
        },
        {
          text: '禁用',
          value: 0,
        }
      ],
      render: (text: any) => (text === 1 ? '启用' : '禁用'),
    },
    {
      title: '操作',
      render: (text: any, record: any) => (
        <Fragment>
          <a onClick={() => edit(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm
            title="确定删除此权限吗？"
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
    <PageHeaderWrapper title="权限管理">
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div>
            <SearchForm
              search={(params: any) => {
                setSearchParam({ pageSize: 10, terms: { ...params, ...searchParam.terms } });
                handleSearch({ terms: { ...params, ...searchParam.terms }, pageSize: 10 });
              }}
              formItems={[
                {
                  label: "ID",
                  key: "id$LIKE",
                  type: 'string'
                },
                {
                  label: "名称",
                  key: "name$LIKE",
                  type: 'string'
                }
              ]}
            />
          </div>
          <div className={styles.tableListOperator}>
            <Button
              icon="plus"
              type="primary"
              onClick={() => {
                setSaveVisible(true);
              }}
            >
              新建
            </Button>
          </div>
          <div className={styles.StandardTable}>
            <ProTable
              loading={props.loading}
              dataSource={result?.data}
              columns={columns}
              rowKey="id"
              onSearch={(params: any) => {
                handleSearch(params);
              }}
              paginationConfig={result}
            />
          </div>
        </div>
      </Card>
      {saveVisible && (
        <Save
          close={() => {
            setSaveVisible(false);
            setCurrentItem({});
            handleSearch(searchParam);
          }}
          loading={saveLoading}
          save={(permission: PermissionItem) => {
            saveOrUpdate(permission);
          }}
          data={currentItem}
        />
      )}
    </PageHeaderWrapper>
  );
};
export default connect(({ permission, loading }: ConnectState) => ({
  permission,
  loading: loading.models.permission,
}))(PermissionList);
