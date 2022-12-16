import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import ProForm, { ProFormInstance } from '@ant-design/pro-form';
import { DatePicker, Input, InputNumber, Select, Tooltip } from 'antd';
import { GeoPoint, MetadataJsonInput } from '@/components';
import { EditableProTable, ProColumns } from '@jetlinks/pro-table';
import { QuestionCircleOutlined } from '@ant-design/icons';

type DiagnoseFormProps = {
  data: any[];
};

type FunctionTableDataType = {
  id: string;
  name: string;
  type: string;
};

const DiagnoseForm = forwardRef((props: DiagnoseFormProps, ref) => {
  const formRef = useRef<ProFormInstance<any>>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);

  const getItemNode = (record: any) => {
    const type = record.type;
    const name = record.name;

    switch (type) {
      case 'enum':
        return (
          <Select
            style={{ width: '100%', textAlign: 'left' }}
            options={record.options}
            fieldNames={{ label: 'text', value: 'value' }}
            placeholder={'请选择' + name}
          />
        );
      case 'boolean':
        return (
          <Select
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
        return <InputNumber style={{ width: '100%' }} placeholder={'请输入' + name} />;
      case 'geoPoint':
        return <GeoPoint />;
      case 'object':
        return <MetadataJsonInput json={record.json} />;
      case 'date':
        return (
          // <>
          //   {
          //     // @ts-ignore
          //     <DatePicker
          //       format={record.format || 'YYYY-MM-DD HH:mm:ss'}
          //       style={{ width: '100%' }}
          //     />
          //   }
          // </>
          // @ts-ignore
          <DatePicker format={'YYYY-MM-DD HH:mm:ss'} style={{ width: '100%' }} showTime />
        );
      default:
        return <Input placeholder={type === 'array' ? '多个数据用英文,分割' : '请输入' + name} />;
    }
  };

  const columns: ProColumns<FunctionTableDataType>[] = [
    {
      dataIndex: 'name',
      title: '参数名称',
      width: 120,
      editable: false,
      ellipsis: true,
    },
    {
      dataIndex: 'type',
      title: '输入类型',
      width: 120,
      editable: false,
      render: (row) => {
        switch (row) {
          case 'array':
            return (
              <span>
                {row}
                <Tooltip
                  title={
                    <div>
                      <p>输入示例：</p>
                      <p>配置类型为int时，输入[1,2,3,4]</p>
                    </div>
                  }
                >
                  <QuestionCircleOutlined style={{ marginLeft: 8 }} />
                </Tooltip>
              </span>
            );
          case 'object':
            return (
              <span>
                {row}
                <Tooltip
                  title={
                    <div>
                      <p>请按照json格式输入</p>
                    </div>
                  }
                >
                  <QuestionCircleOutlined style={{ marginLeft: 8 }} />
                </Tooltip>
              </span>
            );
          case 'file':
            return (
              <span>
                {row}
                <Tooltip
                  title={
                    <div>
                      <p>输入示例：</p>
                      <p>模型配置为base64时，输入YXNkZmRzYWY=</p>
                    </div>
                  }
                >
                  <QuestionCircleOutlined style={{ marginLeft: 8 }} />
                </Tooltip>
              </span>
            );
          case 'geoPoint':
            return (
              <span>
                {row}
                <Tooltip
                  title={
                    <div>
                      <p>输入示例：</p>
                      <p>[102,12231, 39.251423]</p>
                    </div>
                  }
                >
                  <QuestionCircleOutlined style={{ marginLeft: 8 }} />
                </Tooltip>
              </span>
            );
          default:
            return row;
        }
      },
    },
    {
      title: '值',
      dataIndex: 'value',
      align: 'center',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项是必填项',
          },
        ],
      },
      renderFormItem: (_, row: any) => {
        return getItemNode(row.record);
      },
    },
  ];

  const handleDataSource = (data: any) => {
    const array = [];
    for (const datum of data) {
      const type = datum.valueType ? datum.valueType.type : '-';
      array.push({
        id: datum.id,
        name: datum.name,
        type: type,
        format: datum.valueType ? datum.valueType.format : undefined,
        options: datum.valueType ? datum.valueType.elements : undefined,
        json: type === 'object' ? datum?.json?.properties?.[0] : undefined,
        value: undefined,
      });
    }
    setEditableRowKeys(array.map((d) => d.id));
    formRef.current?.setFieldsValue({
      table: array,
    });
  };

  /**
   * 执行
   */
  const actionRun = () => {
    return new Promise(async (resolve) => {
      const formData = await formRef.current?.validateFields().catch(() => {
        resolve(false);
      });
      if (formData?.table) {
        resolve(formData.table);
      } else {
        resolve(false);
      }
    });
  };

  useEffect(() => {
    handleDataSource(props.data);
  }, [props.data]);

  useImperativeHandle(ref, () => ({
    save: actionRun,
  }));

  return (
    <div>
      <ProForm<{ table: FunctionTableDataType[] }> formRef={formRef} submitter={false}>
        <EditableProTable<FunctionTableDataType>
          rowKey="id"
          name="table"
          columns={columns}
          recordCreatorProps={false}
          editable={{
            type: 'multiple',
            editableKeys,
            onChange: setEditableRowKeys,
          }}
        />
      </ProForm>
    </div>
  );
});

export default DiagnoseForm;
