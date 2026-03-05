import { motion } from 'framer-motion';
import { CheckSquare } from 'lucide-react';
import { useSearchParams, Navigate } from 'react-router-dom';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

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
          Set your new password
        </p>
      </div>
      <ResetPasswordForm token={token} />
    </motion.div>
  );
}
