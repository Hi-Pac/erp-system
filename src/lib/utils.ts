export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'EGP',
  }).format(amount);
};

export const formatDate = (date: Date | string): string => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ar-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
};

export const generateOrderNumber = (prefix: string = 'ORD'): string => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `${prefix}-${year}${month}${day}-${random}`;
};

export const calculateOrderTotal = (items: any[]): { 
  subtotal: number, 
  total: number 
} => {
  const subtotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const total = items.reduce((sum, item) => {
    const itemTotal = item.unitPrice * item.quantity;
    const itemDiscount = item.discount ? itemTotal * (item.discount / 100) : 0;
    return sum + (itemTotal - itemDiscount);
  }, 0);
  
  return { subtotal, total };
};

export const getPaymentStatusLabel = (status: string): {
  label: string;
  color: string;
} => {
  switch (status) {
    case 'paid':
      return { label: 'مدفوع', color: 'bg-green-100 text-green-800' };
    case 'partial':
      return { label: 'مدفوع جزئياً', color: 'bg-yellow-100 text-yellow-800' };
    case 'unpaid':
      return { label: 'غير مدفوع', color: 'bg-red-100 text-red-800' };
    default:
      return { label: 'غير معروف', color: 'bg-gray-100 text-gray-800' };
  }
};

export const getOrderStatusLabel = (status: string): {
  label: string;
  color: string;
} => {
  switch (status) {
    case 'new':
      return { label: 'جديد', color: 'bg-blue-100 text-blue-800' };
    case 'confirmed':
      return { label: 'مؤكد', color: 'bg-indigo-100 text-indigo-800' };
    case 'sent_to_factory':
      return { label: 'مرسل للمصنع', color: 'bg-purple-100 text-purple-800' };
    case 'received_from_factory':
      return { label: 'مستلم من المصنع', color: 'bg-pink-100 text-pink-800' };
    case 'delivered':
      return { label: 'تم التسليم', color: 'bg-teal-100 text-teal-800' };
    case 'paid':
      return { label: 'مدفوع', color: 'bg-green-100 text-green-800' };
    case 'partially_paid':
      return { label: 'مدفوع جزئياً', color: 'bg-yellow-100 text-yellow-800' };
    case 'cancelled':
      return { label: 'ملغي', color: 'bg-red-100 text-red-800' };
    default:
      return { label: 'غير معروف', color: 'bg-gray-100 text-gray-800' };
  }
};