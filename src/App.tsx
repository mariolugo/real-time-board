import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { SocketProvider } from './context/SocketsProvider';
import TaskBoard from './features/board/board';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <SocketProvider>
        <DndProvider backend={HTML5Backend}>
          <TaskBoard />
        </DndProvider>
      </SocketProvider>
    </div>
  );
}

export default App;
