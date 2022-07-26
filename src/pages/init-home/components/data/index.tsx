import { useState } from 'react';
// import { service } from '../index';
import Save from './save';

const Data = () => {
  const [flag, setFlag] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <div>
      <img
        style={{ width: 300 }}
        onClick={() => {
          setVisible(true);
        }}
        src={
          flag
            ? require('/public/images/init-home/data-enabled.png')
            : require('/public/images/init-home/data-disabled.png')
        }
      />
      {visible && (
        <Save
          close={() => {
            setVisible(false);
          }}
          save={() => {
            setVisible(false);
            setFlag(true);
          }}
        />
      )}
    </div>
  );
};

export default Data;
