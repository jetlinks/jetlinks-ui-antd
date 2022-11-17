import type { CSSProperties } from 'react';

interface ButtonProps {
  children?: React.ReactDOM | string;
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
