import React, {useState, Fragment, useEffect} from 'react';
import { Table } from 'antd';
import { ColumnProps } from 'antd/es/table';
import Detail from './function-detail';

interface Props {
  data: any[];
}

interface State {
  data: any[];
  current: any;
  visible: boolean;
}

const Functions: React.FC<Props> = props => {

  const initState: State = {
    data: props.data || [],
    current: {},
    visible: false,
  };
  const [visible, setVisible] = useState(initState.visible);
  const [current, setCurrent] = useState(initState.current);
  const [data, setData] = useState(initState.data);

  useEffect(() => {
    setData(props.data)
  }, [props.data]);

  const columns: ColumnProps<any>[] = [
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
      dataIndex: 'async',
      render: text => (text ? '是' : '否'),
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
      <Table rowKey="id" columns={columns} dataSource={data} />
      <Detail visible={visible} data={current} onCancel={() => {
        setVisible(false);
        setCurrent({});
      }} />
    </div>
  );
};
export default Functions;
