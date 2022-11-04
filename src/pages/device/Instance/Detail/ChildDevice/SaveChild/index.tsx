import TitleComponent from '@/components/TitleComponent';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { service } from '../../EdgeMap';
import MapTable from '../../EdgeMap/mapTable';

interface Props {
  data: any;
  close: () => void;
  childData: any;
}

const SaveChild = (props: Props) => {
  const [form] = Form.useForm();
  const [productList, setProductList] = useState<any>([]);
  const [metaData, setMetaData] = useState<any>([]);
  const [visible, setVisible] = useState<boolean>(false);

  const getProductList = async () => {
    const res = await service.getProductListNoPage({
      terms: [{ column: 'accessProvider', value: 'edge-child-device' }],
    });
    if (res.status === 200) {
      setProductList(res.result);
    }
  };

  useEffect(() => {
    // console.log(props.childData)
    getProductList();
    if (props.childData?.id) {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    if (props.childData.id) {
      const item = productList.filter((i: any) => i.id === props.childData.productId)[0];
      console.log(props.childData, item);
      // const metadata = JSON.parse(item.metadata|| []).properties?.map((item: any) => ({
      //   metadataId: item.id,
      //   metadataName: `${item.name}(${item.id})`,
      //   metadataType: 'property',
      // }));
      // if (metadata && metadata.length !== 0) {
      //   service
      //     .getMap(props.data.id, {
      //       deviceId: props.childData.id,
      //       query: {},
      //     })
      //     .then((res) => {
      //       if (res.status === 200) {
      //         // console.log(res.result)
      //         //合并物模型
      //         const array = res.result[0]?.reduce((x: any, y: any) => {
      //           const metadataId = metadata.find((item: any) => item.metadataId === y.metadataId);
      //           if (metadataId) {
      //             Object.assign(metadataId, y);
      //           } else {
      //             x.push(y);
      //           }
      //           return x;
      //         }, metadata);
      //         //删除物模型
      //         const items = array.filter((item: any) => item.metadataName);
      //         setMetaData(items);
      //         const delList = array.filter((a: any) => !a.metadataName).map((b: any) => b.id);
      //         //删除后解绑
      //         if (delList && delList.length !== 0) {
      //           service.removeMap(props.data.id, {
      //             deviceId: props.childData.id,
      //             idList: [...delList],
      //           });
      //         }
      //       }
      //     });
      // }
    }
  }, [productList]);

  return (
    <>
      <TitleComponent
        data={
          <>
            基本信息
            <Button
              onClick={() => {
                props.close();
              }}
              style={{ marginLeft: 10 }}
            >
              返回
            </Button>
          </>
        }
      />
      <Form layout="vertical" form={form} initialValues={props.childData}>
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <Form.Item
              label="设备名称"
              name="name"
              rules={[{ required: true, message: '请输入设备名称' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="产品名称"
              name="productId"
              rules={[{ required: true, message: '请选择产品名称' }]}
            >
              <Select
                onChange={(e) => {
                  if (e) {
                    setVisible(true);
                  }
                  const item = productList.filter((i: any) => i.id === e)[0];
                  const array = JSON.parse(item.metadata || [])?.properties?.map((i: any) => ({
                    metadataType: 'property',
                    metadataName: `${i.name}(${i.id})`,
                    metadataId: i.id,
                  }));
                  setMetaData(array);
                  console.log(array);
                }}
              >
                {productList.map((item: any) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        {visible && (
          <Row>
            <MapTable
              metaData={metaData}
              edgeId={props.data.id}
              deviceId={props.childData.id}
              title={'点位映射'}
              productList={productList}
              close={() => {
                props.close();
              }}
              formRef={form}
            />
          </Row>
        )}
      </Form>
    </>
  );
};

export default SaveChild;
