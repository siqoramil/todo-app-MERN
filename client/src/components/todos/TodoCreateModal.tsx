import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { useCreateTodo } from '@/hooks/useTodos';

const createTodoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().max(2000, 'Description is too long').optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  dueDate: z.string().optional(),
  tags: z.string().optional(),
});

type CreateTodoFormData = z.infer<typeof createTodoSchema>;

interface TodoCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TodoCreateModal({ isOpen, onClose }: TodoCreateModalProps) {
  const { mutate: createTodo, isPending } = useCreateTodo();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTodoFormData>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: {
      priority: 'medium',
    },
  });

  const onSubmit = (data: CreateTodoFormData) => {
    const tags = data.tags
      ? data.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
      : [];

    createTodo(
      {
        title: data.title,
        description: data.description || undefined,
        priority: data.priority,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
        tags,
      },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      }
    );
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Todo"
      description="Add a new task to your list"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            placeholder="What needs to be done?"
            error={errors.title?.message}
            {...register('title')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Add more details..."
            rows={3}
            error={errors.description?.message}
            {...register('description')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select id="priority" {...register('priority')}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="datetime-local"
              {...register('dueDate')}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            placeholder="work, urgent, personal (comma-separated)"
            {...register('tags')}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isPending}>
            Create Todo
          </Button>
        </div>
      </form>
    </Modal>
  );
}
