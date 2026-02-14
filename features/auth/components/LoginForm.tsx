'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/Card';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ROUTES } from '@/shared/lib/constants';
import { AlertCircle } from 'lucide-react';

export function LoginForm() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
    
  const [serverError, setServerError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: 'asd@asd.pl',
    password: 'asdasdasd',
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.email) {
      errors.email = 'Email jest wymagany';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Nieprawidłowy format email';
    }

    if (!formData.password) {
      errors.password = 'Hasło jest wymagane';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);
    
    if (!validateForm()) {
      return;
    }

    try {
      await login(formData);
      router.push(ROUTES.public.home);
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Błąd logowania. Sprawdź dane.';
      setServerError(message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    if (serverError) setServerError(null);
  };

  return (
    <Card className="w-full max-w-md" variant="bordered">
      <CardHeader>
        <CardTitle>Zaloguj się</CardTitle>
        <CardDescription>
          Wprowadź swoje dane, aby uzyskać dostęp do konta
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {serverError && (
            <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <p>{serverError}</p>
            </div>
          )}

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={validationErrors.email}
            placeholder="twoj@email.com"
            fullWidth
            required
          />

          <Input
            label="Hasło"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={validationErrors.password}
            placeholder="••••••••"
            fullWidth
            required
          />
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
            disabled={isLoading}
          >
            Zaloguj się
          </Button>
          
          <p className="text-center text-sm text-muted-foreground">
            Nie masz konta?{' '}
            <Link
              href={ROUTES.public.register}
              className="font-medium text-primary hover:underline"
            >
              Zarejestruj się
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}