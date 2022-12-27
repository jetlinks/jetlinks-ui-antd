import type { FunctionMetadata } from '@/pages/device/Product/typings';
import React, { useEffect, useRef, useState } from 'react';
import { Button, DatePicker, Input, InputNumber, Select, Tooltip } from 'antd';
import { useIntl } from '@@/plugin-locale/localeExports';
import type { ProColumns } from '@jetlinks/pro-table';
import { EditableProTable } from '@jetlinks/pro-table';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm from '@ant-design/pro-form';
import { InstanceModel, service } from '@/pages/device/Instance';
import moment from 'moment';
import './index.less';
import { GeoPoint, MetadataJsonInput } from '@/components';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { onlyMessage } from '@/utils/util';

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
  const [result, setResult] = useState<any>();
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
        return <Input placeholder={'请输入' + name} />;
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
    // console.log(data,1111)
    const array = [];
    const properties = data.valueType ? data.valueType.properties : data.inputs;
    for (const datum of properties) {
      const type = datum.valueType ? datum.valueType.type : '-';

      array.push({
        id: datum.id,
        name: datum.name,
        type: type,
        format: datum.valueType ? datum.valueType.format : undefined,
        options: datum.valueType ? datum.valueType.elements : undefined,
        json: type === 'object' ? datum['json']?.['properties'][0] : undefined,
        value: undefined,
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
    const id = InstanceModel.detail?.id;
    if (id && formData.table) {
      const data = {};
      formData.table.forEach((d: any) => {
        if (d.value) {
          if (d.type === 'date') {
            data[d.id] = moment(d.value).format('YYYY-MM-DD HH:mm:ss');
          } else if (d.type === 'object') {
            data[d.id] = JSON.parse(d.value);
          } else {
            data[d.id] = d.value;
          }
        }
      });
      const res = await service.invokeFunction(id, props.data.id, data);
      if (res.status === 200) {
        setResult(res.result);
        onlyMessage('操作成功');
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
            清空
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
        <Input.TextArea
          value={Array.isArray(result) ? JSON.stringify(result?.[0]) : JSON.stringify(result)}
          rows={6}
        />
      </div>
    </div>
  );
};
