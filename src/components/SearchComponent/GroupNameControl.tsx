import { ArrayItems } from '@formily/antd';
import { Select } from 'antd';

const GroupNameControl = (props: { name: string }) => {
  const index = ArrayItems.useIndex!();
  return (
    <>
      {index === 0 ? (
        <div style={{ textAlign: 'center', fontWeight: 600 }}>{props?.name || '第一组'}</div>
      ) : (
        <Select
          options={[
            { label: '并且', value: 'and' },
            { label: '或者', value: 'or' },
          ]}
        />
      )}
    </>
  );
};
export default GroupNameControl;
