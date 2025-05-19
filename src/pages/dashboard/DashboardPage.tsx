import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency } from '../../lib/utils';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  ShoppingCart, 
  Truck,
  PlusCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import DashboardChart from './DashboardChart';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week');
  
  // Demo data for the dashboard
  const stats = {
    totalSales: 45800,
    totalOrders: 24,
    activeCustomers: 18,
    pendingPayments: 12500,
    salesChange: 12.5, // percentage
    ordersChange: -5.2, // percentage
  };
  
  const recentOrders = [
    { id: '1', orderNumber: 'ORD-231201-001', customer: 'شركة الأمل للمقاولات', date: '2023-12-01', total: 5600, status: 'new' },
    { id: '2', orderNumber: 'ORD-231130-005', customer: 'مؤسسة الإعمار', date: '2023-11-30', total: 8250, status: 'confirmed' },
    { id: '3', orderNumber: 'ORD-231129-003', customer: 'شركة المستقبل', date: '2023-11-29', total: 4320, status: 'sent_to_factory' },
    { id: '4', orderNumber: 'ORD-231128-002', customer: 'معرض الديكور الحديث', date: '2023-11-28', total: 9100, status: 'delivered' },
  ];
  
  const pendingPayments = [
    { id: '1', customer: 'شركة الأمل للمقاولات', dueDate: '2023-12-10', amount: 5600 },
    { id: '2', customer: 'مؤسسة البناء الحديث', dueDate: '2023-12-15', amount: 4250 },
    { id: '3', customer: 'معرض الألوان الجديدة', dueDate: '2023-12-20', amount: 2650 },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="info">جديد</Badge>;
      case 'confirmed':
        return <Badge variant="primary">مؤكد</Badge>;
      case 'sent_to_factory':
        return <Badge variant="secondary">مرسل للمصنع</Badge>;
      case 'delivered':
        return <Badge variant="success">تم التسليم</Badge>;
      default:
        return <Badge>غير معروف</Badge>;
    }
  };

  useEffect(() => {
    // Here we would fetch real data from the backend
    // For now using demo data
  }, [period]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 md:mb-0">لوحة التحكم</h1>
        
        <div className="flex items-center space-x-2 space-x-reverse">
          <Button
            variant={period === 'day' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setPeriod('day')}
          >
            اليوم
          </Button>
          <Button
            variant={period === 'week' ? 'primary' : 'outline'}
            size="sm" 
            onClick={() => setPeriod('week')}
          >
            الأسبوع
          </Button>
          <Button
            variant={period === 'month' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setPeriod('month')}
          >
            الشهر
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="animate-fade-in">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">إجمالي المبيعات</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{formatCurrency(stats.totalSales)}</p>
            </div>
            <div className="p-2 bg-primary-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-primary-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <div className={`p-1 rounded-full ${stats.salesChange >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              {stats.salesChange >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
            </div>
            <p className={`text-sm ml-2 ${stats.salesChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.salesChange >= 0 ? '+' : ''}{stats.salesChange}%
            </p>
            <p className="text-xs text-gray-500 mr-1">مقارنة بالفترة السابقة</p>
          </div>
        </Card>
        
        <Card className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">إجمالي الطلبات</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{stats.totalOrders}</p>
            </div>
            <div className="p-2 bg-secondary-100 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-secondary-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <div className={`p-1 rounded-full ${stats.ordersChange >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              {stats.ordersChange >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
            </div>
            <p className={`text-sm ml-2 ${stats.ordersChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.ordersChange >= 0 ? '+' : ''}{stats.ordersChange}%
            </p>
            <p className="text-xs text-gray-500 mr-1">مقارنة بالفترة السابقة</p>
          </div>
        </Card>
        
        <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">العملاء النشطين</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{stats.activeCustomers}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/customers')}
            >
              عرض العملاء
            </Button>
          </div>
        </Card>
        
        <Card className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">المستحقات المعلقة</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{formatCurrency(stats.pendingPayments)}</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/payments')}
            >
              عرض المستحقات
            </Button>
          </div>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="تحليل المبيعات" className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="h-80">
            <DashboardChart type="sales" period={period} />
          </div>
        </Card>
        
        <Card title="المنتجات الأكثر مبيعاً" className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="h-80">
            <DashboardChart type="products" period={period} />
          </div>
        </Card>
      </div>
      
      {/* Recent Orders */}
      <Card 
        title="أحدث الطلبات" 
        headerAction={
          <Button
            variant="outline"
            size="sm"
            rightIcon={<PlusCircle className="h-4 w-4" />}
            onClick={() => navigate('/orders/create')}
          >
            طلب جديد
          </Button>
        }
        className="animate-fade-in"
        style={{ animationDelay: '0.6s' }}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  رقم الطلب
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  العميل
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التاريخ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المبلغ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.date).toLocaleDateString('ar-EG')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      عرض
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      
      {/* Pending Payments */}
      <Card 
        title="مدفوعات مستحقة قريبًا" 
        className="animate-fade-in"
        style={{ animationDelay: '0.7s' }}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  العميل
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تاريخ الاستحقاق
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المبلغ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الوقت المتبقي
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {payment.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(payment.dueDate).toLocaleDateString('ar-EG')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(payment.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-yellow-500 ml-1" />
                      <span className="text-sm text-yellow-600">
                        {Math.floor((new Date(payment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} يوم
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/payments')}
                    >
                      تسجيل دفعة
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;