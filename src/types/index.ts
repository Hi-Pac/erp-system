export type User = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'user';
  createdAt: Date;
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  address: string;
  type: 'business' | 'retail' | 'individual';
  defaultDiscount: number;
  balance: number;
  notes?: string;
  createdAt: Date;
};

export type Supplier = {
  id: string;
  name: string;
  phone: string;
  address: string;
  contactPerson?: string;
  email?: string;
  balance: number;
  notes?: string;
  createdAt: Date;
};

export type ProductCategory = 'construction' | 'exterior' | 'decorative';

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  unit: string;
  purchasePrice: number;
  sellingPrice: number;
  batches: Batch[];
  minStock?: number;
  imageUrl?: string;
  description?: string;
  createdAt: Date;
};

export type Batch = {
  id: string;
  code: string;
  quantity: number;
  purchasePrice?: number;
  expiryDate?: Date;
  createdAt: Date;
};

export type PaymentMethod = 'cash' | 'bank_transfer' | 'e_wallet' | 'check';

export type PaymentStatus = 'paid' | 'partial' | 'unpaid';

export type OrderItem = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  total: number;
};

export type OrderStatus = 
  | 'new' 
  | 'confirmed' 
  | 'sent_to_factory'
  | 'received_from_factory'
  | 'delivered'
  | 'paid'
  | 'partially_paid'
  | 'cancelled';

export type Order = {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Payment = {
  id: string;
  relatedId: string; // Order ID or Supplier order ID
  type: 'customer' | 'supplier';
  amount: number;
  paymentMethod: PaymentMethod;
  reference?: string;
  checkNumber?: string;
  checkDueDate?: Date;
  bankName?: string;
  notes?: string;
  createdAt: Date;
};

export type FactoryOrder = {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  total: number;
  status: 'new' | 'in_process' | 'shipped' | 'received';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
};