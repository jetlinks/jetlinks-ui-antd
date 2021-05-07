import React, { Fragment, useContext, useEffect, useState } from 'react';
import { FormComponentProps } from 'antd/es/form';
import { Button, Card, Divider, Form, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { PropertiesMeta } from '../../component/data.d';
import PropertiesDefin from '../../component/properties';
import { TenantContext } from "@/pages/device/product/save/definition/index";
import {ProductContext} from '../../context';
import Import from '../../component/import-properties';

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

  useEffect(() => {
    setData(tenantContextData.properties || [])
  }, [tenantContextData]);

  useEffect(() => {
    setProduct(productContext || {});
  },[productContext])

  const editItem = (item: any) => {
    setVisible(true);
    setCurrent(item);
  };

  const deleteItem = (item: any) => {
    const temp = data.filter(e => e.id !== item.id);
    setData(temp);
    props.save(temp, true);
  };

  const columns: ColumnProps<PropertiesMeta>[] = [
    {
      title: '属性标识',
      dataIndex: 'id',
    },
    {
      title: '属性名称',
      dataIndex: 'name',
    },
    {
      title: '数据类型',
      dataIndex: 'valueType',
      render: text => text.type,
    },
    {
      title: '是否只读',
      dataIndex: 'expands.readOnly',
      render: text => ((text === 'true' || text === true) ? '是' : '否'),
    },
    {
      title: '说明',
      dataIndex: 'description',
      width: '30%',
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
    // }
    setVisible(false);
    setData(data);
    props.save(data, onlySave);
  };
  return (
    <div>
      <Card
        title="属性定义"
        style={{ marginBottom: 20 }}
        extra={
          <>
            <Button style={{marginRight: '10px'}} onClick={() => {
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
        <Table rowKey="id" columns={columns} dataSource={data} pagination={false} />
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
