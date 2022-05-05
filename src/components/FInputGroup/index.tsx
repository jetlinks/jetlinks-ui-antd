import { Input } from 'antd';
import { GroupProps } from 'antd/lib/input';
import React from 'react';

const InputGroup = Input.Group;

export const FInputGroup: React.FC<GroupProps> = (props) => {
  return React.createElement(InputGroup, {
    ...props,
  });
};
export default FInputGroup;
