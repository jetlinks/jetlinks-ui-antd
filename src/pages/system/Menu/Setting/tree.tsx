import { Input, Tree } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import DragItem from '@/pages/system/Menu/Setting/dragItem';
import { useDrop } from 'react-dnd';
import {useEffect, useState} from 'react';
import type { TreeProps } from 'antd';
import { cloneDeep, debounce } from 'lodash';
import './DragItem.less';

interface TreeBodyProps {
  treeData: any[];
  droppableId: string;
  notDragKeys?: (string | number)[];
  onDrop?: (item: any, dropIndex: string, type?: string) => void;
  onTreeDrop?: TreeProps['onDrop'];
  removeDragItem?: (id: string | number) => void;
  className?: string;
}

export const DragType = 'DragBox';

const { TreeNode } = Tree;

const defaultExpandedKeys = ['iot', 'media', 'system', 'device', 'link', 'link/Channel', 'rule-engine/Alarm', 'Northbound', 'rule-engine']

export default (props: TreeBodyProps) => {
  const [newData, setNewData] = useState(props.treeData);
  const [searchKeys, setSearchKeys] = useState<(string | number)[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<(string | number)[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  useEffect(() => {
    setNewData(cloneDeep(props.treeData));
  }, [props.treeData]);

  useEffect(() => {
    setTimeout(() => {
      setExpandedKeys(defaultExpandedKeys)
    }, 300)
  }, [])

  const [, drop] = useDrop(() => ({
    accept: DragType,
    drop(item: any, monitor) {
      const result = monitor.getDropResult();
      if (!result && props.onDrop) {
        props.onDrop(item.data, '');
      }
      return undefined;
    },
    collect: (monitor) => {
      return {
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        draggingColor: monitor.getItemType(),
      };
    },
  }));

  const createTreeNode = (data: any[], type: string): React.ReactNode => {
    return data.map((item: any) => {
      const isCanDrag = !props.notDragKeys?.includes(item.code);

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
            }
          >
            {createTreeNode(item.children, type)}
          </TreeNode>
        );
      }
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
          }
        />
      );
    });
  };

  const getParentKey = (key: string | number, data: any): string => {
    let parentKey: string;
    data.forEach((item: any) => {
      if (item.children) {
        if (item.children.some((cItem: any) => cItem.code === key)) {
          parentKey = item.code
        } else if (!!getParentKey(key, item.children)) {
          parentKey = getParentKey(key, item.children)
        }
      }
    })
    // @ts-ignore
    return parentKey
  }

  const findAllItem = (data: any[], value: string): string[] => {
    return data.reduce((pre, next) => {
      const childrenKeys = next.children ? findAllItem(next.children, value) : [];
      return next.name.includes(value)
        ? [...pre, next.code, ...childrenKeys]
        : [...pre, ...childrenKeys];
    }, []);
  };

  const searchValue = (e: any) => {
    const value = e.target.value;

    if (value) {

      const newKeys = findAllItem(props.treeData, value);
      const newExpandedKeys = newKeys.map(key => {
        return getParentKey(key, props.treeData)
      })
      setSearchKeys(newKeys);
      setExpandedKeys(newExpandedKeys);
    } else {
      setSearchKeys([]);
    }
    setAutoExpandParent(true)
  };

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
      {props.droppableId === 'source' ? (
        <div className={'tree-body'}>
          <Tree
            expandedKeys={expandedKeys}
            onExpand={(_expandedKeys) => {
              setExpandedKeys(_expandedKeys);
              setAutoExpandParent(false)
            }}
            autoExpandParent={autoExpandParent}
          >
            {createTreeNode(newData, props.droppableId)}
          </Tree>
        </div>
      ) : (
        <div className={'tree-body'} ref={drop}>
          <Tree
            expandedKeys={expandedKeys}
            onExpand={(_expandedKeys) => {
              setExpandedKeys(_expandedKeys);
              setAutoExpandParent(false)
            }}
            autoExpandParent={autoExpandParent}
            draggable={{
              icon: false,
            }}
            onDrop={props.onTreeDrop}
            className="menu-setting-drag-tree"
          >
            {createTreeNode(props.treeData, props.droppableId)}
          </Tree>
        </div>
      )}
    </div>
  );
};
