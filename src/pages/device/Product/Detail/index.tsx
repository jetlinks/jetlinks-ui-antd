import { PageContainer } from '@ant-design/pro-layout';
import { useIntl, useParams } from 'umi';
import { Badge, Card, Descriptions, message, Popconfirm, Space, Spin, Switch, Tooltip } from 'antd';
import BaseInfo from '@/pages/device/Product/Detail/BaseInfo';
import { observer } from '@formily/react';
import { productModel, service } from '@/pages/device/Product';
import { useCallback, useEffect, useState } from 'react';
import { useDomFullHeight, useHistory, useLocation } from '@/hooks';
import Metadata from '@/pages/device/components/Metadata';
import Access from '@/pages/device/Product/Detail/Access';
import type { DeviceMetadata } from '@/pages/device/Product/typings';
import { Store } from 'jetlinks-store';
import MetadataAction from '@/pages/device/components/Metadata/DataBaseAction';
import { getMenuPathByCode, MENUS_CODE } from '@/utils/menu';
import encodeQuery from '@/utils/encodeQuery';
import MetadataMap from '@/pages/device/Instance/Detail/MetadataMap';
import SystemConst from '@/utils/const';
import { PermissionButton } from '@/components';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { onlyMessage } from '@/utils/util';

export const ModelEnum = {
  base: 'base',
  metadata: 'metadata',
  access: 'access',
};

