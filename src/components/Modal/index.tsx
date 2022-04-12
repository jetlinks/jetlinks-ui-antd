import { Button, Modal } from 'antd';
import type { ModalProps } from 'antd/lib/modal';
import { getButtonPermission } from '@/utils/menu';
import { BUTTON_PERMISSION, MENUS_CODE_TYPE } from '@/utils/menu/router';
import * as React from 'react';

export interface ModalPlusProps extends ModalProps {
  permissionCode?: MENUS_CODE_TYPE;
  permission?: BUTTON_PERMISSION | BUTTON_PERMISSION[];
}

const ModalPlus: React.FC<ModalPlusProps> = (props) => {
  const {
    confirmLoading,
    onOk,
    okText,
    cancelText,
    permissionCode,
    permission,
    children,
    ...extraProps
  } = props;

  return (
    <Modal
      {...extraProps}
      footer={[
        <Button key={'cancel'} onClick={props.onCancel}>
          {cancelText || '取消'}
        </Button>,
        <Button
          key={'submit'}
          type={'primary'}
          loading={confirmLoading}
          onClick={onOk}
          disabled={permissionCode ? getButtonPermission(permissionCode, permission!) : false}
        >
          {okText || '确定'}
        </Button>,
      ]}
    >
      {children}
    </Modal>
  );
};

export default ModalPlus;
