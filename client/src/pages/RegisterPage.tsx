import { motion } from 'framer-motion';
import { CheckSquare } from 'lucide-react';
import { RegisterForm } from '@/components/auth/RegisterForm';

export function RegisterPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md space-y-6"
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-10 w-10 text-primary" />
          <span className="text-3xl font-bold">TodoApp</span>
        </div>
        <p className="text-muted-foreground">
          Create an account to start organizing your life
        </p>
      </div>
      <RegisterForm />
    </motion.div>
  );
}
