import React, { useState, Fragment } from 'react';
import { Card, Button, Table, Divider } from 'antd';
import { ColumnProps } from 'antd/es/table';
import FunctionDefin from '../../component/function';
import { FunctionMeta } from '../../component/data.d';

interface Props {
  save: Function;
  data: any[];
}

interface State {
  data: FunctionMeta[];
  current: Partial<FunctionMeta>;
  visible: boolean;
}

const Functions: React.FC<Props> = props => {
  const initState: State = {
    data: props.data,
    current: {},
    visible: false,
  };
  const [visible, setVisible] = useState(initState.visible);
  const [current, setCurrent] = useState(initState.current);
  const [data, setData] = useState(initState.data);

  const editItem = (item: any) => {
    setVisible(true);
    setCurrent(item);
  };

  const deleteItem = (item: any) => {
    setData(data.filter(e => e.id !== item.id));
    props.save(data);
  };

  const columns: ColumnProps<FunctionMeta>[] = [
    {
      title: '功能标识',
      dataIndex: 'id',
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '是否异步',
      dataIndex: 'isAsync',
      render: text => (text ? '是' : '否'),
    },
    {
      title: '描述',
      dataIndex: 'description',
    },
    {
      title: '操作',
      width: '250px',
      align: 'center',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => editItem(record)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => deleteItem(record)}>删除</a>
        </Fragment>
      ),
    },
  ];

  const saveFunctionData = (item: FunctionMeta) => {
    // let item = items;
    const i = data.findIndex((j: any) => j.id === item.id);
    if (i > -1) {
      data[i] = item;
    } else {
      data.push(item);
    }
    setVisible(false);
    setData(data);
    props.save(data);
  };

  return (
    <div>
      <Card
        title="功能定义"
        style={{ marginBottom: 20 }}
        extra={
          <Button type="primary" onClick={() => setVisible(true)}>
            添加
          </Button>
        }
      >
        <Table rowKey="id" columns={columns} dataSource={data} />
      </Card>
      {visible && (
        <FunctionDefin
          data={current}
          save={(item: FunctionMeta) => {
            saveFunctionData(item);
          }}
          close={() => {
            setVisible(false);
            setCurrent({});
          }}
        />
      )}
    </div>
  );
};
export default Functions;
