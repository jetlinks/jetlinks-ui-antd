import { Table, Input, Popconfirm, Form, Switch, InputNumber } from 'antd';
import React, { useEffect, useState } from 'react';
import { FormComponentProps } from 'antd/lib/form';
import { service } from '../index';
import _ from 'lodash';

interface PropsEdit extends FormComponentProps{

}

interface Props {
  data: any[];
  save: Function;
  id: string;
  table: string;
}
export const EditableContext = React.createContext({});

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create<PropsEdit>()(EditableRow);

const EditableCell = (props: any) => {
  const {
    editable,
    dataIndex,
    title,
    record,
    index,
    handleSave,
    children,
    ...restProps
  } = props;

  const [editing, setEditing] = useState(false);
  // const [node, setNode] = useState<any>(null);

  const renderCell = (form: any) => {

    const save = () => {
      form.validateFields((error, values) => {
        if (error) {
          return;
        }
        handleSave({ ...record, ...values });
        setEditing(false)
      });
    };

    const isFlag = record[dataIndex] !== "" && !!String(record[dataIndex])

    const getInput = () => {
      if(dataIndex === 'length' || dataIndex === 'scale'){
        return <Form.Item style={{ margin: 0 }}>
          {form.getFieldDecorator(dataIndex, {
            rules: [
              {
                required: (dataIndex === 'length' || dataIndex === 'scale' || dataIndex === 'name') ,
                message: `${title}不能为空`,
              },
            ],
            initialValue: record[dataIndex] || '',
          })(<InputNumber onPressEnter={save} onBlur={save} />)}
        </Form.Item>
      } else if(dataIndex === 'notnull'){
        return <Form.Item style={{ margin: 0 }}>
          {form.getFieldDecorator(dataIndex, {
            valuePropName: 'checked',
            initialValue: record[dataIndex]
          })(<Switch size="small" onChange={(e) => {
            handleSave({ ...record, notnull: e });
          }} />)}
        </Form.Item>
      }
      return <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          initialValue: record[dataIndex] || '',
        })(<Input style={{width: '150px'}} onPressEnter={save} onBlur={save} />)}
      </Form.Item>
    }

    return (editing || !isFlag) ? getInput() : (
      <div
        className="editable-cell-value-wrap"
        style={{ cursor: 'pointer', minWidth: '10px' }}
        onClick={() => {
          setEditing(true);
        }}
      >
        {children}
      </div>
    );
  };

  return (
    <td {...restProps}>
      {editable ? (
        <EditableContext.Consumer>{renderCell}</EditableContext.Consumer>
      ) : (
        children
      )}
    </td>
  );
}

const EditableFormTable = (props: Props) => {

  const [data, setData] = useState<any[]>( [...props.data]);

  useEffect(() => {
    setData([...props.data]);
  }, [props?.data])

  const handleSave = (row: any) => {
    const newData = [...data];
    const index = newData.findIndex(item => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setData([...newData])
    props.save(newData)
  };
  const components = {
    body: {
      row: EditableFormRow,
      cell: EditableCell,
    },
  };
  const handleDelete = (key: string) => {
    service.rdbTables(props.id, props.table).subscribe(resp => {
      if(resp.status === 200){
        if([..._.map(resp.result.columns, 'name')].includes(key)){
          service.delRdbTablesColumn(props.id, props.table, [key]).subscribe(resp => {
            if(resp.status === 200){
              setData([...data.filter(item => item.id !== key)])
            }
          })
        }else {
          setData([...data.filter(item => item.id !== key)])
        }
      }
    })
  };

  const columns: any[] = [
    {
      title: '列名',
      dataIndex: 'name',
      key: 'name',
      editable: true,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      editable: true,
    },
    {
      title: '长度',
      dataIndex: 'length',
      key: 'length',
      editable: true,
    },
    {
      title: '精度',
      dataIndex: 'scale',
      key: 'scale',
      editable: true,
    },
    {
      title: '不能为空',
      dataIndex: 'notnull',
      key: 'notnull',
      editable: true,
      render: (text: any) => <Switch size="small" defaultChecked={!!text} />
    },
    {
      title: '注释',
      dataIndex: 'comment',
      key: 'comment',
      editable: true,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (text: any, record: any) =>
        data.length >= 1 ? (
          <Popconfirm title="确认删除列?" onConfirm={() => handleDelete(record.id)}>
            <a>删除</a>
          </Popconfirm>
        ) : null,
    },
  ]

  const column = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: any) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editable: col.editable,
        handleSave
      }),
    };
  });

  return (
      <Table
        components={components}
        bordered
        dataSource={data}
        columns={column}
        rowKey={"id"}
      />
  );
}


export default EditableFormTable;
