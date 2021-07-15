import React, {Fragment, useEffect, useState} from 'react';
import {FormComponentProps} from 'antd/es/form';
import { Form, Table} from 'antd';
import {ColumnProps} from 'antd/lib/table';
import Detail from './properties-detail';

interface Props extends FormComponentProps {
  data: any[];
}

interface State {
  data: any[];
  current: any;
  visible: boolean;
}

const Properties: React.FC<Props> = (props: Props) => {

  const initState: State = {
    data: props.data || [
    ],
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
      title: '属性标识',
      dataIndex: 'id',
    },
    {
      title: '属性名称',
      dataIndex: 'name',
    },
    {
      title: '数据类型',
      dataIndex: 'valueType',
      render: text => text?.type,
    },
    {
      title: '是否只读',
      dataIndex: 'expands.readOnly',
      render: text => ((text === 'true' || text === true) ? '是' : '否'),
    },
    {
      title: '说明',
      dataIndex: 'description',
      width: '30%',
      ellipsis: true
    },
    {
      title: '操作',
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
export default Form.create<Props>()(Properties);
