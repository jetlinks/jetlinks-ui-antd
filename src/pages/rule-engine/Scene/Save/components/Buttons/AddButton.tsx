interface ButtonProps {
  children?: React.ReactDOM | string;
  onClick?: () => void;
}

const AddButton = (props: ButtonProps) => {
  return (
    <div className="rule-button-warp">
      <div className="rule-button add-button">{props.children}</div>
    </div>
  );
};

export default AddButton;
