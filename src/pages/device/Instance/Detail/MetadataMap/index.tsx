import { Card, Empty } from 'antd';
import { useEffect, useState } from 'react';
import { InstanceModel, service } from '@/pages/device/Instance';
import { productModel } from '@/pages/device/Product';
import EditableTable from './EditableTable';
import { getMenuPathByParams, MENUS_CODE } from '@/utils/menu';
import type { ProductItem } from '@/pages/device/Product/typings';

interface Props {
  type: 'device' | 'product';
}

const MetadataMap = (props: Props) => {
  const { type } = props;
  const [product, setProduct] = useState<Partial<ProductItem>>();
  const [data, setData] = useState<any>({});

  const handleSearch = () => {
    service
      .queryProductState(InstanceModel.detail?.productId || productModel.current?.id || '')
      .then((resp) => {
        if (resp.status === 200) {
          setProduct(resp.result);
          if (type === 'product') {
            setData(resp.result);
          } else {
            setData(InstanceModel.detail);
          }
        }
      });
  };

  const checkUrl = (str: string) => {
    const url = getMenuPathByParams(MENUS_CODE['device/Product/Detail'], product?.id);
    const tab: any = window.open(`${origin}/#${url}?key=${str}`);
    tab!.onTabSaveSuccess = (value: any) => {
      if (value.status === 200) {
        handleSearch();
      }
    };
  };

  const renderComponent = () => {
    if (product) {
      if (!product.accessId) {
        return (
          <Empty
            description={
              <span>
                请配置对应产品的
                <a
                  onClick={() => {
                    checkUrl('access');
                  }}
                >
                  设备接入方式
                </a>
              </span>
            }
          />
        );
      } else {
        const metadata = JSON.parse(product?.metadata || '{}');
        const dmetadata = JSON.parse(data?.metadata || '{}');
        if (
          (type === 'device' &&
            (metadata?.properties || []).length === 0 &&
            (dmetadata?.properties || []).length === 0) ||
          (type === 'product' && (dmetadata?.properties || []).length === 0)
        ) {
          return (
            <Empty
              description={
                <span>
                  请先配置对应产品的
                  <a
                    onClick={() => {
                      checkUrl('metadata');
                    }}
                  >
                    物模型属性
                  </a>
                </span>
              }
            />
          );
        }
        return <EditableTable data={data} type={type} />;
      }
    }
    return <Empty />;
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return <Card bordered={false}>{renderComponent()}</Card>;
};

export default MetadataMap;
