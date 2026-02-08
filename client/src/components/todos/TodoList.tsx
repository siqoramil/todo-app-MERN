import { AnimatePresence } from 'framer-motion';
import { ClipboardList } from 'lucide-react';
import { TodoItem } from './TodoItem';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { useTodos } from '@/hooks/useTodos';
import { useTodoStore } from '@/stores/todoStore';

interface TodoListProps {
  onCreateNew: () => void;
}

export function TodoList({ onCreateNew }: TodoListProps) {
  const { data, isLoading, isError, refetch } = useTodos();
  const filters = useTodoStore((state) => state.filters);
  const setPage = useTodoStore((state) => state.setPage);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        icon={<ClipboardList className="h-12 w-12" />}
        title="Failed to load todos"
        description="Something went wrong while loading your todos."
        action={
          <Button onClick={() => refetch()}>Try again</Button>
        }
      />
    );
  }

  if (!data || data.items.length === 0) {
    const hasFilters =
      filters.search ||
      filters.status ||
      filters.priority ||
      filters.tag;

    return (
      <EmptyState
        icon={<ClipboardList className="h-12 w-12" />}
        title={hasFilters ? 'No matching todos' : 'No todos yet'}
        description={
          hasFilters
            ? 'Try adjusting your filters to find what you\'re looking for.'
            : 'Create your first todo to get started!'
        }
        action={
          !hasFilters && (
            <Button onClick={onCreateNew}>Create your first todo</Button>
          )
        }
      />
    );
  }

  const totalPages = Math.ceil(data.total / data.limit);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {data.items.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </AnimatePresence>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t pt-4">
          <p className="text-sm text-muted-foreground">
            Showing {(data.page - 1) * data.limit + 1} -{' '}
            {Math.min(data.page * data.limit, data.total)} of {data.total}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(filters.page - 1)}
              disabled={data.page <= 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {data.page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(filters.page + 1)}
              disabled={data.page >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
