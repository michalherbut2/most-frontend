'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/Card';
import { authApi } from '../api';
import { ROUTES } from '@/shared/lib/constants';
import { AlertCircle } from 'lucide-react';

export function RegisterForm() {
  const router = useRouter();

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      router.push(ROUTES.public.login + '?registered=true');
    },
  });

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.email) {
      errors.email = 'Email jest wymagany';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Nieprawidłowy format email';
    }

    if (!formData.firstName) {
      errors.firstName = 'Imię jest wymagane';
    } else if (formData.firstName.length > 50) {
      errors.firstName = 'Imię może mieć maksymalnie 50 znaków';
    }

    if (!formData.lastName) {
      errors.lastName = 'Nazwisko jest wymagane';
    } else if (formData.lastName.length > 50) {
      errors.lastName = 'Nazwisko może mieć maksymalnie 50 znaków';
    }

    if (!formData.password) {
      errors.password = 'Hasło jest wymagane';
    } else if (formData.password.length < 8) {
      errors.password = 'Hasło musi mieć minimum 8 znaków';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Hasła nie są identyczne';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    registerMutation.reset();

    if (!validateForm()) {
      return;
    }

    const { confirmPassword, ...registerData } = formData;
    registerMutation.mutate(registerData);
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
  };

  return (
    <Card className="w-full max-w-md" variant="bordered">
      <CardHeader>
        <CardTitle>Zarejestruj się</CardTitle>
        <CardDescription>
          Utwórz nowe konto, aby rozpocząć
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {registerMutation.error && (
            <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <p>{(registerMutation.error as any)?.message || 'Wystąpił błąd podczas rejestracji'}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Imię"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={validationErrors.firstName}
              placeholder="Jan"
              required
            />

            <Input
              label="Nazwisko"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={validationErrors.lastName}
              placeholder="Kowalski"
              required
            />
          </div>

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
            helperText="Minimum 8 znaków"
            fullWidth
            required
          />

          <Input
            label="Potwierdź hasło"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={validationErrors.confirmPassword}
            placeholder="••••••••"
            fullWidth
            required
          />
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            fullWidth
            isLoading={registerMutation.isPending}
            disabled={registerMutation.isPending}
          >
            Zarejestruj się
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Masz już konto?{' '}
            <Link
              href={ROUTES.public.login}
              className="font-medium text-primary hover:underline"
            >
              Zaloguj się
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}