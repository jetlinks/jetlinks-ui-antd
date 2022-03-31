import { Input, Tree } from 'antd';

const LeftTree = () => {
  return (
    <div className="left-content">
      <Input.Search />
      <Tree />
    </div>
  );
};

export default LeftTree;
