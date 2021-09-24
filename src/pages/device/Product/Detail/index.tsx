import { PageContainer } from '@ant-design/pro-layout';
import { history } from 'umi';
import { Button, Card, Descriptions, Space, Tabs } from 'antd';
import BaseInfo from '@/pages/device/Product/Detail/BaseInfo';
import { observer } from '@formily/react';
import { productModel, statusMap } from '@/pages/device/Product';
import { useEffect } from 'react';
import { useIntl } from '@@/plugin-locale/localeExports';

const ProductDetail = observer(() => {
  const intl = useIntl();
  useEffect(() => {
    if (!productModel.current) history.goBack();
  }, []);
  return (
    <PageContainer
      onBack={() => history.goBack()}
      extraContent={<Space size={24} />}
      content={
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
          <Descriptions.Item
            label={intl.formatMessage({
              id: 'pages.device.productDetail.createTime',
              defaultMessage: '创建时间',
            })}
          >
            {productModel.current?.createTime}
          </Descriptions.Item>
        </Descriptions>
      }
      extra={[
        statusMap[productModel.current?.state || 0],
        <Button key="2">
          {intl.formatMessage({
            id: 'pages.device.productDetail.disable',
            defaultMessage: '停用',
          })}
        </Button>,
        <Button key="1" type="primary">
          {intl.formatMessage({
            id: 'pages.device.productDetail.setting',
            defaultMessage: '应用配置',
          })}
        </Button>,
      ]}
    >
      <Card>
        <Tabs defaultActiveKey={'base'}>
          <Tabs.TabPane
            tab={intl.formatMessage({
              id: 'pages.device.productDetail.base',
              defaultMessage: '配置信息',
            })}
            key={'base'}
          >
            <BaseInfo />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={intl.formatMessage({
              id: 'pages.device.productDetail.metadata',
              defaultMessage: '物模型',
            })}
            key={'metadata'}
          >
            物模型
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={intl.formatMessage({
              id: 'pages.device.productDetail.alarm',
              defaultMessage: '告警设置',
            })}
            key={'alarm'}
          >
            告警设置
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </PageContainer>
  );
});
export default ProductDetail;
