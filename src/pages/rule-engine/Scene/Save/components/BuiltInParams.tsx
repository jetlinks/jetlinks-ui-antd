import { Space } from 'antd';

interface BuiltInParamsProps {
  name: string;
  description?: string;
}

const BuiltInParamsTitle = (props: BuiltInParamsProps) => {
  return (
    <Space>
      {props.name}
      {props.description && (
        <div style={{ color: 'grey', marginLeft: '5px' }}>({props.description})</div>
      )}
    </Space>
  );
};

export const BuiltInParamsHandleTreeData = (data: any): any[] => {
  if (data.length > 0) {
    return data.map((item: any) => {
      const name = <BuiltInParamsTitle {...item} />;

      if (item.children) {
        return {
          ...item,
          name,
          disabled: true,
          children: BuiltInParamsHandleTreeData(item.children),
        };
      }
      return { ...item, name };
    });
  }
  return [];
};

export default BuiltInParamsTitle;
