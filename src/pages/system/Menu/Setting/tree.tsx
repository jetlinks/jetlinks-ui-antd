import { Input, Tree } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import DragItem from '@/pages/system/Menu/Setting/dragItem';
import { useDrop } from 'react-dnd';
import {useEffect, useState} from 'react'
import type {TreeProps} from 'antd'
import { cloneDeep, debounce } from 'lodash'
import './DragItem.less'

interface TreeBodyProps {
  treeData: any[];
  droppableId: string;
  notDragKeys?: (string| number)[]
  onDrop?: (item: any,dropIndex: string, type?: string) => void
  onTreeDrop?: TreeProps['onDrop']
  removeDragItem?: (id: string | number) => void
  className?: string
}

export const DragType = 'DragBox'

const { TreeNode } = Tree;

export default (props: TreeBodyProps) => {
  const [newData, setNewData] = useState(props.treeData)
  const [searchKeys, setSearchKeys] = useState<(string| number)[]>([])
  const [expandedKeys, setExpandedKeys] = useState<(string| number)[]>([])
  
  useEffect(() => {
    setNewData(cloneDeep(props.treeData))
  }, [props.treeData])

  const [, drop] = useDrop(() => ({
    accept: DragType,
    drop(item: any, monitor) {
      const result = monitor.getDropResult()
      if (!result && props.onDrop) {
        props.onDrop(item.data, '')
      }
      return undefined
    },
    collect: (monitor) => {
      return {
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        draggingColor: monitor.getItemType(),
      }
    },
  }))

  const createTreeNode = (data: any[], type: string): React.ReactNode => {
    return data.map((item: any) => {
      const isCanDrag = !props.notDragKeys?.includes(item.code)

      if (item.children) {
        return (
          <TreeNode
          selectable={false}
          key={item.code}
          title={
          <DragItem 
            onDrop={props.onDrop}
            data={item}
            type={type}
            canDrag={isCanDrag}
            removeDragItem={props.removeDragItem}
            isSearch={searchKeys.includes(item.code)}
            />
           }>
            {createTreeNode(item.children, type)}
          </TreeNode>
        );
      }
      return <TreeNode
      selectable={false}
      key={item.code}
      title={
      <DragItem 
        onDrop={props.onDrop}
        data={item}
        type={type}
        canDrag={isCanDrag}
        removeDragItem={props.removeDragItem}
        isSearch={searchKeys.includes(item.code)}
        />
     } />;
    });
  }

  const findAllItem = (data: any[], value: string): string[] => {
    return data.reduce((pre, next) => {
      const childrenKeys = next.children ? findAllItem(next.children, value) : []
      return next.name.includes(value) ? [...pre, next.code, ...childrenKeys] : [...pre, ...childrenKeys]
    }, [])

  }

  const searchValue = (e: any) => {
    const value = e.target.value

    if (value) {
      const sKeys = findAllItem(props.treeData, value)
      setSearchKeys(sKeys)
      setExpandedKeys(sKeys)
    } else {
      setSearchKeys([])
    }
  }


  return (
    <div className={'tree-content'}>
      <div style={{ width: '75%' }}>
        <Input
          allowClear
          prefix={<SearchOutlined style={{ color: '#B3B3B3' }} />}
          placeholder={'请输入菜单名称'}
          onChange={debounce(searchValue, 500)}
        />
      </div>
      {
        props.droppableId === 'source' ?
        <div className={'tree-body'}>
          <Tree
            expandedKeys={expandedKeys}
            onExpand={(_expandedKeys) => {
              setExpandedKeys(_expandedKeys)
            }}
          >
            {createTreeNode(newData, props.droppableId)}
          </Tree>
        </div>
          :
        <div className={'tree-body'} ref={drop} >
          <Tree
            expandedKeys={expandedKeys}
            onExpand={(_expandedKeys) => {
              setExpandedKeys(_expandedKeys)
            }}
            draggable={{
              icon: false
            }}
            onDrop={props.onTreeDrop}
            className='menu-setting-drag-tree'
          >
            {createTreeNode(props.treeData, props.droppableId)}
          </Tree>
        </div>

      }
    </div>
  );
};