const ProductDetail = observer(() => {
  const intl = useIntl();
  const [mode, setMode] = useState('base');
  const param = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(false);
  const location = useLocation();
  const history = useHistory();

  const initList = [
    {
      key: 'base',
      tab: intl.formatMessage({
        id: 'pages.device.productDetail.base',
        defaultMessage: '配置信息',
      }),
      component: (
        <BaseInfo
          onJump={(type) => {
            if (type) {
              setMode(type);
            }
          }}
        />
      ),
    },
    {
      key: 'metadata',
      tab: (
        <>
          {intl.formatMessage({
            id: 'pages.device.instanceDetail.metadata',
            defaultMessage: '物模型',
          })}
          <Tooltip
            title={
              <>
                属性：
                <br />
                用于描述设备运行时具体信息和状态。
                <br />
                功能：
                <br />
                指设备可供外部调用的指令或方法。
                <br />
                事件：
                <br />
                设备运行时，主动上报给云端的信息。
                <br />
                标签：
                <br />
                统一为设备添加拓展字段，添加后将在设备信息页显示。
              </>
            }
          >
            <QuestionCircleOutlined style={{ marginLeft: 5 }} />
          </Tooltip>
        </>
      ),
      component: <Metadata type="product" />,
    },
    {
      key: 'access',
      tab: '设备接入',
      component: <Access />,
    },
  ];

  const pList = [
    'websocket-server',
    'http-server-gateway',
    'udp-device-gateway',
    'coap-server-gateway',
    'mqtt-client-gateway',
    'mqtt-server-gateway',
    'tcp-server-gateway',
  ];
  const [list, setList] = useState<any[]>([...initList]);

  const { minHeight } = useDomFullHeight('.product-detail-body');

  const { permission } = PermissionButton.usePermission('device/Product');

  const statusMap = {
    1: {
      key: 'disable',
      name: '停用',
      action: 'undeploy',
      component: (
        <Badge
          status="processing"
          text={intl.formatMessage({
            id: 'pages.system.tenant.assetInformation.published',
            defaultMessage: '已发布',
          })}
        />
      ),
    },
    0: {
      key: 'enabled',
      name: '启用',
      action: 'deploy',
      component: (
        <Badge
          status="error"
          text={intl.formatMessage({
            id: 'pages.system.tenant.assetInformation.unpublished',
            defaultMessage: '未发布',
          })}
        />
      ),
    },
  };

  const initMetadata = () => {
    service.getProductDetail(param?.id).subscribe((data) => {
      if (data.metadata) {
        const metadata: DeviceMetadata = JSON.parse(data.metadata);
        MetadataAction.insert(metadata);
      }
      service.instanceCount(encodeQuery({ terms: { productId: param?.id } })).then((res: any) => {
        if (res.status === 200) {
          productModel.current = { ...data, count: res.result };
        }
      });
    });
  };

  useEffect(() => {
    if (
      productModel.current?.accessProvider &&
      pList.includes(productModel.current?.accessProvider)
    ) {
      setList([
        ...initList,
        {
          key: 'metadata-map',
          tab: '物模型映射',
          component: <MetadataMap type="product" />,
        },
      ]);
    } else {
      setList([...initList]);
    }
  }, [productModel.current]);

  useEffect(() => {
    const queryParam = new URLSearchParams(location.search);
    const _mode = queryParam.get('type');
    if (_mode) {
      setMode(_mode);
    }
  }, []);

  useEffect(() => {
    const subscription = Store.subscribe(SystemConst.GET_METADATA, () => {
      MetadataAction.clean();
      setTimeout(() => {
        initMetadata();
        Store.set(SystemConst.REFRESH_METADATA_TABLE, true);
      }, 300);
    });
    if (!param.id) {
      history.goBack();
    } else {
      initMetadata();
    }
    return () => {
      MetadataAction.clean();
      subscription.unsubscribe();
    };
  }, [param.id]);

  const changeDeploy = useCallback(
    (state: 'deploy' | 'undeploy') => {
      setLoading(true);
      // 似乎没有必要重新获取当前产品信息，暂时做前端数据修改
      service.changeDeploy(param.id, state).subscribe({
        next: async () => {
          const item = productModel.current;
          // 重新应用的话。就不执行更新操作。
          if (item) {
            if (!(item.state === 1 && state === 'deploy')) {
              item.state = item.state > 0 ? item.state - 1 : item.state + 1;
            }
          }
          productModel.current = item;
          message.success({
            key: 'metadata',
            content: '操作成功！',
          });
        },
        error: async () => {
          onlyMessage('操作失败', 'error');
        },
        complete: () => {
          setLoading(false);
        },
      });
    },
    [param.id],
  );

  useEffect(() => {
    const subscription = Store.subscribe('product-deploy', () => {
      changeDeploy('deploy');
    });
    return subscription.unsubscribe;
  }, [changeDeploy, param.id]);

  useEffect(() => {
    const { state } = location;
    if (state && state?.tab) {
      setMode(state?.tab);
    }
    if ((location as any).query?.key) {
      setMode((location as any).query?.key || 'base');
    }
    const subscription = Store.subscribe(SystemConst.BASE_UPDATE_DATA, (data) => {
      if ((window as any).onTabSaveSuccess) {
        (window as any).onTabSaveSuccess(data);
        setTimeout(() => window.close(), 300);
      }
    });
    return () => subscription.unsubscribe();
  }, [location]);

  return (
    <PageContainer
      className={'page-title-show'}
      onBack={() => history.goBack()}
      extraContent={<Space size={24} />}
      onTabChange={(key) => {
        setMode(key);
      }}
      tabList={list}
      tabActiveKey={mode}
      content={
        <Spin spinning={loading}>
          <Descriptions size="small" column={2}>
            <Descriptions.Item label={'设备数量'}>
              <PermissionButton
                type={'link'}
                isPermission={!!getMenuPathByCode(MENUS_CODE['device/Instance'])}
                style={{ padding: 0, height: 'auto' }}
                onClick={() => {
                  const url = getMenuPathByCode(MENUS_CODE['device/Instance']);
                  const params = {
                    productId: productModel.current?.id,
                  };
                  if (url) {
                    history.push(url, params);
                  }
                }}
              >
                {productModel.current?.count || 0}
              </PermissionButton>
            </Descriptions.Item>
          </Descriptions>
        </Spin>
      }
      title={
        <Tooltip placement="topLeft" title={productModel.current?.name}>
          <div className="ellipsis" style={{ maxWidth: 250 }}>
            {productModel.current?.name}
          </div>
        </Tooltip>
      }
      subTitle={
        permission.update ? (
          <Popconfirm
            title={productModel.current?.state === 1 ? '确认禁用' : '确认启用'}
            onConfirm={() => {
              changeDeploy(statusMap[productModel.current?.state || 0].action);
            }}
          >
            <Switch
              key={2}
              checked={productModel.current?.state === 1}
              checkedChildren="正常"
              unCheckedChildren="禁用"
            />
          </Popconfirm>
        ) : (
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.noPermission',
              defaultMessage: '没有权限',
            })}
          >
            <Switch
              key={2}
              disabled
              checked={productModel.current?.state === 1}
              checkedChildren="正常"
              unCheckedChildren="禁用"
            />
          </Tooltip>
        )
      }
      extra={[
        <PermissionButton
          key="1"
          type={'primary'}
          popConfirm={{
            title: '确定应用配置？',
            disabled: productModel.current?.state === 0,
            onConfirm: () => {
              changeDeploy('deploy');
            },
          }}
          tooltip={productModel.current?.state === 0 ? { title: '请先启用产品' } : undefined}
          isPermission={permission.update}
          disabled={productModel.current?.state === 0}
        >
          {intl.formatMessage({
            id: 'pages.device.productDetail.setting',
            defaultMessage: '应用配置',
          })}
        </PermissionButton>,
      ]}
    >
      <Card className={'product-detail-body'} style={{ minHeight }}>
        {list.find((k) => k.key === mode)?.component}
        {/* <Tabs
          defaultActiveKey={ModelEnum.base}
          activeKey={mode}
          onChange={(key) => {
            setMode(key);
          }}
        >
          <Tabs.TabPane
            tab={intl.formatMessage({
              id: 'pages.device.productDetail.base',
              defaultMessage: '配置信息',
            })}
            key={ModelEnum.base}
          >
            <BaseInfo />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <>
                {intl.formatMessage({
                  id: 'pages.device.productDetail.metadata',
                  defaultMessage: '物模型',
                })}
                <Tooltip
                  placement="right"
                  title={
                    <div>
                      <p>
                        属性：
                        <br />
                        用于描述设备运行时具体信息和状态。
                        例如，环境监测设备所读取的当前环境温度、智能灯开关状态、电风扇风力等级等。
                      </p>
                      功能：
                      <br />
                      <p>
                        指设备可供外部调用的指令或方法。功能调用中可设置输入和输出参数。输入参数是服务执行时的参数，输出参数是服务执行后的结果。
                        相比于属性，功能可通过一条指令实现更复杂的业务逻辑，例如执行某项特定的任务。
                        功能分为异步和同步两种调用方式。
                      </p>
                      <p> 事件：</p>
                      <p>
                        设备运行时，主动上报给云端的信息，一般包含需要被外部感知和处理的信息、告警和故障。事件中可包含多个输出参数。
                        例如，某项任务完成后的通知信息；设备发生故障时的温度、时间信息；设备告警时的运行状态等。
                      </p>
                      <p> 标签：</p>
                      <p>
                        统一为设备添加拓展字段，添加后将在设备信息页显示。可用于对设备基本信息描述的补充。
                      </p>
                    </div>
                  }
                >
                  <QuestionCircleOutlined style={{ marginLeft: '5px' }} />
                </Tooltip>
              </>
            }
            key={ModelEnum.metadata}
          >
            <Metadata type="product" />
          </Tabs.TabPane>
          <Tabs.TabPane tab={'设备接入'} key={ModelEnum.access}>
            <Access />
          </Tabs.TabPane>
        </Tabs> */}
      </Card>
    </PageContainer>
  );
});

export default ProductDetail;
