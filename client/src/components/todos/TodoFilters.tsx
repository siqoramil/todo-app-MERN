import { Search, X, Filter, ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useTodoStore } from '@/stores/todoStore';

export function TodoFilters() {
  const filters = useTodoStore((state) => state.filters);
  const setSearch = useTodoStore((state) => state.setSearch);
  const setStatus = useTodoStore((state) => state.setStatus);
  const setPriority = useTodoStore((state) => state.setPriority);
  const setSortBy = useTodoStore((state) => state.setSortBy);
  const setOrder = useTodoStore((state) => state.setOrder);
  const resetFilters = useTodoStore((state) => state.resetFilters);

  const hasActiveFilters =
    filters.search ||
    filters.status ||
    filters.priority ||
    filters.tag;

  const activeFilterCount = [
    filters.status,
    filters.priority,
    filters.tag,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search todos..."
            className="pl-10"
            value={filters.search || ''}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <Select
              value={filters.status || 'all'}
              onChange={(e) =>
                setStatus(
                  e.target.value === 'all'
                    ? undefined
                    : (e.target.value as 'active' | 'completed')
                )
              }
              className="w-32"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </Select>
          </div>

          <Select
            value={filters.priority || ''}
            onChange={(e) =>
              setPriority(
                e.target.value === ''
                  ? undefined
                  : (e.target.value as 'low' | 'medium' | 'high')
              )
            }
            className="w-32"
          >
            <option value="">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </Select>

          <Select
            value={`${filters.sortBy}-${filters.order}`}
            onChange={(e) => {
              const [sortBy, order] = e.target.value.split('-');
              setSortBy(sortBy as 'createdAt' | 'dueDate' | 'priority');
              setOrder(order as 'asc' | 'desc');
            }}
            className="w-40"
          >
            <option value="createdAt-desc">Newest first</option>
            <option value="createdAt-asc">Oldest first</option>
            <option value="dueDate-asc">Due date (earliest)</option>
            <option value="dueDate-desc">Due date (latest)</option>
            <option value="priority-desc">Priority (high to low)</option>
            <option value="priority-asc">Priority (low to high)</option>
          </Select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Active filters:
          </span>
          {filters.search && (
            <Badge variant="secondary">
              Search: "{filters.search}"
            </Badge>
          )}
          {filters.status && (
            <Badge variant="secondary">Status: {filters.status}</Badge>
          )}
          {filters.priority && (
            <Badge variant="secondary">Priority: {filters.priority}</Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={resetFilters}
          >
            <X className="h-3 w-3 mr-1" />
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
