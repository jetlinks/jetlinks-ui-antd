import { Select } from 'antd';
import { useEffect, useState } from 'react';

interface SipSelectComponentProps {
  onChange?: (data: any) => void;
  value?: {
    host?: string;
    port?: number;
  };
  type?: boolean;
  data: any[];
}

const SipSelectComponent = (props: SipSelectComponentProps) => {
  const { value, onChange } = props;
  const [data, setData] = useState<{ host?: string; port?: number } | undefined>(value);
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    setData(value);
  }, [value]);

  useEffect(() => {
    if (!props.type && !value) {
      setData({ host: '0.0.0.0' });
      const dt: any = props.data.find((i) => i.host === '0.0.0.0');
      setList(dt?.portList || []);
    }
    if (value) {
      const dt: any = props.data.find((i) => i.host === value.host);
      setList(dt?.portList || []);
    }
  }, [props.type]);

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Select
        showSearch
        allowClear
        value={data?.host}
        style={{ marginRight: 10 }}
        placeholder="请选择IP地址"
        disabled={!props.type}
        onChange={(e) => {
          if (onChange) {
            const item = {
              port: undefined,
              host: e,
            };
            onChange(item);
            const dt: any = props.data.find((i) => i.host === e);
            setList(dt?.portList || []);
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
        allowClear
        style={{ minWidth: 100 }}
        value={data?.port}
        placeholder="请选择端口"
        optionFilterProp="children"
        onChange={(e: number) => {
          if (onChange) {
            const item = {
              ...data,
              port: e,
            };
            onChange(item);
          }
        }}
        filterOption={(input: string, option: any) =>
          String(option?.children)?.toLowerCase()?.indexOf(String(input).toLowerCase()) >= 0
        }
      >
        {list.map((item) => (
          <Select.Option key={item?.port} value={item?.port}>
            {(item?.transports || []).join('/')}({item?.port})
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};

export default SipSelectComponent;
