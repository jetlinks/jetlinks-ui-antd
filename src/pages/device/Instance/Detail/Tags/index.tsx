import { Descriptions, Tooltip } from 'antd';
import { useIntl } from '@@/plugin-locale/localeExports';
import { InstanceModel, service } from '@/pages/device/Instance';
import { useEffect, useState } from 'react';
import { EditOutlined } from '@ant-design/icons';
import Edit from './Edit';
import { PermissionButton } from '@/components';

const Tags = () => {
  const intl = useIntl();
  const [tags, setTags] = useState<any[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const { permission } = PermissionButton.usePermission('device/Instance');

  const tag = InstanceModel.detail?.tags;

  const getDetail = async () => {
    const response = await service.detail(InstanceModel.detail?.id || '');
    if (response.status === 200) {
      InstanceModel.detail = { ...InstanceModel.detail, ...response?.result };
    }
  };

  useEffect(() => {
    if (tag) {
      setTags([...tag] || []);
    }
  }, [tag]);

  return (
    <div style={{ width: '100%', marginTop: '20px' }}>
      <Descriptions
        style={{ marginBottom: 20 }}
        bordered
        column={2}
        labelStyle={{ width: 150 }}
        contentStyle={{ minWidth: 100 }}
        size="small"
        title={
          <span>
            {intl.formatMessage({
              id: 'pages.device.instanceDetail.tags',
              defaultMessage: '标签',
            })}
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
          </span>
        }
      >
        {(tags || [])?.map((item: any) => (
          <Descriptions.Item span={1} label={`${item.name}（${item.key})`} key={item.key}>
            <Tooltip title={item.value || ''} placement="topLeft">
              <div className="ellipsis" style={{ maxWidth: 300 }}>
                {item.value || ''}
              </div>
            </Tooltip>
          </Descriptions.Item>
        ))}
      </Descriptions>
      {visible && (
        <Edit
          refresh={() => {
            getDetail();
          }}
          close={() => {
            setVisible(false);
          }}
          tags={tags}
        />
      )}
    </div>
  );
};

export default Tags;
