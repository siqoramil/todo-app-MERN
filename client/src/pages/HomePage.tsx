import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, CheckCircle2, Circle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { TodoList } from '@/components/todos/TodoList';
import { TodoFilters } from '@/components/todos/TodoFilters';
import { TodoCreateModal } from '@/components/todos/TodoCreateModal';
import { useTodos } from '@/hooks/useTodos';
import { useAuthStore } from '@/stores/authStore';

export function HomePage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const { data } = useTodos();

  const stats = {
    total: data?.total || 0,
    completed: data?.items.filter((t) => t.completed).length || 0,
    pending: data?.items.filter((t) => !t.completed).length || 0,
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold">
          Welcome back, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-muted-foreground">
          Here's what's on your plate today.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4"
      >
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
              <Circle className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Tasks</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/10">
              <Clock className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.pending}</p>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.completed}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your Tasks</h2>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>

        <TodoFilters />
        <TodoList onCreateNew={() => setIsCreateOpen(true)} />
      </motion.div>

      <TodoCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  );
}
