import { Input, InputNumber } from 'antd';
import { useEffect, useState } from 'react';

interface SipComponentProps {
  onChange?: (data: any) => void;
  value?: {
    host?: string;
    port?: number;
  };
}

const SipComponent = (props: SipComponentProps) => {
  const { value, onChange } = props;
  const [data, setData] = useState<{ host?: string; port?: number } | undefined>(value);

  useEffect(() => {
    setData(value);
  }, [value]);

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Input
        onChange={(e) => {
          if (onChange) {
            const item = {
              ...data,
              host: e.target.value,
            };
            setData(item);
            onChange(item);
          }
        }}
        value={data?.host}
        style={{ marginRight: 10 }}
        placeholder="请输入"
      />
      <InputNumber
        style={{ minWidth: 100 }}
        value={data?.port}
        min={1}
        max={65535}
        onChange={(e: number) => {
          if (onChange) {
            const item = {
              ...data,
              port: e,
            };
            setData(item);
            onChange(item);
          }
        }}
      />
    </div>
  );
};

export default SipComponent;
