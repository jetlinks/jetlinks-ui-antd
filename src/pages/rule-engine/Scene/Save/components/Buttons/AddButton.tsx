import type { CSSProperties } from 'react';
import React from 'react';

interface ButtonProps {
  children?: React.ReactChild[] | React.ReactChild | string;
  onClick?: () => void;
  style?: CSSProperties;
}

const AddButton = (props: ButtonProps) => {
  return (
    <div className="rule-button-warp" style={props.style}>
      <div className="rule-button add-button" onClick={props.onClick}>
        {props.children}
      </div>
    </div>
  );
};

export default AddButton;
