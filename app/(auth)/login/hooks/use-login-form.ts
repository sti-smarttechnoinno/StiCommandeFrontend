'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function useLoginForm() {
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = useCallback(
    async (data: LoginFormData) => {
      setIsLoading(true);
      try {
        // Simulate API call - in production this would call the actual auth endpoint
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Demo login - accept any valid email/password
        const user = {
          id: 'usr-001',
          name: data.email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          email: data.email,
          role: 'admin',
          avatar: data.email.charAt(0).toUpperCase(),
        };

        login(user, 'demo-access-token', 'demo-refresh-token');

        if (rememberMe) {
          localStorage.setItem('remembered_email', data.email);
        } else {
          localStorage.removeItem('remembered_email');
        }

        toast.success('Login successful', {
          description: `Welcome back, ${user.name}`,
        });

        // Redirect to dashboard
        window.location.href = '/dashboard';
      } catch (error) {
        toast.error('Login failed', {
          description: 'Invalid email or password. Please try again.',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [login, rememberMe]
  );

  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    showPassword,
    togglePassword,
    isLoading,
    rememberMe,
    setRememberMe,
  };
}
