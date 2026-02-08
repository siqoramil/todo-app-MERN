import { Fragment, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <Fragment>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'relative w-full max-w-lg rounded-lg border bg-background p-6 shadow-lg',
                className
              )}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
              {title && (
                <div className="mb-4">
                  <h2 className="text-lg font-semibold">{title}</h2>
                  {description && (
                    <p className="text-sm text-muted-foreground">{description}</p>
                  )}
                </div>
              )}
              {children}
            </motion.div>
          </div>
        </Fragment>
      )}
    </AnimatePresence>
  );
}
