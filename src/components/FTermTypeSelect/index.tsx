import { ArrayItems, Select } from '@formily/antd';

interface Props {
  value: any;
  onChange: (value: string) => void;
}

const FTermTypeSelect = (props: Props) => {
  const index = ArrayItems.useIndex!();
  return index > 0 ? (
    <div
      style={{
        width: '100%',
        marginTop: -20,
        marginBottom: 15,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Select
        onChange={(value) => props.onChange(value)}
        value={props.value}
        style={{ width: '200px' }}
        options={[
          { label: '并且', value: 'and' },
          { label: '或者', value: 'or' },
        ]}
      />
    </div>
  ) : null;
};
export default FTermTypeSelect;
