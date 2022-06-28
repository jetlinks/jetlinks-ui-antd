import { Button, Descriptions, Tooltip } from 'antd';
import { useIntl } from '@@/plugin-locale/localeExports';
import { InstanceModel } from '@/pages/device/Instance';
import { useEffect, useState } from 'react';
import { EditOutlined } from '@ant-design/icons';
import Edit from './Edit';

const Tags = () => {
  const intl = useIntl();
  const [tags, setTags] = useState<any[]>([]);
  const [visible, setVisible] = useState<boolean>(false);

  const tag = InstanceModel.detail?.tags;

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
        column={3}
        size="small"
        title={
          <span>
            {intl.formatMessage({
              id: 'pages.device.instanceDetail.tags',
              defaultMessage: '标签',
            })}
            <Button
              type="link"
              onClick={() => {
                setVisible(true);
              }}
            >
              <EditOutlined />
              编辑
            </Button>
          </span>
        }
      >
        {(tags || [])?.map((item: any) => (
          <Descriptions.Item span={1} label={`${item.name}（${item.key})`} key={item.key}>
            <Tooltip title={item.value || ''} placement="topLeft">
              <div className="ellipsis" style={{ width: 300 }}>
                {item.value || ''}
              </div>
            </Tooltip>
          </Descriptions.Item>
        ))}
      </Descriptions>
      {visible && (
        <Edit
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
