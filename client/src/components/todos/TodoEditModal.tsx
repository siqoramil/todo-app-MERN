import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { useUpdateTodo } from '@/hooks/useTodos';
import type { Todo } from '@/types';

const updateTodoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().max(2000, 'Description is too long').optional(),
  completed: z.boolean(),
  priority: z.enum(['low', 'medium', 'high']),
  dueDate: z.string().optional(),
  tags: z.string().optional(),
});

type UpdateTodoFormData = z.infer<typeof updateTodoSchema>;

interface TodoEditModalProps {
  todo: Todo;
  isOpen: boolean;
  onClose: () => void;
}

export function TodoEditModal({ todo, isOpen, onClose }: TodoEditModalProps) {
  const { mutate: updateTodo, isPending } = useUpdateTodo();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateTodoFormData>({
    resolver: zodResolver(updateTodoSchema),
  });

  useEffect(() => {
    if (isOpen && todo) {
      reset({
        title: todo.title,
        description: todo.description || '',
        completed: todo.completed,
        priority: todo.priority,
        dueDate: todo.dueDate
          ? format(new Date(todo.dueDate), "yyyy-MM-dd'T'HH:mm")
          : '',
        tags: todo.tags.join(', '),
      });
    }
  }, [isOpen, todo, reset]);

  const onSubmit = (data: UpdateTodoFormData) => {
    const tags = data.tags
      ? data.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
      : [];

    updateTodo(
      {
        id: todo.id,
        data: {
          title: data.title,
          description: data.description || null,
          completed: data.completed,
          priority: data.priority,
          dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
          tags,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Todo"
      description="Update your task details"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="edit-title">Title *</Label>
          <Input
            id="edit-title"
            placeholder="What needs to be done?"
            error={errors.title?.message}
            {...register('title')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-description">Description</Label>
          <Textarea
            id="edit-description"
            placeholder="Add more details..."
            rows={3}
            error={errors.description?.message}
            {...register('description')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="edit-priority">Priority</Label>
            <Select id="edit-priority" {...register('priority')}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-dueDate">Due Date</Label>
            <Input
              id="edit-dueDate"
              type="datetime-local"
              {...register('dueDate')}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-tags">Tags</Label>
          <Input
            id="edit-tags"
            placeholder="work, urgent, personal (comma-separated)"
            {...register('tags')}
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="edit-completed"
            className="h-4 w-4 rounded border-gray-300"
            {...register('completed')}
          />
          <Label htmlFor="edit-completed" className="cursor-pointer">
            Mark as completed
          </Label>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isPending}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
