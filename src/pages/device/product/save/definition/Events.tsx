import { Card, Table, Divider, Button } from 'antd';
import React, { Fragment, useState } from 'react';
import { ColumnProps } from 'antd/es/table';
import { EventsMeta } from '../../component/data.d';
import EventDefin from '../../component/event';

interface Props {
  save: Function;
  data: any[];
}

const gradeText = {
  ordinary: '普通',
  warn: '警告',
  urgent: '紧急',
};

interface State {
  data: EventsMeta[];
  current: Partial<EventsMeta>;
  visible: boolean;
}

const Events: React.FC<Props> = props => {
  const initState: State = {
    data: props.data,
    current: {},
    visible: false,
  };
  const [visible, setVisible] = useState(initState.visible);
  const [data, setData] = useState(initState.data);
  const [current, setCurrent] = useState(initState.current);

  const editItem = (item: any) => {
    setVisible(true);
    setCurrent(item);
  };

  const deleteItem = (item: EventsMeta) => {
    setData(data.filter(e => e.id !== item.id));
    props.save(data);
  };

  const columns: ColumnProps<EventsMeta>[] = [
    {
      title: '事件标识',
      dataIndex: 'id',
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '输出参数',
      dataIndex: 'parameters',
      render: () => <a>查看</a>,
    },
    {
      title: '事件级别',
      dataIndex: 'expands.level',
      render: text => gradeText[text],
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

  const saveEventData = (items: EventsMeta) => {
    let item = items;
    if (!item.id) {
      item = { ...item, id: (data.length + 1).toString() };
      data.push(item);
    } else {
      const i = data.findIndex(j => j.id === item.id);
      data[i] = item;
    }
    setVisible(false);
    setData(data);
    props.save(data);
  };

  return (
    <div>
      <Card
        title="事件定义"
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
        <EventDefin
          data={current}
          save={(item: EventsMeta) => {
            saveEventData(item);
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

export default Events;
