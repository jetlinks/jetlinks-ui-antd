import { Card, Empty } from 'antd';
import { useEffect, useState } from 'react';
import { service } from '@/pages/device/Instance';
import EditableTable from './EditableTable';
import { getMenuPathByParams, MENUS_CODE } from '@/utils/menu';
import type { ProductItem } from '@/pages/device/Product/typings';
import { useParams } from 'umi';
import { PermissionButton } from '@/components';

interface Props {
  type: 'device' | 'product';
}

const MetadataMap = (props: Props) => {
  const { type } = props;
  const [product, setProduct] = useState<Partial<ProductItem>>();
  const [data, setData] = useState<any>({});
  const params = useParams<{ id: string }>();
  const { permission } = PermissionButton.usePermission('device/Product');

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
    const metadata = JSON.parse(product?.metadata || '{}');
    const dmetadata = JSON.parse(data?.metadata || '{}');
    if (product) {
      const flag =
        (type === 'device' &&
          (metadata?.properties || []).length === 0 &&
          (dmetadata?.properties || []).length === 0) ||
        (type === 'product' && (dmetadata?.properties || []).length === 0);
      if (!product.accessId && flag) {
        if (!permission.update) {
          return (
            <Empty
              description={<span>请联系管理员配置物模型属性，并选择对应产品的设备接入方式</span>}
            />
          );
        } else {
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
                  ,并选择对应产品的
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
        }
      } else if (flag && product.accessId) {
        return (
          <Empty
            description={
              !permission.update ? (
                <span>请联系管理员配置物模型属性</span>
              ) : (
                <span>
                  请配置对应产品的
                  <a
                    onClick={() => {
                      checkUrl('metadata');
                    }}
                  >
                    物模型属性
                  </a>
                </span>
              )
            }
          />
        );
      } else if (!flag && !product.accessId) {
        return (
          <Empty
            description={
              <span>
                请选择对应产品的
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
