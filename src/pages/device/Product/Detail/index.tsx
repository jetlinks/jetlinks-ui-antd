import { PageContainer } from '@ant-design/pro-layout';
import { history, useParams } from 'umi';
import { Button, Card, Descriptions, Space, Tabs, Badge, message, Spin } from 'antd';
import BaseInfo from '@/pages/device/Product/Detail/BaseInfo';
import { observer } from '@formily/react';
import { productModel, service } from '@/pages/device/Product';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from '@@/plugin-locale/localeExports';
import Metadata from '@/pages/device/Product/Detail/Metadata';
import Alarm from '@/pages/device/Product/Detail/Alarm';
import type { DeviceMetadata } from '@/pages/device/Product/typings';
import DB from '@/db';
import { Link } from 'umi';
import { Store } from 'jetlinks-store';

const ProductDetail = observer(() => {
  const intl = useIntl();

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
  const param = useParams<{ id: string }>();

  useEffect(() => {
    if (!productModel.current) {
      history.goBack();
    } else {
      service.getProductDetail(param.id).subscribe((data) => {
        // 存储到数据库
        // events  functions  properties  tags
        // 数据库存储 按设备名称-物模型类别存储  如：yanshi-tags
        const metadata: DeviceMetadata = JSON.parse(data.metadata);

        const schema = {
          [`${param.id}-functions`]: null,
          [`${param.id}-tags`]: null,
          [`${param.id}-events`]: null,
          [`${param.id}-properties`]: null,
        };
        // return 表存在未清除完的情况。所以加载前再清除一次。 考虑优化
        DB.updateSchema(schema).then(() => {
          DB.updateSchema({
            [`${param.id}-events`]: 'id',
            [`${param.id}-properties`]: 'id',
            [`${param.id}-functions`]: 'id',
            [`${param.id}-tags`]: 'id',
          })
            .then(() => {
              /// 应该先判断是否存在数据
              const EventTable = DB.getDB().table(`${param.id}-events`);
              EventTable.clear().then(() => {
                EventTable.bulkAdd(metadata.events || []);
              });
              const PropertyTable = DB.getDB().table(`${param.id}-properties`);
              PropertyTable.clear().then(() => {
                PropertyTable.bulkAdd(metadata.properties || []);
              });
              const FunctionTable = DB.getDB().table(`${param.id}-functions`);
              FunctionTable.clear().then(() => {
                FunctionTable.bulkAdd(metadata.functions || []);
              });
              const TagTable = DB.getDB().table(`${param.id}-tags`);
              TagTable.clear().then(() => {
                TagTable.bulkAdd(metadata.tags || []);
              });
            })
            .catch((error) => {
              console.error(error);
              throw new Error('IndexDB add Data Error');
            });
        });
      });
    }

    return () => {
      const schema = {
        [`${param.id}-functions`]: null,
        [`${param.id}-tags`]: null,
        [`${param.id}-events`]: null,
        [`${param.id}-properties`]: null,
      };
      DB.updateSchema(schema);
    };
  }, [param.id]);

  const [loading, setLoading] = useState<boolean>(false);

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
          message.success('操作成功');
        },
        error: async () => {
          message.success('操作失败');
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

  return (
    <PageContainer
      onBack={() => history.goBack()}
      extraContent={<Space size={24} />}
      content={
        <Spin spinning={loading}>
          <Descriptions size="small" column={2}>
            <Descriptions.Item
              label={intl.formatMessage({
                id: 'pages.device.category',
                defaultMessage: '产品ID',
              })}
            >
              {productModel.current?.id}
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.formatMessage({
                id: 'pages.table.productName',
                defaultMessage: '产品名称',
              })}
            >
              {productModel.current?.name}
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.formatMessage({
                id: 'pages.device.productDetail.classifiedName',
                defaultMessage: '所属品类',
              })}
            >
              {productModel.current?.classifiedName}
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.formatMessage({
                id: 'pages.device.productDetail.protocolName',
                defaultMessage: '消息协议',
              })}
            >
              {productModel.current?.protocolName}
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.formatMessage({
                id: 'pages.device.productDetail.transportProtocol',
                defaultMessage: '链接协议',
              })}
            >
              {productModel.current?.transportProtocol}
            </Descriptions.Item>
            <Descriptions.Item label={'设备数量'}>
              <Link to={'/device/instance'}> {productModel.current?.count}</Link>
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.formatMessage({
                id: 'pages.device.productDetail.createTime',
                defaultMessage: '创建时间',
              })}
            >
              {productModel.current?.createTime}
            </Descriptions.Item>
          </Descriptions>
        </Spin>
      }
      extra={[
        statusMap[productModel.current?.state || 0].component,
        <Button
          key="2"
          onClick={() => {
            changeDeploy(statusMap[productModel.current?.state || 0].action);
          }}
        >
          {intl.formatMessage({
            id: `pages.device.productDetail.${statusMap[productModel.current?.state || 0].key}`,
            defaultMessage: statusMap[productModel.current?.state || 1].name,
          })}
        </Button>,
        <Button key="1" type="primary" onClick={() => changeDeploy('deploy')}>
          {intl.formatMessage({
            id: 'pages.device.productDetail.setting',
            defaultMessage: '应用配置',
          })}
        </Button>,
      ]}
    >
      <Card>
        <Tabs tabPosition="left" defaultActiveKey="base">
          <Tabs.TabPane
            tab={intl.formatMessage({
              id: 'pages.device.productDetail.base',
              defaultMessage: '配置信息',
            })}
            key="base"
          >
            <BaseInfo />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={intl.formatMessage({
              id: 'pages.device.productDetail.metadata',
              defaultMessage: '物模型',
            })}
            key="metadata"
          >
            <Metadata />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={intl.formatMessage({
              id: 'pages.device.productDetail.alarm',
              defaultMessage: '告警设置',
            })}
            key="alarm"
          >
            <Alarm />
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </PageContainer>
  );
});
export default ProductDetail;
