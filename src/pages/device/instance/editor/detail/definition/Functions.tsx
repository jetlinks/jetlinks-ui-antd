import React, {useState, Fragment, useContext, useEffect} from 'react';
import { Card, Button, Table, Divider } from 'antd';
import { ColumnProps } from 'antd/es/table';
import FunctionDefin from './component/function';
import { FunctionMeta } from './component/data.d';
import {TenantContext} from "@/pages/device/instance/editor/detail/Definition";

interface Props {
  save: Function;
  data: any[];
  unitsData: any;
}

interface State {
  data: FunctionMeta[];
  current: Partial<FunctionMeta>;
  visible: boolean;
}

const Functions: React.FC<Props> = props => {
  const tenantContextData = useContext(TenantContext);

  const initState: State = {
    data: props.data || [],
    current: {},
    visible: false,
  };
  const [visible, setVisible] = useState(initState.visible);
  const [current, setCurrent] = useState(initState.current);
  const [data, setData] = useState(initState.data);

  useEffect(() => {
    setData(tenantContextData.functions || [])
  }, [tenantContextData]);

  const editItem = (item: any) => {
    setVisible(true);
    setCurrent(item);
  };

  const deleteItem = (item: any) => {
    const temp = data.filter(e => e.id !== item.id);
    setData(temp);
    props.save(temp);
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
          <a onClick={() => editItem(record)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => deleteItem(record)}>删除</a>
        </Fragment>
      ),
    },
  ];

  const saveFunctionData = (item: FunctionMeta) => {
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
          <Button type="primary" onClick={() => {
            setCurrent({});
            setVisible(true);
          }}>
            添加
          </Button>
        }
      >
        <Table rowKey="id" columns={columns} dataSource={data} />
      </Card>
      {visible && (
        <FunctionDefin
          data={current}
          unitsData={props.unitsData}
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
