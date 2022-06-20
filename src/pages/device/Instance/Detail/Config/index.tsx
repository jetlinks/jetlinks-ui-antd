import { Descriptions, Space, Tooltip } from 'antd';
import { InstanceModel, service } from '@/pages/device/Instance';
import { useEffect, useState } from 'react';
import type { ConfigMetadata } from '@/pages/device/Product/typings';
import { history, useParams } from 'umi';
import {
  CheckOutlined,
  EditOutlined,
  QuestionCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import Edit from './Edit';
import { PermissionButton } from '@/components';
import { onlyMessage } from '@/utils/util';

const Config = () => {
  const params = useParams<{ id: string }>();
  useEffect(() => {
    const id = InstanceModel.current?.id || params.id;
    if (!id) {
      history.goBack();
    }
  }, []);

  const [metadata, setMetadata] = useState<ConfigMetadata[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const { permission } = PermissionButton.usePermission('device/Instance');

  const id = params?.id;

  const getDetail = () => {
    service.detail(id || '').then((resp) => {
      if (resp.status === 200) {
        InstanceModel.detail = { id, ...resp.result };
      }
    });
  };

  useEffect(() => {
    if (id) {
      service.getConfigMetadata(id).then((config) => {
        InstanceModel.config = config?.result || [];
        setMetadata(config?.result || []);
      });
    }
  }, [id]);

  const isExit = (property: string) => {
    return (
      InstanceModel.detail?.cachedConfiguration &&
      InstanceModel.detail?.cachedConfiguration[property] !== undefined &&
      InstanceModel.detail?.configuration &&
      InstanceModel.detail?.configuration[property] !==
        InstanceModel.detail?.cachedConfiguration[property]
    );
  };

  const renderComponent = (item: any) => {
    if (InstanceModel.detail?.configuration) {
      const config = InstanceModel.detail?.configuration;
      if (item.type.type === 'password' && config[item.property]?.length > 0) {
        return '••••••';
      }
      if (isExit(item.property)) {
        return (
          <div>
            <span style={{ marginRight: '10px' }}>{config[item.property] || '--'}</span>
            <Tooltip title={`有效值:${config[item.property]}`}>
              <QuestionCircleOutlined />
            </Tooltip>
          </div>
        );
      } else {
        return (
          <div>
            <Tooltip title={config[item.property] || '--'} placement="topLeft">
              <div className="ellipsis" style={{ width: 300 }}>
                {config[item.property] || '--'}
              </div>
            </Tooltip>
          </div>
        );
      }
    } else {
      return '--';
    }
  };

  return metadata.length > 0 ? (
    <div style={{ width: '100%', marginTop: '20px' }} className="config">
      <div style={{ display: 'flex', marginBottom: 20 }}>
        <div style={{ fontSize: 16, fontWeight: 700 }}>配置</div>
        <Space>
          <PermissionButton
            isPermission={permission.update}
            type="link"
            onClick={async () => {
              setVisible(true);
            }}
          >
            <EditOutlined />
            编辑
          </PermissionButton>
          {InstanceModel.detail.state?.value !== 'notActive' && (
            <PermissionButton
              popConfirm={{
                title: '确认重新应用该配置？',
                onConfirm: async () => {
                  const resp = await service.deployDevice(id || '');
                  if (resp.status === 200) {
                    onlyMessage('操作成功');
                    getDetail();
                  }
                },
              }}
              isPermission={permission.update}
              type="link"
            >
              <CheckOutlined />
              应用配置
              <Tooltip title="修改配置后需重新应用后才能生效。">
                <QuestionCircleOutlined />
              </Tooltip>
            </PermissionButton>
          )}
          {InstanceModel.detail?.aloneConfiguration && (
            <PermissionButton
              popConfirm={{
                title: '确认恢复默认配置？',
                onConfirm: async () => {
                  const resp = await service.configurationReset(id || '');
                  if (resp.status === 200) {
                    onlyMessage('恢复默认配置成功');
                    getDetail();
                  }
                },
              }}
              type="link"
              isPermission={permission.update}
            >
              <SyncOutlined />
              恢复默认
              <Tooltip
                title={`该设备单独编辑过配置信息，点击此将恢复成默认的配置信息，请谨慎操作。`}
              >
                <QuestionCircleOutlined />
              </Tooltip>
            </PermissionButton>
          )}
        </Space>
      </div>
      <div>
        {(metadata || []).map((i) => (
          <Descriptions
            size="small"
            column={3}
            key={i.name}
            bordered
            title={<h4 style={{ fontSize: 15 }}>{i.name}</h4>}
          >
            {(i?.properties || []).map((item: any) => (
              <Descriptions.Item
                span={1}
                label={
                  item?.description ? (
                    <div>
                      <span style={{ marginRight: '10px' }}>{item.name}</span>
                      <Tooltip title={item.description}>
                        <QuestionCircleOutlined />
                      </Tooltip>
                    </div>
                  ) : (
                    item.name
                  )
                }
                key={item.property}
              >
                {renderComponent(item)}
              </Descriptions.Item>
            ))}
          </Descriptions>
        ))}
      </div>
      {visible && (
        <Edit
          metadata={metadata || []}
          close={() => {
            setVisible(false);
          }}
          reload={getDetail}
        />
      )}
    </div>
  ) : null;
};

export default Config;
