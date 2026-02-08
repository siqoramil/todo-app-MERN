import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    return (
      <div className="flex items-center space-x-2">
        <div className="relative">
          <input
            type="checkbox"
            ref={ref}
            id={id}
            className={cn(
              'peer h-4 w-4 shrink-0 appearance-none rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 checked:bg-primary checked:border-primary',
              className
            )}
            {...props}
          />
          <Check className="absolute top-0 left-0 h-4 w-4 text-primary-foreground pointer-events-none opacity-0 peer-checked:opacity-100" />
        </div>
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
