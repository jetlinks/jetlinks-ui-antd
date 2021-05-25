import { Drawer, Popconfirm, message, Button, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import apis from '@/services';
import encodeQueryParam from '@/utils/encodeParam';
import UserList from './UserList';

interface Props {
  close: Function;
  data: any;
}
interface State {
  userList: any[];
  bindVisible: boolean;
  selectRow: any[];
  loading: boolean;
}
const BindUser: React.FC<Props> = props => {
  const initState: State = {
    userList: [],
    bindVisible: false,
    selectRow: [],
    loading: false,
  };
  const [userList, setUserList] = useState(initState.userList);
  const [bindVisible, setBindVisible] = useState(initState.bindVisible);
  const [selectRow, setSelectRow] = useState(initState.selectRow);
  const [loading, setLoading] = useState(initState.loading);
  const [searchParam, setSearchParam] = useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const [result, setResult] = useState<any>({});
  const handleSearch = (params?: any) => {
    apis.users
      .list(
        encodeQueryParam({
          ...searchParam,
          ...params,
          terms: { 'id$in-dimension$role': props.data.id },
        }),
      )
      .then(res => {
        if (res.status) {
          setResult(res?.result);
          setUserList(res?.result.data);
        }
      });
    // apis.role.bindUser(encodeQueryParam({ terms: { dimensionId: props.data.id } })).then(res => {
    //   if (res) {
    //     setUserList(res.result);
    //   }
    // });
  };
  useEffect(() => {
    handleSearch();
  }, []);

  const remove = (item: any) => {
    apis.role.unBindUser(props.data.id, [item.id]).then(repsonse => {
      if (repsonse) {
        message.success('解绑成功');
        const temp = selectRow.filter(i => i !== item.id);
        setSelectRow(temp);
      }
      handleSearch();
    });
  };

  const batchRemove = () => {
    setLoading(true);
    apis.role
      .unBindUser(props.data.id, selectRow)
      .then(response => {
        if (response.status === 200) {
          message.success('解绑成功');
        }
      })
      .catch(() => {
        message.error('解绑失败');
        setLoading(false);
        handleSearch();
      })
      .finally(() => {
        setLoading(false);
        handleSearch();
        setSelectRow([]);
      });
  };

  const rowSelection = {
    onChange: (selectedRowKeys: any, rows: any) => {
      // setSelectRowKeys();
      setSelectRow(selectedRowKeys);
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record: any) => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  };

  return (
    <Drawer visible title="绑定用户" width="40VW" onClose={() => props.close()}>
      <Button
        style={{ marginBottom: 10 }}
        type="primary"
        icon="plus"
        onClick={() => setBindVisible(true)}
      >
        绑定
      </Button>
      {selectRow.length > 0 && (
        <Button
          onClick={() => {
            batchRemove();
          }}
          type="danger"
          style={{ marginLeft: 10 }}
        >
          {`解除绑定：${selectRow.length}项`}
        </Button>
      )}
      <Table
        loading={loading}
        rowKey="id"
        rowSelection={rowSelection}
        pagination={{
          pageSize: result?.pageSize,
          total: result?.total,
        }}
        onChange={pagination => {
          handleSearch({ pageIndex: (pagination.current || 1) - 1 });
        }}
        columns={[
          {
            dataIndex: 'name',
            title: '姓名',
          },
          {
            dataIndex: 'username',
            title: '用户名',
          },
          {
            title: '操作',
            render: (record: any) => (
              <Popconfirm title="确认删除绑定关系吗？" onConfirm={() => remove(record)}>
                <a>解绑</a>
              </Popconfirm>
            ),
          },
        ]}
        dataSource={userList}
      />
      {bindVisible && (
        <UserList
          checkedUser={userList}
          data={props.data}
          close={() => {
            setBindVisible(false);
            handleSearch();
          }}
        />
      )}
    </Drawer>
  );
};
export default BindUser;
