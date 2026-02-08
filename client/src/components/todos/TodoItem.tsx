import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  Check,
  Trash2,
  Edit2,
  Calendar,
  Tag,
  AlertCircle,
} from 'lucide-react';
import { cn, getPriorityColor, isOverdue } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToggleTodo, useDeleteTodo } from '@/hooks/useTodos';
import { TodoEditModal } from './TodoEditModal';
import type { Todo } from '@/types';

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { mutate: toggleTodo, isPending: isToggling } = useToggleTodo();
  const { mutate: deleteTodo, isPending: isDeleting } = useDeleteTodo();

  const handleToggle = () => {
    toggleTodo({ id: todo.id, completed: !todo.completed });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this todo?')) {
      deleteTodo(todo.id);
    }
  };

  const isDue = todo.dueDate && isOverdue(todo.dueDate) && !todo.completed;

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={cn(
          'group flex items-start gap-4 rounded-lg border bg-card p-4 transition-all hover:shadow-md',
          todo.completed && 'opacity-60'
        )}
      >
        <button
          onClick={handleToggle}
          disabled={isToggling}
          className={cn(
            'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
            todo.completed
              ? 'border-green-500 bg-green-500'
              : 'border-muted-foreground hover:border-primary'
          )}
        >
          {todo.completed && <Check className="h-3 w-3 text-white" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={cn(
                'font-medium leading-tight',
                todo.completed && 'line-through text-muted-foreground'
              )}
            >
              {todo.title}
            </h3>
            <Badge className={cn('shrink-0', getPriorityColor(todo.priority))}>
              {todo.priority}
            </Badge>
          </div>

          {todo.description && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {todo.description}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-2">
            {todo.dueDate && (
              <div
                className={cn(
                  'flex items-center gap-1 text-xs',
                  isDue ? 'text-red-500' : 'text-muted-foreground'
                )}
              >
                {isDue ? (
                  <AlertCircle className="h-3 w-3" />
                ) : (
                  <Calendar className="h-3 w-3" />
                )}
                {format(new Date(todo.dueDate), 'MMM d, yyyy')}
              </div>
            )}

            {todo.tags.length > 0 && (
              <div className="flex items-center gap-1">
                <Tag className="h-3 w-3 text-muted-foreground" />
                {todo.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {todo.tags.length > 3 && (
                  <span className="text-xs text-muted-foreground">
                    +{todo.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsEditOpen(true)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      <TodoEditModal
        todo={todo}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />
    </>
  );
}
