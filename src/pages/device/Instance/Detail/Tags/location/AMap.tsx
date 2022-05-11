import { AMap } from '@/components';
import { Input, Modal } from 'antd';
import { useEffect } from 'react';

interface Props {
  value: any;
  close: () => void;
  ok: (data: any) => void;
}

export default (props: Props) => {
  useEffect(() => {}, [props.value]);
  return (
    <Modal
      visible
      title="地理位置"
      width={'55vw'}
      onCancel={() => props.close()}
      onOk={() => {
        props.ok('');
      }}
    >
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', right: 5, top: 5, zIndex: 999 }}>
          <Input />
        </div>
        <AMap
          AMapUI
          style={{
            height: 500,
            width: '100%',
          }}
          events={{
            click: (value: any) => {
              console.log(value);
            },
          }}
        />
      </div>
    </Modal>
  );
};
