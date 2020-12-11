import { Table, Alert, Button, Row, Col, Drawer, message, Spin, Form, Input } from 'antd';

import React, { useEffect, useState } from 'react';
import apis from '@/services';
import encodeQueryParam from '@/utils/encodeParam';

interface Props {
  close: Function;
  data: any;
  checkedUser: any[];
}
interface State {
  list: any[];
  selectRow: any[];
  loading: boolean;
  keyword: string;
}
const UserList: React.FC<Props> = props => {
  const initState: State = {
    list: [],
    selectRow: [],
    loading: false,
    keyword: '',
  };

  const [list, setList] = useState(initState.list);
  const [selectRow, setSelectRow] = useState(initState.selectRow);
  const [loading, setLoading] = useState(initState.loading);
  const [keyword, setKeyword] = useState(initState.keyword);

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

  const search = (params?: any) => {
    const idList = props.checkedUser.map(i => i.userId).join(',');

    apis.users
      .list(
        encodeQueryParam({
          terms: {
            id$nin: idList,
            ...params,
          },
        }),
      )
      .then(response => {
        if (response) {
          setList(response.result.data);
        }
      });
  };

  useEffect(() => {
    // const idList = props.checkedUser.map(i => i.userId).join(',');
    // apis.users.list(encodeQueryParam({
    //   terms: {
    //     id$nin: idList
    //   }
    // })).then(response => {
    //   if (response) {
    //     setList(response.result.data);
    //   }
    // });
    search();
  }, []);

  // { "dimensionTypeId": "org", "dimensionId": "org1", "dimensionName": "机构1", "userId": "1209763126217355264", "userName": "antd" }
  const bindUser = () => {
    setLoading(true);
    selectRow.forEach((item, index) => {
      apis.org
        .bind({
          userId: item.id,
          userName: item.username,
          dimensionTypeId: props.data.typeId,
          dimensionId: props.data.id,
          dimensionName: props.data.name,
        })
        .then(() => {
          // if (response) {
          //     message.success('操作成功');
          //     props.close();
          // }
        })
        .catch(() => {
          message.success('绑定失败！');
          setLoading(false);
        });
      if (index === selectRow.length - 1) {
        message.success('操作成功！');
        props.close();
        setLoading(false);
      }
    });
  };
  return (
    <Drawer visible title="选择用户" onClose={() => props.close()} width={800}>
      <Row>
        <Col span={20}>
          <Form.Item label="用户姓名" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
            <Input value={keyword} onChange={e => setKeyword(e.target.value)} />
          </Form.Item>
        </Col>
        <Col span={4} style={{ textAlign: 'center' }}>
          <Button
            type="primary"
            style={{ marginTop: 3 }}
            onClick={() =>
              search({
                name$LIKE: keyword,
                // 'username$LIKE@and': keyword,
              })
            }
          >
            搜索
          </Button>
        </Col>
      </Row>
      <Spin spinning={loading}>
        {selectRow.length > 0 && (
          <Row style={{ marginBottom: 10 }}>
            <Col span={20}>
              <Alert message={`已选择${selectRow.length}项`} type="info" showIcon />
            </Col>
            <Col span={1} />
            <Col span={3}>
              <Button
                type="primary"
                onClick={() => {
                  bindUser();
                }}
              >
                保存
              </Button>
            </Col>
          </Row>
        )}

        <Table
          rowKey="id"
          rowSelection={rowSelection}
          columns={[
            {
              dataIndex: 'name',
              title: '用户姓名',
            },
            {
              dataIndex: 'username',
              title: '用户名',
            },
          ]}
          dataSource={list}
        />
      </Spin>
    </Drawer>
  );
};
export default UserList;
