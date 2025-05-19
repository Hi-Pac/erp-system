import React from 'react';
import { ShoppingCart, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency } from '../../lib/utils';

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();

  const columns = [
    {
      Header: 'رقم الطلب',
      accessor: 'orderNumber',
    },
    {
      Header: 'العميل',
      accessor: 'customerName',
    },
    {
      Header: 'التاريخ',
      accessor: 'createdAt',
      Cell: ({ value }: { value: string }) => new Date(value).toLocaleDateString('ar-EG'),
    },
    {
      Header: 'المبلغ',
      accessor: 'total',
      Cell: ({ value }: { value: number }) => formatCurrency(value),
    },
    {
      Header: 'الحالة',
      accessor: 'status',
      Cell: ({ value }: { value: string }) => {
        const statusMap: Record<string, { label: string; variant: 'primary' | 'success' | 'warning' | 'danger' }> = {
          new: { label: 'جديد', variant: 'primary' },
          confirmed: { label: 'مؤكد', variant: 'primary' },
          delivered: { label: 'تم التسليم', variant: 'success' },
          cancelled: { label: 'ملغي', variant: 'danger' },
        };

        const status = statusMap[value] || { label: 'غير معروف', variant: 'warning' };
        return <Badge variant={status.variant}>{status.label}</Badge>;
      },
    },
    {
      Header: 'الإجراءات',
      accessor: 'id',
      Cell: ({ value }: { value: string }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/orders/${value}`)}
        >
          عرض
        </Button>
      ),
    },
  ];

  // Demo data - replace with actual data fetching
  const orders = [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-6 w-6 text-primary-600" />
          <h1 className="text-2xl font-bold text-gray-900">الطلبات</h1>
        </div>
        
        <Button
          onClick={() => navigate('/orders/create')}
          rightIcon={<Plus className="h-5 w-5" />}
        >
          طلب جديد
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          data={orders}
          onRowClick={(row) => navigate(`/orders/${row.id}`)}
        />
      </Card>
    </div>
  );
};

export default OrdersPage;