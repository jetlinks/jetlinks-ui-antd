import { DeleteOutlined } from '@ant-design/icons';
import { ArrayItems } from '@formily/antd';
import { Popconfirm } from 'antd';
import { useField } from '@formily/react';

interface Props {
  onDelete: (item: any) => void;
}

const RemoveData = (props: Props) => {
  const index = ArrayItems.useIndex!();
  const self = useField();
  const array = ArrayItems.useArray!();
  const item = ArrayItems.useRecord!()();
  if (!array) return null;
  if (array.field?.pattern !== 'editable') return null;

  return (
    <div>
      <Popconfirm
        title={'确认删除'}
        onConfirm={() => {
          if (self?.disabled) return;
          array.field?.remove?.(index);
          array.props?.onRemove?.(index);
          props.onDelete(item);
        }}
      >
        <DeleteOutlined />
      </Popconfirm>
    </div>
  );
};

export default RemoveData;
