import { Input, Tree } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import DragItem from '@/pages/system/Menu/Setting/dragItem';
import { Droppable } from 'react-beautiful-dnd';

interface TreeBodyProps {
  treeData: any[];
  droppableId: string;
}

const { TreeNode } = Tree;

export default (props: TreeBodyProps) => {
  const createTreeNode = (data: any[], type: string): React.ReactNode => {
    return data.map((item: any) => {
      if (item.children) {
        return (
          <TreeNode title={<DragItem data={item} type={type} />}>
            {createTreeNode(item.children, type)}
          </TreeNode>
        );
      }
      return <TreeNode title={<DragItem data={item} type={type} />}></TreeNode>;
    });
  };

  return (
    <div className={'tree-content'}>
      <div style={{ width: '75%' }}>
        <Input
          prefix={<SearchOutlined style={{ color: '#B3B3B3' }} />}
          placeholder={'请输入菜单名称'}
        />
      </div>
      <div className={'tree-body'}>
        <Droppable
          droppableId={props.droppableId}
          direction="horizontal"
          type="COLUMN"
          isCombineEnabled={true}
        >
          {(provided) => (
            <div
              className="columns"
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{ height: '100%' }}
            >
              <Tree draggable={props.droppableId === 'menu'}>
                {createTreeNode(props.treeData, props.droppableId)}
              </Tree>
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
};
