import { ArrayItems } from '@formily/antd';
import { Select } from 'antd';

interface Props {
  name?: string;
  value: string;
  onChange: () => void;
}

const GroupNameControl = (props: Props) => {
  const index = ArrayItems.useIndex!();
  return (
    <>
      {index === 0 ? (
        <div style={{ fontWeight: 600 }}>{props?.name || '第一组'}</div>
      ) : (
        <Select
          onChange={props.onChange}
          value={props.value}
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
