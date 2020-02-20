import { Drawer, List, Avatar, Popconfirm, message, Button } from 'antd';
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
}
const BindUser: React.FC<Props> = props => {
  const initState: State = {
    userList: [],
    bindVisible: false,
  };
  const [userList, setUserList] = useState(initState.userList);
  const [bindVisible, setBindVisible] = useState(initState.bindVisible);

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
      }
      handleSearch();
    });
  };

  return (
    <Drawer visible title="绑定用户" width="40VW" onClose={() => props.close()}>
      <Button type="primary" icon="plus" onClick={() => setBindVisible(true)}>
        新建
      </Button>
      <List
        className="demo-loadmore-list"
        itemLayout="horizontal"
        dataSource={userList}
        renderItem={item => (
          <List.Item
            actions={[
              <Popconfirm
                title="确定删除该绑定关系？"
                onConfirm={() => {
                  remove(item);
                }}
              >
                <a key="list-loadmore-edit">删除</a>
              </Popconfirm>,
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              }
              title={<a>{item.userName}</a>}
            />
          </List.Item>
        )}
      />
      {bindVisible && (
        <UserList
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
