import type { ProColumns } from '@jetlinks/pro-table';
import { EditableProTable } from '@jetlinks/pro-table';
import { Input, InputNumber, Select } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm from '@ant-design/pro-form';
import { DatePickerFormat } from '@/pages/rule-engine/Scene/Save/components';

type FunctionTableDataType = {
  id: string;
  name: string;
  type: string;
};

interface FunctionCallProps {
  functionData: any[];
  value?: any;
  onChange?: (data: any) => void;
  name?: string;
  productId?: string;
}

export default (props: FunctionCallProps) => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const formRef = useRef<ProFormInstance<any>>();

  useEffect(() => {
    setEditableRowKeys(props.functionData.map((d) => d.id));
    formRef.current?.setFieldsValue({
      table: props.functionData,
    });
  }, [props.functionData]);

  useEffect(() => {
    if (props.functionData && props.functionData.length && props.value) {
      formRef.current?.setFieldsValue({
        table: props.functionData.map((item: any) => {
          const oldValue = props.value.find((oldItem: any) => oldItem.name === item.id);
          if (oldValue) {
            return {
              ...item,
              value: oldValue.value,
            };
          }
          return item;
        }),
      });
    } else {
      formRef.current?.setFieldsValue({
        table: [],
      });
    }
  }, [props.value, props.functionData]);

  useEffect(() => {
    if (props.productId && props.onChange) {
      props.onChange([]);
    }
  }, [props.productId]);

  const getItemNode = (record: any) => {
    const type = record.type;
    const name = record.name;

    switch (type) {
      case 'enum':
        return (
          <Select
            value={record.value}
            style={{ width: '100%', textAlign: 'left' }}
            options={record.options}
            fieldNames={{ label: 'text', value: 'value' }}
            placeholder={'请选择' + name}
          />
        );
      case 'boolean':
        return (
          <Select
            value={record.value}
            style={{ width: '100%', textAlign: 'left' }}
            options={[
              { label: 'true', value: true },
              { label: 'false', value: false },
            ]}
            placeholder={'请选择' + name}
          />
        );
      case 'int':
      case 'long':
      case 'float':
      case 'double':
        return (
          <InputNumber
            value={record.value}
            style={{ width: '100%' }}
            placeholder={'请输入' + name}
          />
        );
      case 'date':
        return (
          <>
            {
              // @ts-ignore
              <DatePickerFormat
                value={record.value}
                format={record.format || 'YYYY-MM-DD HH:mm:ss'}
                style={{ width: '100%' }}
              />
            }
          </>
        );
      default:
        return <Input value={record.value} placeholder={'请输入' + name} />;
    }
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
      renderFormItem: (_, row: any) => {
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
        name="table"
        columns={columns}
        recordCreatorProps={false}
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
