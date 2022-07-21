import {useDrag, useDrop} from 'react-dnd';
import {useEffect, useRef, useState} from "react";
import { CloseOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { DragType } from './tree';
import { Popconfirm, Tooltip } from 'antd';

interface DragItemProps {
  data: any;
  type: string;
  canDrag: boolean;
  isSearch?: boolean;
  onDrop?: (item: any,dropIndex: string, type?: 'source' | 'menu') => void
  removeDragItem?: (id: string | number) => void
}

const DragItem = (props: DragItemProps) => {

  const ref = useRef<HTMLDivElement>(null)
  const [isDrag, setIsDrag] = useState(props.type === 'source')

  useEffect(() => {
    setIsDrag(props.type === 'source' && props.canDrag)
  }, [props.canDrag])

  const [, drop] = useDrop(() => ({
    accept: DragType,
    drop(item: any) {
      props.onDrop?.(item.data, props.data.code, item.type)
      return undefined
    },
    collect: (monitor) => {
      const { index } = monitor.getItem() || {};
      if (index === props.data.code) {
        return {}
      }
      return {
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }
    },
  }))

  const [, drag] = useDrag(() => (
    {
      type: DragType,
      item: {
        index: props.data.code,
        data: props.data,
        type: props.type
      },
      collect: (monitor) => {
        return {
          isDragging: monitor.isDragging(),
        }
      },
      canDrag: isDrag
    }
  ), [isDrag, props.data]);


  drag(drop(ref))

  const style = props.type === 'source' ? isDrag ? {
    border: '1px solid #E0E0E0',
    padding: '0px 4px',
    backgroundColor: '#F6F6F6',
    borderRadius: 4,
    color: '#2F54EB',
    width: 'fit-content'
  } : {
    color: '#666666',
    cursor: 'not-allowed',
    width: 'fit-content'
  } : {}

  return (
    <div ref={ref} style={style} className={classNames({'tree-drag-item': props.type === 'menu'})}>
      <span style={props.isSearch ? { color: '#f50' }: {}}>
       {props.data.name}
      </span>
      {
        props.type === 'menu' && 
        <Popconfirm
          title='确认删除？'
          onConfirm={(e: any) => {
            e?.stopPropagation()
            props.removeDragItem?.(props.data.code)
          }}
        >
          <Tooltip title='删除' >
            <CloseOutlined />
          </Tooltip>
        </Popconfirm>
      }
    </div>
  );
};

export default DragItem;
