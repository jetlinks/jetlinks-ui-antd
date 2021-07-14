import React, { Fragment, useContext, useEffect, useState } from 'react';
import { FormComponentProps } from 'antd/es/form';
import { Button, Card, Divider, Form, Table } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import { PropertiesMeta } from '../../component/data.d';
import PropertiesDefin from '../../component/properties';
import { TenantContext } from "@/pages/device/product/save/definition/index";
import { ProductContext } from '../../context';
import Import from '../../component/import-properties';
import Input from 'antd/es/input';
import _ from 'lodash';

interface Props extends FormComponentProps {
  save: Function;
  data: any[];
  unitsData: any;
  update: Function;
}

interface State {
  data: PropertiesMeta[];
  current: Partial<PropertiesMeta>;
  visible: boolean;
  importVisible: boolean;
  product: any;
}

const Properties: React.FC<Props> = (props: Props) => {
  const tenantContextData = useContext(TenantContext);
  const productContext = useContext(ProductContext);

  const initState: State = {
    data: props.data || [],
    current: {},
    visible: false,
    importVisible: false,
    product: {}
  };

  const [visible, setVisible] = useState(initState.visible);
  const [importVisible, setImportVisible] = useState(initState.importVisible);
  const [data, setData] = useState(initState.data);
  const [product, setProduct] = useState(initState.product);
  const [current, setCurrent] = useState(initState.current);
  const [searchParam, setSearchParam] = useState<any>({});
  const [dataList, setDataList] = useState(initState.data);
  const sourceList = new Map();
  sourceList.set('device', '设备');
  sourceList.set('manual', '手动');
  sourceList.set('rule', '规则');

  useEffect(() => {
    setData(tenantContextData.properties || [])
  }, [tenantContextData]);

  useEffect(() => {
    setProduct(productContext || {});
  }, [productContext])

  const editItem = (item: any) => {
    setVisible(true);
    setCurrent(item);
  };

  const deleteItem = (item: any) => {
    const temp = data.filter(e => e.id !== item.id);
    setData([...temp]);
    props.save(temp, true);
  };

  const columns: ColumnProps<PropertiesMeta>[] = [
    {
      title: '属性标识',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: '属性名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '数据类型',
      dataIndex: 'valueType.type',
      align: 'center',
      render: text => text,
      filters: [
        {
          value: 'int',
          text: '整数型',
        },
        {
          value: 'long',
          text: '长整数型',
        },
        {
          value: 'float',
          text: '单精度浮点型',
        },
        {
          value: 'double',
          text: '双精度浮点数',
        },
        {
          value: 'string',
          text: '字符串',
        },
        {
          value: 'boolean',
          text: '布尔型',
        },
        {
          value: 'date',
          text: '时间型',
        },
        {
          value: 'enum',
          text: '枚举',
        },
        {
          value: 'array',
          text: '数组',
        },
        {
          value: 'object',
          text: '结构体',
        },
        {
          value: 'file',
          text: '文件',
        },
        {
          value: 'password',
          text: '密码',
        },
        {
          value: 'geoPoint',
          text: '地理位置',
        },
      ],
      filterMultiple: false,
    },
    {
      title: '属性值来源',
      dataIndex: 'expands.source',
      align: 'center',
      render: text => sourceList.get(text),
      filters: [
        {
          value: 'device',
          text: '设备',
        },
        {
          value: 'manual',
          text: '手动',
        },
        {
          value: 'rule',
          text: '规则',
        }
      ],
      filterMultiple: false,
    },
    {
      title: '是否只读',
      dataIndex: 'expands.readOnly',
      align: 'center',
      render: text => ((text === 'true' || text === true) ? '是' : '否'),
    },
    {
      title: '说明',
      dataIndex: 'description',
      align: 'center',
      ellipsis: true
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => editItem(record)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => deleteItem(record)}>删除</a>
        </Fragment>
      ),
    },
  ];

  const savePropertiesData = (item: PropertiesMeta, onlySave: boolean) => {
    const i = data.findIndex((j: any) => j.id === item.id);
    if (i > -1) {
      data[i] = item;
    } else {
      data.push(item);
    }
    setData([...data]);
    props.save(data, onlySave);
    setVisible(false);
  };

  const onTableChange = (
    pagination: PaginationConfig,
    filters: any) => {
    let params = { ...searchParam }
    Object.keys(filters || {}).forEach((i: string) => {
      params[i] = filters[i][0]
    })
    handleSearch(params);
  }

  const handleSearch = (params?: any) => {
    setSearchParam(params);
    let items = [...data]
    Object.keys(params || {}).forEach((item) => {
      if (!!params[item]) {
        items = items.filter((i) => {
          return !!_.at(i, item)[0] && _.at(i, item)[0].indexOf(params[item]) !== -1
        })
      }
    })
    setDataList([...items]);
  }

  useEffect(() => {
    handleSearch(searchParam);
  }, [data])


  return (
    <div>
      <Card
        title="属性定义"
        style={{ marginBottom: 20 }}
        extra={
          <>
            <Button style={{ marginRight: '10px' }} onClick={() => {
              setImportVisible(true);
            }}>导入属性</Button>
            <Button type="primary" onClick={() => {
              setCurrent({});
              setVisible(true);
            }}>
              添加
            </Button>
          </>
        }
      >
        <div style={{ margin: '10px 0px 20px', display: 'flex', alignItems: 'center' }}>
          <Input.Search allowClear style={{ width: 300 }} placeholder="请输入属性名称" onSearch={(value) => {
            handleSearch({
              ...searchParam,
              name: value
            })
          }} />
        </div>
        <Table rowKey="id" columns={columns} dataSource={dataList} onChange={onTableChange} />
      </Card>
      {visible && (
        <PropertiesDefin
          dataList={data}
          data={current}
          unitsData={props.unitsData}
          save={(item: PropertiesMeta, onlySave: boolean) => {
            savePropertiesData(item, onlySave);
          }}
          close={() => {
            setVisible(false);
            setCurrent({});
          }}
        />
      )}
      {importVisible && <Import data={{
        productId: product?.id
      }} close={() => {
        setImportVisible(false);
      }}
        save={(params: any) => {
          setImportVisible(false);
          let dataParams = JSON.parse(params) || {};
          let list = dataParams?.properties || [];
          props.update(list);
          setData(list);
        }}
      />}
    </div>
  );
};
export default Form.create<Props>()(Properties);
