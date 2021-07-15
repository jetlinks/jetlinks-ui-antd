import { Table } from 'antd';
import React, {Fragment, useEffect, useState} from 'react';
import {ColumnProps} from 'antd/es/table';
import Detail from './event-detail';

interface Props {
  data: any[];
}

const gradeText = {
  ordinary: '普通',
  warn: '警告',
  urgent: '紧急',
};

interface State {
  data: any[];
  current: any;
  visible: boolean;
}

const Events: React.FC<Props> = props => {
  const initState: State = {
    data: props.data || [],
    current: {},
    visible: false,
  };
  const [visible, setVisible] = useState(initState.visible);
  const [data, setData] = useState(initState.data);
  const [current, setCurrent] = useState(initState.current);

  useEffect(() => {
    setData(props.data)
  }, [props.data]);

  const columns: ColumnProps<any>[] = [
    {
      title: '事件标识',
      dataIndex: 'id',
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '事件级别',
      dataIndex: 'expands?.level',
      render: text => gradeText[text],
    },
    {
      title: '描述',
      dataIndex: 'description',
      width:'30%',
      ellipsis:true
    },
    {
      title: '操作',
      width: '250px',
      align: 'center',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => {
            setVisible(true);
            setCurrent(record);
          }}>查看</a>
        </Fragment>
      ),
    },
  ];
  return (
    <div>
      <Table rowKey="id" columns={columns} dataSource={data}/>
      <Detail visible={visible} data={current} onCancel={() => {
        setVisible(false);
        setCurrent({});
      }} />
    </div>
  );
};

export default Events;
