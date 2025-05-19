import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const { currentUser, signIn, loading, error } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(error);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // If already logged in, redirect to dashboard
  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data: LoginFormData) => {
    try {
      setAuthError(null);
      await signIn(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      setAuthError('خطأ في تسجيل الدخول. يرجى التحقق من بيانات الدخول والمحاولة مرة أخرى.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-8 py-6 bg-primary-600">
          <h2 className="text-center text-3xl font-bold text-white">
            HCP ERP
          </h2>
          <p className="mt-2 text-center text-sm text-primary-100">
            نظام إدارة موارد المؤسسة
          </p>
        </div>
        
        <div className="px-8 py-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            تسجيل الدخول
          </h3>
          
          {authError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md text-sm">
              {authError}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Input
                id="email"
                type="email"
                label="البريد الإلكتروني"
                placeholder="أدخل البريد الإلكتروني"
                leftIcon={<Mail className="h-5 w-5" />}
                error={errors.email?.message}
                {...register('email')}
                fullWidth
              />
            </div>
            
            <div>
              <Input
                id="password"
                type="password"
                label="كلمة المرور"
                placeholder="أدخل كلمة المرور"
                leftIcon={<Lock className="h-5 w-5" />}
                error={errors.password?.message}
                {...register('password')}
                fullWidth
              />
            </div>
            
            <div>
              <Button
                type="submit"
                variant="primary"
                isLoading={loading}
                fullWidth
              >
                تسجيل الدخول
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;