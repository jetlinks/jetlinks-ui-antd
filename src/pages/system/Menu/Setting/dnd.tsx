import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { Tree } from 'antd';

const Dnd = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Tree />
    </DndProvider>
  );
};

export default Dnd;
