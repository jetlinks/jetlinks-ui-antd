import { Select } from 'antd';
import { useEffect, useState } from 'react';

interface SipSelectComponentProps {
  onChange?: (data: any) => void;
  value?: {
    host?: string;
    port?: number;
  };
  transport?: 'UDP' | 'TCP';
  data: any[];
}

const SipSelectComponent = (props: SipSelectComponentProps) => {
  const { value, onChange, transport } = props;
  const [data, setData] = useState<{ host?: string; port?: number } | undefined>(value);
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    setData(value);
  }, [value]);

  useEffect(() => {
    setData(undefined);
  }, [transport]);

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Select
        showSearch
        value={data?.host}
        style={{ marginRight: 10 }}
        placeholder="请选择IP地址"
        optionFilterProp="children"
        onChange={(e) => {
          if (onChange) {
            const item = {
              port: undefined,
              host: e,
            };
            setData(item);
            onChange(item);
            const dt: any = props.data.find((i) => i.host === e);
            setList(dt?.ports[transport || ''] || []);
          }
        }}
        filterOption={(input: string, option: any) =>
          String(option?.children)?.toLowerCase()?.indexOf(String(input).toLowerCase()) >= 0
        }
      >
        {(props.data || []).map((item: any) => (
          <Select.Option key={item.host} value={item.host}>
            {item.host}
          </Select.Option>
        ))}
      </Select>
      <Select
        showSearch
        style={{ maxWidth: 100 }}
        value={data?.port}
        placeholder="请选择端口"
        optionFilterProp="children"
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
        filterOption={(input: string, option: any) =>
          String(option?.children)?.toLowerCase()?.indexOf(String(input).toLowerCase()) >= 0
        }
      >
        {list.map((item) => (
          <Select.Option key={item} value={item}>
            {item}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};

export default SipSelectComponent;
