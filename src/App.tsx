import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import BillingTab from './components/BillingTab';
import ProductsTab from './components/ProductsTab';
import CustomersTab from './components/CustomersTab';
import SettingsTab from './components/SettingsTab';
import { Product, Customer, Invoice } from './types/billing';

interface CompanySettings {
  name: string;
  email: string;
  phone: string;
  address: string;
  taxRate: number;
  currency: string;
  invoicePrefix: string;
}

function App() {
  const [activeTab, setActiveTab] = useState('billing');
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [settings, setSettings] = useState<CompanySettings>({
    name: 'Your Company Name',
    email: 'contact@yourcompany.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business St, City, State 12345',
    taxRate: 10,
    currency: 'USD',
    invoicePrefix: 'INV',
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedProducts = localStorage.getItem('billing-products');
    const savedCustomers = localStorage.getItem('billing-customers');
    const savedInvoices = localStorage.getItem('billing-invoices');
    const savedSettings = localStorage.getItem('billing-settings');

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      // Add some sample products
      const sampleProducts: Product[] = [
        {
          id: 'sample-1',
          name: 'Web Development Service',
          price: 100,
          discount: 0,
          category: 'Services',
          stock: 999,
          description: 'Professional web development services'
        },
        {
          id: 'sample-2',
          name: 'Consulting Hour',
          price: 150,
          discount: 10,
          category: 'Consulting',
          stock: 999,
          description: 'Business consulting services'
        }
      ];
      setProducts(sampleProducts);
    }

    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    } else {
      // Add some sample customers
      const sampleCustomers: Customer[] = [
        {
          id: 'customer-1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1 (555) 123-4567',
          address: '123 Main St, City, State 12345'
        },
        {
          id: 'customer-2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+1 (555) 987-6543',
          address: '456 Oak Ave, City, State 12345'
        }
      ];
      setCustomers(sampleCustomers);
    }

    if (savedInvoices) {
      setInvoices(JSON.parse(savedInvoices));
    }

    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('billing-products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('billing-customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('billing-invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('billing-settings', JSON.stringify(settings));
  }, [settings]);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'billing':
        return (
          <BillingTab
            products={products}
            customers={customers}
            invoices={invoices}
            onInvoicesChange={setInvoices}
          />
        );
      case 'products':
        return (
          <ProductsTab
            products={products}
            onProductsChange={setProducts}
          />
        );
      case 'customers':
        return (
          <CustomersTab
            customers={customers}
            onCustomersChange={setCustomers}
          />
        );
      case 'settings':
        return (
          <SettingsTab
            settings={settings}
            onSettingsChange={setSettings}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderActiveTab()}
      </main>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}

export default App;