import React, { PureComponent } from 'react';
import { Modal, Button, Form } from 'antd';

interface AddressSettingProps {
  visible?: boolean
  onOk?: Function
  onCancel?: Function
}

interface AddressSettingState {
  visible?: boolean
}

export default class AddressSetting extends PureComponent<AddressSettingProps, AddressSettingState> {

  constructor(props: AddressSettingProps) {
    super(props)
    this.state = {
      visible: false
    }

  }

  render() {
    return <>
      <Modal>

      </Modal>
    </>
  }
}
