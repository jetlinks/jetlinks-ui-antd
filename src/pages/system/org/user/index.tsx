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

  const handleSearch = () => {
    apis.org.bindUser(encodeQueryParam({ terms: { dimensionId: props.data.id } })).then(res => {
      if (res) {
        setUserList(res.result);
      }
    });
  };
  useEffect(() => {
    handleSearch();
  }, []);

  // useEffect(() => {
  //     console.log('123');
  // }, [bindVisible]);

  const remove = (item: any) => {
    apis.org.unBindUser(item.id).then(repsonse => {
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
    let count = 0;
    selectRow.forEach(i => {
      apis.org
        .unBindUser(i.id)
        .then(response => {
          if (response) {
            count += 1;
            if (count === selectRow.length) {
              message.success('解绑成功');
              setLoading(false);
              setSelectRow([]);
              handleSearch();
            }
          }
        })
        .catch(() => {
          message.error('解绑失败');
          setLoading(false);
          handleSearch();
        });
    });
  };

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      // setSelectRowKeys();
      setSelectRow(selectedRows);
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
        columns={[
          {
            dataIndex: 'userName',
            title: '用户名',
          },
          {
            title: '操作',
            render: (record: any) => (
              <Popconfirm title="确认删除绑定关系吗？" onConfirm={() => remove(record)}>
                <a>删除</a>
              </Popconfirm>
            ),
          },
        ]}
        dataSource={userList}
      />
      {bindVisible && (
        <UserList
          data={props.data}
          checkedUser={userList}
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
