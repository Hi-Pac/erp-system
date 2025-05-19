import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Home } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100" dir="rtl">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mt-4">الصفحة غير موجودة</h2>
        <p className="text-gray-600 mt-2 max-w-md mx-auto">
          عذراً، الصفحة التي تبحث عنها غير موجودة. يرجى التحقق من الرابط والمحاولة مرة أخرى.
        </p>
        
        <div className="mt-8">
          <Button
            variant="primary"
            size="lg"
            leftIcon={<Home className="h-5 w-5" />}
            onClick={() => navigate('/')}
          >
            العودة للصفحة الرئيسية
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;