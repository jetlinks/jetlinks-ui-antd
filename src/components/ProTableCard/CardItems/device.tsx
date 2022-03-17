import { Card } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';

export interface DeviceCardProps {
  id: string;
  name: string;
  photoUrl?: string;
}

export default (props: DeviceCardProps) => {
  return (
    <Card
      style={{ width: 280 }}
      cover={null}
      actions={[
        <SettingOutlined key="setting" />,
        <EditOutlined key="edit" />,
        <EllipsisOutlined key="ellipsis" />,
      ]}
    >
      <div>{props.name}</div>
    </Card>
  );
};
