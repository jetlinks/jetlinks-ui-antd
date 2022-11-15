interface ItemProps {
  name: number;
  resetField: any;
  remove: (index: number | number[]) => void;
  // type: 'serial' | 'parallel'
}

export default (props: ItemProps) => {
  return <div className="">{props.name}</div>;
};
