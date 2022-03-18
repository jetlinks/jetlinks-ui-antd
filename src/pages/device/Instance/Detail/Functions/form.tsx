import type { FunctionMetadata } from '@/pages/device/Product/typings';
import React, { useState, useEffect, useRef } from 'react';
import { Input, Button } from 'antd';
import { useIntl } from '@@/plugin-locale/localeExports';
import type { ProColumns } from '@jetlinks/pro-table';
import { EditableProTable } from '@jetlinks/pro-table';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm from '@ant-design/pro-form';
import { InstanceModel, service } from '@/pages/device/Instance';
import './index.less';

type FunctionProps = {
  data: FunctionMetadata;
};

type FunctionTableDataType = {
  id: string;
  name: string;
  type: string;
};

export default (props: FunctionProps) => {
  const intl = useIntl();
  const [dataSource, setDataSource] = useState<FunctionTableDataType[]>([]);
  const [result, setResult] = useState('');
  const formRef = useRef<ProFormInstance<any>>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);

  const columns: ProColumns<FunctionTableDataType>[] = [
    {
      dataIndex: 'name',
      title: '1',
      width: 200,
      editable: false,
    },
    {
      dataIndex: 'type',
      title: '2',
      width: 200,
      editable: false,
    },
    {
      title: intl.formatMessage({
        id: 'pages.data.option',
        defaultMessage: '操作',
      }),
      dataIndex: 'value',
      align: 'center',
      width: 260,
    },
  ];

  const handleDataSource = (data: any) => {
    const array = [];
    const properties = data.valueType ? data.valueType.properties : [];

    for (const datum of properties) {
      array.push({
        id: datum.id,
        name: datum.name,
        type: datum.valueType ? datum.valueType.type : '-',
        value: '',
      });
    }
    setEditableRowKeys(array.map((d) => d.id));
    setDataSource(array);
    formRef.current?.setFieldsValue({
      table: array,
    });
  };

  /**
   * 执行
   */
  const actionRun = async () => {
    const formData = await formRef.current?.validateFields();
    console.log(formData);
    const id = InstanceModel.detail?.id;
    if (id && formData.table) {
      const data = {};
      formData.table.forEach((d: any) => {
        data[d.id] = d.value;
      });
      const res = await service.invokeFunction(id, props.data.id, data);
      if (res.status === 200) {
        setResult(res.result);
      }
    }
  };

  useEffect(() => {
    handleDataSource(props.data);
  }, [props.data]);

  return (
    <div className="device-function-content">
      <div className="left">
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
        <div className="button-tool">
          <Button type={'primary'} onClick={actionRun}>
            {intl.formatMessage({
              id: 'pages.data.option.invoke',
              defaultMessage: '执行',
            })}
          </Button>
          <Button
            onClick={() => {
              formRef.current?.setFieldsValue({
                table: dataSource,
              });
            }}
          >
            {intl.formatMessage({
              id: 'pages.data.option.cancel',
              defaultMessage: '取消',
            })}
          </Button>
        </div>
      </div>
      <div className="right">
        <p>
          {intl.formatMessage({
            id: 'pages.device.instance.function.result',
            defaultMessage: '执行结果',
          })}
          ：
        </p>
        <Input.TextArea value={result} rows={6} />
      </div>
    </div>
  );
};
