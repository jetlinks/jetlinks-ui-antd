import { EnvironmentOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { useState } from 'react';
import AMap from './AMap';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const GeoComponent = (props: Props) => {
  const [visible, setVisible] = useState<boolean>(false);
  return (
    <div>
      <Input
        readOnly
        addonAfter={
          <EnvironmentOutlined
            onClick={() => {
              setVisible(true);
            }}
          />
        }
        value={props.value}
      />
      {visible && (
        <AMap
          value={props.value}
          close={() => {
            setVisible(false);
          }}
          ok={(param) => {
            console.log(param);
          }}
        />
      )}
    </div>
  );
};
export default GeoComponent;
