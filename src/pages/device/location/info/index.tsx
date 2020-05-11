import React, { useEffect } from 'react';
import { Drawer, Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import DeviceInfo from '@/pages/device/instance/editor/index';

interface Props extends FormComponentProps {
  close: Function;
  deviceId: string;
}

const Save: React.FC<Props> = props => {

  useEffect(() => {

  }, []);

  return (
    <Drawer
      visible
      /*placement='bottom'
      height='90vh'*/
      width='60%'
      onClose={() => props.close()}
      title='设备详情'
    >
      <DeviceInfo location={{
        pathname: `/device/instance/save/${props.deviceId}`,
        search: '',
        hash: "",
        query: {},
        state: undefined,
      }}/>
    </Drawer>
  );
};
export default Form.create<Props>()(Save);
