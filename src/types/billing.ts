export interface Product {
  id: string;
  name: string;
  price: number;
  discount: number;
  category: string;
  stock: number;
  description?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface InvoiceItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  discount: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  items: InvoiceItem[];
  subtotal: number;
  totalDiscount: number;
  tax: number;
  total: number;
  date: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
}