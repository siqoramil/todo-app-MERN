import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function isOverdue(dueDate: string): boolean {
  return new Date(dueDate) < new Date();
}

export function getDaysUntilDue(dueDate: string): number {
  const now = new Date();
  const due = new Date(dueDate);
  const diffTime = due.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'high':
      return 'text-red-500 bg-red-500/10';
    case 'medium':
      return 'text-yellow-500 bg-yellow-500/10';
    case 'low':
      return 'text-green-500 bg-green-500/10';
    default:
      return 'text-muted-foreground bg-muted';
  }
}

export function getStatusColor(completed: boolean): string {
  return completed
    ? 'text-green-500 bg-green-500/10'
    : 'text-blue-500 bg-blue-500/10';
}
