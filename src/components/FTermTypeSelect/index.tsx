import { ArrayItems, Select } from '@formily/antd';

const FTermTypeSelect = () => {
  const index = ArrayItems.useIndex!();
  return index > 0 ? (
    <div style={{ width: '100%', marginBottom: 15, display: 'flex', justifyContent: 'center' }}>
      <Select
        style={{ width: '200px' }}
        value="or"
        options={[
          { label: '并且', value: 'and' },
          { label: '或者', value: 'or' },
        ]}
      />
    </div>
  ) : null;
};
export default FTermTypeSelect;
