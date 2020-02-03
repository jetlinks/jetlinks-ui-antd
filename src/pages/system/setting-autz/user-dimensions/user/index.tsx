import { Table, Card, Button, Modal, message } from 'antd';
import React, { Fragment, useState } from 'react';
import { ColumnProps } from 'antd/es/table';
import { UserItem } from '@/pages/system/users/data';
import styles from '@/utils/table.less';
import Search from './search';
import Save from './save';
import apis from '@/services';

interface Props {
  data: UserItem[];
  dimensionId: string | undefined;
}
interface State {
  saveVisible: boolean;
}

const User: React.FC<Props> = props => {
  const initState: State = {
    saveVisible: false,
  };

  const [saveVisible, setSaveVisible] = useState(initState.saveVisible);

  const columns: ColumnProps<UserItem>[] = [
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '是否启用',
      dataIndex: 'status',
      render: text => (text === 1 ? '是' : '否'),
    },
    {
      title: '操作',
      width: '250px',
      align: 'center',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => remove(record)}>删除</a>
        </Fragment>
      ),
    },
  ];

  const remove = (record: UserItem) => {
    let conetnt = '';
    if (props.dimensionId) {
      conetnt = '确定从当前维度中删除用户？';
    } else {
      conetnt = '确定删除此用户？此操作会删除用户的所有维度。';
    }
    Modal.confirm({
      title: '提示',
      content: conetnt,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        if (props.dimensionId) {
          //删除dimension
          apis.dimensions
            .deleteByUserAndDimensionId({
              userId: record.id,
              dimensionId: props.dimensionId,
            })
            .then(e => {
              message.success('删除成功');
            })
            .catch(() => {});
        } else {
          //删除这个用户全部维度
          apis.dimensions
            .deleteByUserId({
              userId: record.id,
            })
            .then(e => {
              message.success('删除成功');
            })
            .catch(() => {});
        }
      },
      onCancel() {},
    });
  };

  const rowSelection = {
    // selectedRowKeys,
    // onChange: this.onSelectChange,
  };

  return (
    <div>
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>
            {/* <Search search={(params: any) => {
                             setSearchParam(params);
                             handleSearch({ terms: params, pageSize: 10 })
                        }} /> */}
          </div>
          <div className={styles.tableListOperator}>
            <Button icon="plus" type="primary" onClick={() => setSaveVisible(true)}>
              添加用户
            </Button>
          </div>
          <div className={styles.StandardTable}>
            <Table
              rowKey="id"
              rowSelection={rowSelection}
              columns={columns}
              dataSource={props.data}
            />
          </div>
        </div>
      </Card>
      {saveVisible && <Save close={() => setSaveVisible(false)} />}
    </div>
  );
};
export default User;
