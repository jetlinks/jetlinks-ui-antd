import { Draggable } from 'react-beautiful-dnd';

interface DragItemProps {
  data: any;
  type: string;
}

const DragItem = (props: DragItemProps) => {
  return (
    <Draggable
      draggableId={props.type + '&' + props.data.id}
      index={props.type + '&' + props.data.id}
      isCombineEnabled={true}
    >
      {(provided) => (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          {props.data.name}
        </div>
      )}
    </Draggable>
  );
};

export default DragItem;
