import React, { useContext, useEffect, useState } from 'react';
import { Form, Input, message, Pagination, Select, Table } from 'antd';
import { service } from '@/pages/device/Instance';

const EditableContext: any = React.createContext(null);

const EditableRow = ({ ...props }) => {
  const [form] = Form.useForm();

  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: string;
  record: any;
  list: any[];
  handleSave: (record: any) => void;
}

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  list,
  handleSave,
  ...restProps
}: EditableCellProps) => {
  const form: any = useContext(EditableContext);

  const save = async () => {
    try {
      const values = await form.validateFields();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  useEffect(() => {
    if (record) {
      form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    }
  }, [record]);

  let childNode = children;

  if (editable) {
    childNode = (
      <Form.Item style={{ margin: 0 }} name={dataIndex}>
        <Select onChange={save}>
          {list.map((item: any) => (
            <Select.Option key={item?.id} value={item?.id}>
              {item?.id}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};

interface Props {
  data: any;
  type: 'device' | 'product';
}

const EditableTable = (props: Props) => {
  const baseColumns = [
    {
      title: '物模型中属性名',
      dataIndex: 'name',
    },
    {
      title: '物模型中属性标识',
      dataIndex: 'id',
    },
    {
      title: '协议中属性标识',
      dataIndex: 'metadataId',
      width: '30%',
      editable: true,
    },
  ];
  const metadata = JSON.parse(props?.data?.metadata || '{}');
  const [properties, setProperties] = useState<any[]>(metadata?.properties || []);
  const [value, setValue] = useState<string>('');
  const [dataSource, setDataSource] = useState<any>({
    data: properties.slice(0, 10),
    pageSize: 10,
    pageIndex: 0,
    total: properties.length,
  });
  const [protocolMetadata, setProtocolMetadata] = useState<any[]>([]);

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const initData = async () => {
    let resp = null;
    if (props.type === 'device') {
      resp = await service.queryDeviceMetadata(props.data.id);
    } else {
      resp = await service.queryProductMetadata(props.data.id);
    }
    if (resp.status === 200) {
      const data = resp.result;
      const obj: any = {};
      data.map((i: any) => {
        obj[i?.originalId] = i?.metadataId || '';
      });
      const list = properties.map((item) => {
        return {
          ...item,
          metadataId: obj[item.id] || '',
        };
      });
      setProperties([...list]);
      setDataSource({
        data: list.slice(
          dataSource.pageIndex * dataSource.pageSize,
          (dataSource.pageIndex + 1) * dataSource.pageSize,
        ),
        pageSize: dataSource.pageSize,
        pageIndex: dataSource.pageIndex,
        total: list.length,
      });
    }
  };

  useEffect(() => {
    service
      .queryProtocolMetadata(
        props.type === 'device' ? props.data?.protocol : props.data?.messageProtocol,
        props.type === 'device' ? props.data?.transport : props.data?.transportProtocol,
      )
      .then((resp) => {
        if (resp.status === 200) {
          setProtocolMetadata(JSON.parse(resp.result || '{}')?.properties || []);
          initData();
        }
      });
  }, []);

  const handleSave = async (row: any) => {
    const newData = [...dataSource.data];
    const index = newData.findIndex((item) => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setDataSource({
      ...dataSource,
      data: [...newData],
    });
    if (item?.metadataId !== row?.metadataId) {
      const resp = await service[
        props.type === 'device' ? 'saveDeviceMetadata' : 'saveProductMetadata'
      ](props.data?.id, [
        {
          metadataType: 'property',
          metadataId: row.metadataId,
          originalId: row.id,
          others: {},
        },
      ]);
      if (resp.status === 200) {
        message.success('操作成功！');
        // 刷新
        initData();
      }
    }
  };

  const handleSearch = (params: any) => {
    if (params.name) {
      const data = properties.filter((i: any) => {
        return i?.name.indexOf(params?.nmae) !== -1;
      });
      setDataSource({
        data: data.slice(
          params.pageIndex * params.pageSize,
          (params.pageIndex + 1) * params.pageSize,
        ),
        pageSize: params.pageSize,
        pageIndex: params.pageIndex,
        total: data.length,
      });
    } else {
      setDataSource({
        data: properties.slice(
          params.pageIndex * params.pageSize,
          (params.pageIndex + 1) * params.pageSize,
        ),
        pageSize: params.pageSize,
        pageIndex: params.pageIndex,
        total: properties.length,
      });
    }
  };

  const columns = baseColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: any) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        list: protocolMetadata,
        handleSave: handleSave,
      }),
    };
  });

  return (
    <div>
      <Input.Search
        placeholder="请输入物模型属性名"
        allowClear
        style={{ width: 300, marginBottom: 20 }}
        onSearch={(e: string) => {
          setValue(e);
          handleSearch({
            name: e,
            pageIndex: 0,
            pageSize: 10,
          });
        }}
      />
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        rowKey="id"
        pagination={false}
        dataSource={dataSource?.data || []}
        columns={columns}
      />
      {dataSource.data.length > 0 && (
        <div style={{ display: 'flex', marginTop: 20, justifyContent: 'flex-end' }}>
          <Pagination
            showSizeChanger
            size="small"
            className={'pro-table-card-pagination'}
            total={dataSource?.total || 0}
            current={dataSource?.pageIndex + 1}
            onChange={(page, size) => {
              handleSearch({
                name: value,
                pageIndex: page - 1,
                pageSize: size,
              });
            }}
            pageSizeOptions={[10, 20, 50, 100]}
            pageSize={dataSource?.pageSize}
            showTotal={(num) => {
              const minSize = dataSource?.pageIndex * dataSource?.pageSize + 1;
              const MaxSize = (dataSource?.pageIndex + 1) * dataSource?.pageSize;
              return `第 ${minSize} - ${MaxSize > num ? num : MaxSize} 条/总共 ${num} 条`;
            }}
          />
        </div>
      )}
    </div>
  );
};

export default EditableTable;
