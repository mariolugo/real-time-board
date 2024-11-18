import { useDrop } from 'react-dnd';
import { DragItem, Editor, ItemTypes, Task } from './board';
import { Card } from './card';

export function Column({
  title,
  tasks,
  onMoveTask,
  onEditStart,
  onEditEnd,
  handleDeleteTask,
  editors,
  handleTaskNameChange,
  currentUser,
}: {
  title: string;
  tasks: Task[];
  onMoveTask: (taskId: number, column: string) => void;
  onEditStart: (taskId: number) => void;
  onEditEnd: (taskId: number, newName?: string) => void;
  handleDeleteTask: (id: number) => void;
  editors: Map<number, Editor>;
  currentUser: string | null;
  handleTaskNameChange: (id: number, title: string) => void;
}) {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ItemTypes.TASK,
      drop: (item: DragItem) => {
        if (item.originalColumn !== title) {
          onMoveTask(item.id, title);
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }),
    [title, onMoveTask]
  );

  return (
    <div key={title} className="border rounded p-4">
      <h2 className="font-bold mb-4">{title}</h2>
      <div
        ref={drop}
        className={`bg-accent min-h-[400px] transition-colors p-2 ${
          isOver ? 'bg-accent-foreground/20' : ''
        }`}
      >
        {tasks
          .filter((task) => task.column === title)
          .map((task, index) => (
            <Card
              key={index}
              task={task}
              isEditing={
                editors.has(task.id) &&
                currentUser !== editors.get(task.id)?.name
              }
              color={editors.get(task.id)?.color}
              stopEditing={onEditEnd}
              startEditing={onEditStart}
              handleTaskNameChange={handleTaskNameChange}
              handleDeleteTask={handleDeleteTask}
            />
          ))}
      </div>
    </div>
  );
}
