import { Button } from '@/components/ui/button';
import {
  Card as CardComponent,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDrag } from 'react-dnd';
import { DragItem, ItemTypes, type Task } from './board';
export function Card({
  task,
  isEditing,
  color,
  startEditing,
  stopEditing,
  handleTaskNameChange,
  handleDeleteTask,
}: {
  startEditing: (id: number) => void;
  stopEditing: (id: number) => void;
  task: Task;
  isEditing: boolean;
  color?: string;
  handleTaskNameChange: (id: number, title: string) => void;
  handleDeleteTask: (id: number) => void;
}) {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.TASK,
      item: (monior) => {
        startEditing(task.id);
        return {
          type: ItemTypes.TASK,
          id: task.id,
          originalColumn: task.column,
        } as DragItem;
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: () => {
        stopEditing(task.id);
      },
      canDrag: !isEditing,
    }),
    [task.id, task.column, isEditing]
  );

  console.log({ task });

  return (
    <CardComponent
      ref={drag}
      className={`
        rounded-md shadow p-2 border flex flex-col mb-4
        ${isEditing ? 'ring-2 ring-blue-400' : ''} 
        ${isDragging ? 'opacity-50' : ''}`}
    >
      <CardHeader className="flex">
        {task.title}{' '}
        {isEditing && (
          <div
            className="w-3 h-3 rounded-full border border-solid border-black"
            style={{
              backgroundColor: color,
            }}
          />
        )}
      </CardHeader>
      <CardContent className="flex">
        <div className="flex flex-col gap-2">
          <Label>Change name</Label>
          <Input
            className="w-full border rounded px-2 py-1"
            defaultValue={task.title}
            value={task.title}
            onFocus={() => startEditing(task.id)}
            onBlur={(e) => {
              stopEditing(task.id);
              handleTaskNameChange(task.id, e.target.value);
            }}
            onChange={(e) => {
              handleTaskNameChange(task.id, e.currentTarget.value);
            }}
          />
          <Button
            className="mt-4  px-4 py-2 rounded"
            onClick={() => handleDeleteTask(task.id)}
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </CardComponent>
  );
}
