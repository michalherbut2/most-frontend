'use client';

import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { useRedirectIfAuthenticated } from '@/features/auth/hooks';
import { PageSpinner } from '@/shared/ui/Spinner';

export default function RegisterPage() {
  const { isLoading } = useRedirectIfAuthenticated();

  if (isLoading) {
    return <PageSpinner />;
  }

  return (
    <div className="flex items-center justify-center">
      <RegisterForm />
    </div>
  );
}