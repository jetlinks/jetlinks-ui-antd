import React from 'react';
import { Drawer, Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import DeviceInfo from '@/pages/device/instance/editor/index';

interface Props extends FormComponentProps {
  close: Function;
  deviceId: string;
}

const GroupOnDeviceInfo: React.FC<Props> = props => {

  return (
    <Drawer visible width='60%' title='设备详情'
      onClose={() => props.close()}
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
export default Form.create<Props>()(GroupOnDeviceInfo);
