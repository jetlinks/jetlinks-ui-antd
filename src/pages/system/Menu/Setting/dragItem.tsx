import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

interface DragItemProps {
  data: any;
  type: string;
}

const DragItem = (props: DragItemProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: props.type,
    collect: (monitor) => {
      console.log(monitor.getItem());
      // const { index: dragIndex } = monitor.getItem() || {};
      // if (dragIndex === index) {
      //   return {};
      // }
      return {
        isOver: monitor.isOver(),
        dropClassName: 'dropping',
      };
    },
    drop: (item: { index: React.Key }) => {
      console.log(item);
      // moveNode(item.index, index);
    },
  });
  const [, drag] = useDrag({
    type: props.type,
    item: { index: props.data.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drop(drag(ref));

  return (
    <div ref={ref} className={isOver ? dropClassName : ''}>
      {props.data.name}
    </div>
  );
};

export default DragItem;
