import { DeleteOutlined } from '@ant-design/icons';
import { ArrayItems } from '@formily/antd';
import { Popconfirm } from 'antd';
import { useField } from '@formily/react';
import { InstanceModel, service } from '@/pages/device/Instance';

const RemoveData = () => {
  const index = ArrayItems.useIndex!();
  const self = useField();
  const array = ArrayItems.useArray!();
  if (!array) return null;
  if (array.field?.pattern !== 'editable') return null;

  return (
    <div>
      <Popconfirm
        title={'确认删除'}
        onConfirm={async () => {
          if (self?.disabled) return;
          const row = array.field.value[index];
          if (row.id) {
            const resp = await service.delTags(InstanceModel.detail?.id || '', row.id);
            if (resp.status === 200) {
              array.field?.remove?.(index);
              array.props?.onRemove?.(index);
            }
          } else {
            array.field?.remove?.(index);
            array.props?.onRemove?.(index);
          }
        }}
      >
        <DeleteOutlined />
      </Popconfirm>
    </div>
  );
};

export default RemoveData;
