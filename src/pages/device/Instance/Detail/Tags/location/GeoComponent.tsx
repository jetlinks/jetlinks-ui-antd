import { EnvironmentOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { useEffect, useState } from 'react';
import AMap from './AMap';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const GeoComponent = (props: Props) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [value, setValue] = useState<any>(props?.value);

  useEffect(() => {
    setValue(props?.value);
  }, [props.value]);

  return (
    <div>
      <Input
        addonAfter={
          <EnvironmentOutlined
            onClick={() => {
              setVisible(true);
            }}
          />
        }
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          props.onChange(e.target.value);
        }}
      />
      {visible && (
        <AMap
          value={value}
          close={() => {
            setVisible(false);
          }}
          ok={(param) => {
            props.onChange(param);
            setValue(param);
            setVisible(false);
          }}
        />
      )}
    </div>
  );
};
export default GeoComponent;
