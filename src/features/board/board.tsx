import React, { useCallback, useRef, useState } from 'react';

import Layout from '@/components/layout';
import { Client, useUsersStore } from '@/store/users';
import { useSocket } from '../../context/SocketsProvider';

import { Button } from '@/components/ui/button';
import { useCursorStore } from '@/store/cursors';
import { Cursor, CursorPosition } from '../cursor/cursor';
import { Column } from './column';

export interface DragItem {
  type: string;
  id: number;
  originalColumn: string;
}

export const ItemTypes = {
  TASK: 'task',
};

export type Task = {
  id: number;
  title: string;
  column: string;
};

export interface Editor extends Client {
  userId: string;
}

const COLUMNS = ['To Do', 'In Progress', 'Done'];

const TaskBoard: React.FC = () => {
  const { cursors, setCursors } = useCursorStore();
  const { currentUser, setCurrentUser, setUsers } = useUsersStore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editors, setEditors] = useState<Map<number, Editor>>(new Map());

  const sockets = useSocket();

  const throttleTimeout = useRef<number | null>(null);

  React.useEffect(() => {
    if (sockets) {
      const handleMouseMove = (e: MouseEvent) => {
        if (throttleTimeout.current) return;

        throttleTimeout.current = window.setTimeout(() => {
          sockets?.emit('cursorMove', {
            x: e.clientX,
            y: e.clientY,
          });
          throttleTimeout.current = null;
        }, 50); // Throttle to 50ms
      };

      sockets?.on(
        'cursorPositions',
        (positions: [string, CursorPosition][]) => {
          setCursors(new Map(positions));
        }
      );

      window.addEventListener('mousemove', handleMouseMove);

      return () => {
        sockets?.off('cursorPositions');
        window.removeEventListener('mousemove', handleMouseMove);
        if (throttleTimeout.current) {
          clearTimeout(throttleTimeout.current);
        }
      };
    }
  }, [sockets]);

  React.useEffect(() => {
    if (sockets) {
      const randomName = `User-${Math.random().toString(36).substring(2, 8)}`;
      const randomColor = `#${Math.floor(Math.random() * 16777215).toString(
        16
      )}`;

      setCurrentUser({ name: randomName, color: randomColor });

      sockets.emit('clientData', { name: randomName, color: randomColor });

      sockets.on('clientsUpdate', (connectedClients: Client[]) => {
        setUsers(connectedClients);
      });

      sockets.on('initialTasks', (tasks: Task[]) => {
        setTasks(tasks);
      });

      sockets.on('taskUpdate', (tasks: Task[]) => {
        setTasks(tasks);
      });

      sockets.on('editingUpdate', (editingData: [number, Editor][]) => {
        setEditors(new Map(editingData));
      });

      sockets.on('taskUpdate', (tasks: Task[]) => {
        setTasks(tasks);
      });
    }
    return () => {
      sockets?.off('clientsUpdate');
      sockets?.off('initialTasks');
      sockets?.off('taskUpdate');
      sockets?.off('editingUpdate');
      sockets?.off('taskUpdate');
    };
  }, [sockets]);

  const handleAddTask = useCallback(() => {
    const newTask: Task = {
      id: Date.now(),
      title: `New Task ${tasks.length + 1}`,
      column: 'To Do',
    };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    sockets?.emit('createTask', newTask);
  }, [sockets]);

  const handleMoveTask = useCallback(
    (taskId: number, column: string) => {
      sockets?.emit('moveTask', { taskId, column });
      sockets?.emit('stopEditing', { taskId });
    },
    [sockets]
  );

  const startEditing = useCallback(
    (taskId: number) => {
      sockets?.emit('startEditing', { taskId });
    },
    [sockets]
  );

  const stopEditing = useCallback(
    (taskId: number) => {
      sockets?.emit('stopEditing', { taskId });
    },
    [sockets]
  );

  const handleTaskNameChange = useCallback(
    (taskId: number, newName: string) => {
      sockets?.emit('updateTaskName', { taskId, title: newName });
    },
    [sockets]
  );

  const handleDeleteTask = useCallback(
    (taskId: number) => {
      sockets?.emit('deleteTask', { taskId });
    },
    [sockets]
  );

  return (
    <Layout>
      {Array.from(cursors.entries())
        .filter(([, cursor]) => cursor.name !== currentUser?.name)
        .map(([id, cursor]) => (
          <Cursor key={id} {...cursor} />
        ))}
      <div className="flex gap-4 p-4">
        <div className="flex-1">
          <div className="grid grid-cols-3 gap-4">
            {COLUMNS.map((col) => (
              <Column
                key={col}
                title={col}
                tasks={tasks}
                onMoveTask={handleMoveTask}
                onEditStart={startEditing}
                onEditEnd={stopEditing}
                currentUser={currentUser?.name ?? null}
                editors={editors}
                handleTaskNameChange={handleTaskNameChange}
                handleDeleteTask={handleDeleteTask}
              />
            ))}
          </div>
          <Button className="mt-4 px-4 py-2 rounded" onClick={handleAddTask}>
            Add Task
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default TaskBoard;
