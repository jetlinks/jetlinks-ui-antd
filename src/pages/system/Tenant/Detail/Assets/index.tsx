import ProCard from '@ant-design/pro-card';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Card, Form, Row, Select, Statistic } from 'antd';
import { Col } from 'antd';
import { useEffect } from 'react';
import { observer } from '@formily/react';
import { service } from '@/pages/system/Tenant';
import { useParams } from 'umi';
import TenantModel from '@/pages/system/Tenant/model';
import type { TenantMember } from '@/pages/system/Tenant/typings';
import encodeQuery from '@/utils/encodeQuery';
import { useIntl } from '@@/plugin-locale/localeExports';

const Assets = observer(() => {
  const intl = useIntl();
  const param = useParams<{ id: string }>();

  const getDeviceCount = (type: 'online' | 'offline') => {
    // 查询资产数量
    service.assets
      .deviceCount(
        encodeQuery({
          terms: {
            state: type,
            id$assets: {
              tenantId: param.id,
              assetType: 'device',
              memberId: TenantModel.assetsMemberId,
            },
          },
        }),
      )
      .subscribe((data) => {
        TenantModel.assets.device[type] = data;
      });
  };

  // 1\0 已发布\未发布
  const getProductCount = (type: 1 | 0) => {
    service.assets
      .productCount(
        encodeQuery({
          terms: {
            state: type,
            id$assets: {
              tenantId: param.id,
              assetType: 'product',
              memberId: TenantModel.assetsMemberId,
            },
          },
        }),
      )
      .subscribe((data) => {
        TenantModel.assets.product[type] = data;
      });
  };

  useEffect(() => {
    // 查询成员
    service.queryMemberNoPaging(param.id).subscribe((data: TenantMember[]) => {
      TenantModel.members = data;
    });
  }, []);

  useEffect(() => {
    getProductCount(1);
    getProductCount(0);
    getDeviceCount('online');
    getDeviceCount('offline');
  }, [TenantModel.assetsMemberId]);
  return (
    <Card>
      <Form.Item
        label={intl.formatMessage({
          id: 'pages.system.tenant.assetInformation.member',
          defaultMessage: '成员',
        })}
        style={{ width: 200 }}
      >
        <Select
          onChange={(id: string) => {
            TenantModel.assetsMemberId = id;
          }}
          options={TenantModel.members.map((item) => ({ label: item.name, value: item.userId }))}
        />
      </Form.Item>
      <ProCard gutter={[16, 16]} style={{ marginTop: 16 }}>
        <ProCard
          title={intl.formatMessage({
            id: 'pages.system.tenant.assetInformation.product',
            defaultMessage: '产品',
          })}
          colSpan="25%"
          bordered
          actions={[<EyeOutlined key="setting" />, <EditOutlined key="edit" />]}
        >
          <Row>
            <Col span={12}>
              <Statistic
                title={intl.formatMessage({
                  id: 'pages.system.tenant.assetInformation.published',
                  defaultMessage: '已发布',
                })}
                value={TenantModel.assets.product['1']}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title={intl.formatMessage({
                  id: 'pages.system.tenant.assetInformation.unpublished',
                  defaultMessage: '未发布',
                })}
                value={TenantModel.assets.product['0']}
              />
            </Col>
          </Row>
        </ProCard>

        <ProCard
          title={intl.formatMessage({
            id: 'pages.system.tenant.assetInformation.device',
            defaultMessage: '设备',
          })}
          colSpan="25%"
          bordered
          actions={[<EyeOutlined key="setting" />, <EditOutlined key="edit" />]}
        >
          <Row>
            <Col span={12}>
              <Statistic
                title={intl.formatMessage({
                  id: 'pages.system.tenant.assetInformation.onLine',
                  defaultMessage: '在线',
                })}
                value={TenantModel.assets.device.online}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title={intl.formatMessage({
                  id: 'pages.system.tenant.assetInformation.offLine',
                  defaultMessage: '离线',
                })}
                value={TenantModel.assets.device.offline}
              />
            </Col>
          </Row>
        </ProCard>
      </ProCard>
    </Card>
  );
});
export default Assets;
