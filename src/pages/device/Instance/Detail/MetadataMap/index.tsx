import { Card, Empty } from 'antd';
import { useEffect, useState } from 'react';
import { service } from '@/pages/device/Instance';
import EditableTable from './EditableTable';
import { getMenuPathByParams, MENUS_CODE } from '@/utils/menu';
import type { ProductItem } from '@/pages/device/Product/typings';
import { useParams } from 'umi';
interface Props {
  type: 'device' | 'product';
}

const MetadataMap = (props: Props) => {
  const { type } = props;
  const [product, setProduct] = useState<Partial<ProductItem>>();
  const [data, setData] = useState<any>({});
  const params = useParams<{ id: string }>();

  const handleSearch = async () => {
    if (props.type === 'product') {
      const resp = await service.queryProductState(params.id || '');
      if (resp.status === 200) {
        setProduct(resp.result);
        setData(resp.result);
      }
    } else {
      const resp = await service.detail(params.id || '');
      if (resp.status === 200) {
        setData(resp.result);
        const response = await service.queryProductState(resp.result?.productId || '');
        if (response.status === 200) {
          setProduct(response.result);
        }
      }
    }
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
  }, [props.type]);

  return <Card bordered={false}>{renderComponent()}</Card>;
};

export default MetadataMap;
