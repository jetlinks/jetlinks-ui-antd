import type { ProColumns } from '@jetlinks/pro-table';
import { EditableProTable } from '@jetlinks/pro-table';
import React, { useEffect, useRef, useState } from 'react';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm from '@ant-design/pro-form';
import TypeModel from './TypeModel';

type FunctionTableDataType = {
  id: string;
  name: string;
  type: string;
};

interface FunctionCallProps {
  functionData: any[];
  value?: any;
  onChange?: (data: any) => void;
  name?: any;
  thenName: number;
  branchGroup?: number;
}

export default (props: FunctionCallProps) => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const formRef = useRef<ProFormInstance<any>>();

  useEffect(() => {
    console.log(props.value, props.functionData);
    if (props.functionData && props.functionData.length) {
      setEditableRowKeys(props.functionData.map((d) => d.id));
      if (props.value) {
        const tableData = props.functionData.map((item: any) => {
          const oldValue = props.value.find((oldItem: any) => oldItem.name === item.id);
          if (oldValue) {
            return {
              ...item,
              value: oldValue.value,
            };
          }
          return item;
        });
        formRef.current?.setFieldsValue({
          table: tableData,
        });
      } else {
        formRef.current?.setFieldsValue({
          table: props.functionData,
        });
      }
    } else {
      formRef.current?.setFieldsValue({
        table: [],
      });
    }
  }, [props.value, props.functionData]);

  const getItemNode = (record: any) => {
    const type = record.type;
    return (
      <TypeModel
        value={record.value}
        type={type}
        record={record}
        name={props.name}
        branchGroup={props.branchGroup}
        thenName={props.thenName}
        format={record?.format}
      />
    );
  };

  const columns: ProColumns<FunctionTableDataType>[] = [
    {
      dataIndex: 'name',
      title: '参数名称',
      width: 200,
      editable: false,
    },
    {
      dataIndex: 'type',
      title: '类型',
      width: 200,
      editable: false,
    },
    {
      title: '值',
      dataIndex: 'value',
      align: 'center',
      width: 260,
      renderFormItem: (_, row) => {
        return getItemNode(row.record);
      },
    },
  ];

  return (
    <ProForm<{ table: FunctionTableDataType[] }>
      formRef={formRef}
      name={props.name || 'proForm'}
      submitter={false}
      onValuesChange={() => {
        const values = formRef.current?.getFieldsValue();
        // console.log(values, 'values');
        if (props.onChange) {
          props.onChange(
            values.table.map((item: any) => ({
              name: item.id,
              value: item.value,
            })),
          );
        }
      }}
    >
      <EditableProTable
        rowKey="id"
        name={'table'}
        recordCreatorProps={false}
        columns={columns}
        size={'small'}
        editable={{
          type: 'multiple',
          editableKeys,
          onChange: setEditableRowKeys,
        }}
      />
    </ProForm>
  );
};
