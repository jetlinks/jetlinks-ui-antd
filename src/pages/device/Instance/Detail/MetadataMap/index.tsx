import { Card } from 'antd';
import { useEffect, useState } from 'react';
import { service } from '@/pages/device/Instance';
import EditableTable from './EditableTable';
import { getMenuPathByParams, MENUS_CODE } from '@/utils/menu';
import type { ProductItem } from '@/pages/device/Product/typings';
import { useParams } from 'umi';
import { PermissionButton, Empty } from '@/components';
import { getDomFullHeight } from '@/utils/util';

interface Props {
  type: 'device' | 'product';
}

const MetadataMap = (props: Props) => {
  const { type } = props;
  const [product, setProduct] = useState<Partial<ProductItem>>();
  const [data, setData] = useState<any>({});
  const params = useParams<{ id: string }>();
  const { permission } = PermissionButton.usePermission('device/Product');
  const [minHeight, setMinHeight] = useState(300);

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
    const height = minHeight - 150;
    if (product) {
      const flag =
        (type === 'device' &&
          (metadata?.properties || []).length === 0 &&
          (dmetadata?.properties || []).length === 0) ||
        (type === 'product' && (dmetadata?.properties || []).length === 0);
      if (!product.accessId && flag) {
        if (!permission.update) {
          return (
            <div style={{ height }}>
              <Empty
                description={<span>请联系管理员配置物模型属性，并选择对应产品的设备接入方式</span>}
              />
            </div>
          );
        } else {
          return (
            <div style={{ height }}>
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
            </div>
          );
        }
      } else if (flag && product.accessId) {
        return (
          <div style={{ height }}>
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
          </div>
        );
      } else if (!flag && !product.accessId) {
        return (
          <div style={{ height }}>
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
          </div>
        );
      } else {
        return <EditableTable data={data} type={type} />;
      }
    }
    return (
      <div style={{ height }}>
        <Empty />
      </div>
    );
  };

  useEffect(() => {
    handleSearch();
  }, [props.type]);

  useEffect(() => {
    setMinHeight(getDomFullHeight('device-detail-metadataMap', 12));
  }, []);

  return (
    <Card bordered={false} className="device-detail-metadataMap" style={{ minHeight }}>
      {renderComponent()}
    </Card>
  );
};

export default MetadataMap;
