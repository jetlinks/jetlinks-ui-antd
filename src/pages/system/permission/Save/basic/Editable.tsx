import { Table, Input, Popconfirm, Form, Divider, message, Icon, Select, Radio } from 'antd';
import React, { useState, Fragment, useContext } from 'react';
import { FormComponentProps } from 'antd/es/form';
import { PermissionAction } from '../../data.d';

const EditableContext = React.createContext({});

const supportDataAccessTypeMap = new Map();
supportDataAccessTypeMap.set('DENY_FIELDS', '字段权限');
supportDataAccessTypeMap.set('OWN_USER', '仅限本人');
supportDataAccessTypeMap.set('POSITION_SCOPE', '仅限本人及下属');
supportDataAccessTypeMap.set('DEPARTMENT_SCOPE', '所在部门');
supportDataAccessTypeMap.set('org', '机构');

const EditableCell: React.FC = (props: any) => {
  const form: any = useContext(EditableContext);

  const getInput = () => {
    const selectOption = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of supportDataAccessTypeMap) {
      selectOption.push(<Select.Option key={key}>{value}</Select.Option>);
    }

    switch (props.dataIndex) {
      case 'properties.supportDataAccess':
        return (
          <Select mode="multiple" style={{ width: '100%' }} placeholder="点击选择">
            {selectOption}
          </Select>
        );
      case 'properties.defaultCheck':
        return (
          <Radio.Group size="small">
            <Radio value>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        );
      default:
        return <Input size="small" />;
    }
  };

  const { getFieldDecorator } = form;
  const { editing, dataIndex, title, inputType, record, index, children, ...restProps } = props;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item style={{ margin: 0 }}>
          {getFieldDecorator(dataIndex, {
            rules: [
              {
                required: dataIndex !== 'properties.supportDataAccess',
                message: `请输入 ${title}!`,
              },
            ],
            initialValue: record[dataIndex],
          })(getInput())}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

interface EditableTableProps extends FormComponentProps {
  data: PermissionAction[] | any[];
  save: Function;
}

interface EditableTableState {
  data: PermissionAction[];
  editingKey: string;
}

const EditableTable: React.FC<EditableTableProps> = props => {
  const initState: EditableTableState = {
    data: props.data || [],
    editingKey: '',
  };
  const [editingKey, setEditingKey] = useState(initState.editingKey);
  const [data, setData] = useState(initState.data);

  const cancel = () => {
    setEditingKey('');
  };

  const isEditing = (record: any) => record.action === editingKey;

  const components = {
    body: {
      cell: EditableCell,
    },
  };

  const save = (form: any, action: string) => {
    form.validateFields((error: any, row: any) => {
      if (error) {
        return;
      }
      const newData = [...data];
      const index = newData.findIndex(item => action === item.action);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
      props.save(newData);
    });
  };

  const edit = (action: string) => {
    setEditingKey(action);
  };

  const remove = (action: string) => {
    const newData = data.filter(item => item.action !== action);
    setData(newData);
    props.save(newData);
  };

  // action: string;
  // describe: string;
  // name: string;
  // properties?: any;
  // key?: string;
  // defaultCheck: boolean;
  // checked?: boolean;
  const handleAdd = () => {
    const key = `${data.length + 1}`;
    data.push({
      // key: key,
      action: '',
      describe: '',
      defaultCheck: true,
      name: '',
    });
    setData(data);
    setEditingKey(key);
  };

  const columnsTemp: any[] = [
    {
      title: '操作类型',
      dataIndex: 'action',
      width: '20%',
      editable: true,
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: '20%',
      editable: true,
    },
    {
      title: '描述',
      dataIndex: 'describe',
      width: '20%',
      editable: true,
    },
    // {
    //     title: '支持数据权限',
    //     dataIndex: 'properties.supportDataAccess',
    //     width: '40%',
    //     editable: true,
    //     render: (text: string[], record: any) => {
    //         if (text) {
    //             try {
    //                 return (text).map(e => {
    //                     return <Tag key={e} color={"blue"} style={{ width: 120, textAlign: "center", marginBottom: 4 }}>{supportDataAccessTypeMap.get(e)}</Tag>
    //                 });
    //             } catch (error) {
    //                 return null;
    //             }
    //         } else {
    //             return text;
    //         }
    //     }
    // },
    {
      title: (
        <span>
          操作
          <Divider type="vertical" />
          <Icon type="plus" onClick={() => handleAdd()} />
        </span>
      ),
      dataIndex: 'operation',
      render: (text: any, record: any) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            {
              <a onClick={() => save(props.form, record.action)} style={{ marginRight: 8 }}>
                保存
              </a>
            }
            <Popconfirm title="确认取消？" onConfirm={() => cancel()}>
              <a>取消</a>
            </Popconfirm>
          </span>
        ) : (
          <Fragment>
            <a type="link" onClick={() => edit(record.action)}>
              编辑
            </a>
            <Divider type="vertical" />
            <a type="link" onClick={() => remove(record.action)}>
              删除
            </a>
          </Fragment>
        );
      },
    },
  ];

  const columns = columnsTemp.map((col: any) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: any) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        align: 'center',
      }),
    };
  });

  return (
    <EditableContext.Provider value={props.form}>
      <Table
        title={() => '操作配置'}
        size="small"
        rowKey="action"
        components={components}
        bordered
        dataSource={data}
        columns={columns}
        rowClassName={() => 'editable-row'}
        pagination={false}
        onChange={() => message.success('保存成功！！')}
      />
    </EditableContext.Provider>
  );
};

export default Form.create<EditableTableProps>()(EditableTable);
