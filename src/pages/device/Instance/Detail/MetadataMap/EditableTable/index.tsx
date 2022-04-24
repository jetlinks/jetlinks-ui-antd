import React, { useContext, useEffect, useState } from 'react';
import { Badge, Col, Form, Input, message, Pagination, Row, Select, Table } from 'antd';
import { service } from '@/pages/device/Instance';
import _ from 'lodash';
import './index.less';

const defaultImage = require('/public/images/metadata-map.png');

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
  properties: any[];
  handleSave: (record: any) => void;
}

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  list,
  properties,
  handleSave,
  ...restProps
}: EditableCellProps) => {
  const form: any = useContext(EditableContext);
  const [temp, setTemp] = useState<any>({});

  const save = async () => {
    try {
      const values = await form.validateFields();
      handleSave({ ...record, originalId: values?.originalId });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  useEffect(() => {
    if (record) {
      form.setFieldsValue({ [dataIndex]: record[dataIndex] });
      setTemp(properties.find((i) => i.id === record.originalId));
    }
  }, [record]);

  let childNode = children;

  if (editable) {
    childNode = (
      <Form.Item style={{ margin: 0 }} name={dataIndex}>
        <Select
          onChange={save}
          showSearch
          optionFilterProp="children"
          filterOption={(input: string, option: any) =>
            (option?.children || '').toLowerCase()?.indexOf(input.toLowerCase()) >= 0
          }
        >
          <Select.Option value={record.metadataId}>使用原始属性</Select.Option>
          {record.originalId !== record.metadataId && (
            <Select.Option value={record.originalId}>
              {temp?.name}({temp?.id})
            </Select.Option>
          )}
          {list.length > 0 &&
            list.map((item: any) => (
              <Select.Option key={item?.id} value={item?.id}>
                {item?.name}({item?.id})
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
      title: '物模型属性',
      dataIndex: 'name',
      render: (text: any, record: any) => <span>{`${record.name}(${record.id})`}</span>,
    },
    {
      title: '设备上报属性',
      dataIndex: 'originalId',
      width: '30%',
      editable: true,
    },
    {
      title: '属性类型',
      dataIndex: 'valueType',
      render: (text: any, record: any) => <span>{record.valueType?.type}</span>,
    },
    {
      title: '映射状态',
      dataIndex: 'customMapping',
      render: (text: any) => (
        <span>
          <Badge status={text ? 'success' : 'error'} text={text ? '已映射' : '未映射'} />
        </span>
      ),
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
  const [pmList, setPmList] = useState<any[]>([]);

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const initData = async (lists: any[]) => {
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
        obj[i?.metadataId] = i;
      });
      if (lists.length > 0) {
        setPmList(lists.filter((i) => !_.map(data, 'originalId').includes(i.id)));
      } else {
        setPmList([]);
      }
      const list = (JSON.parse(props?.data?.metadata || '{}')?.properties || []).map(
        (item: any) => {
          return {
            ...item,
            ...obj[item.id],
          };
        },
      );
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
    if (props.data && Object.keys(props.data).length > 0) {
      service
        .queryProtocolMetadata(
          props.type === 'device' ? props.data?.protocol : props.data?.messageProtocol,
          props.type === 'device' ? props.data?.transport : props.data?.transportProtocol,
        )
        .then((resp) => {
          if (resp.status === 200) {
            const list = JSON.parse(resp.result || '{}')?.properties || [];
            setProtocolMetadata(list);
            initData(list);
          }
        });
    }
  }, [props.data]);

  const handleSave = async (row: any) => {
    const newData = [...dataSource.data];
    const index = newData.findIndex((item) => row.id === item.id);
    const item = newData[index];
    if (item?.originalId !== row?.originalId) {
      const resp = await service[
        props.type === 'device' ? 'saveDeviceMetadata' : 'saveProductMetadata'
      ](props.data?.id, [
        {
          metadataType: 'property',
          metadataId: row.metadataId,
          originalId: row.metadataId !== row.originalId ? row.originalId : '',
          others: {},
        },
      ]);
      if (resp.status === 200) {
        message.success('操作成功！');
        // 刷新
        initData(protocolMetadata);
      }
    }
  };

  const handleSearch = (params: any) => {
    if (params.name) {
      const data = properties.filter((i: any) => {
        return i?.name.includes(params?.name);
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
        list: pmList,
        properties: protocolMetadata,
        handleSave: handleSave,
      }),
    };
  });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
        <Input.Search
          placeholder="请输入物模型属性名"
          allowClear
          style={{ width: 300, marginRight: 10 }}
          onSearch={(e: string) => {
            setValue(e);
            handleSearch({
              name: e,
              pageIndex: 0,
              pageSize: 10,
            });
          }}
        />
      </div>
      <Row gutter={24}>
        <Col span={16}>
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
        </Col>
        <Col span={8}>
          <div className="map-desc">
            <h1>功能说明</h1>
            <div className="text">
              该功能用于将<b>物模型属性</b>与<b>设备上报属性</b>
              进行映射，当物模型属性与设备上报属性不一致时，可在当前页面直接修改映射关系，系统将以
              <b>映射后</b>的<b>物模型属性</b>进行数据处理
            </div>
            <div className="image">
              <img src={defaultImage} style={{ width: '100%' }} />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default EditableTable;
