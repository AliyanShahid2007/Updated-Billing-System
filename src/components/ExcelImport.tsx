import React, { useRef } from 'react';
import { Upload, Download, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import toast from 'react-hot-toast';
import { Product } from '../types/billing';

interface ExcelImportProps {
  onImport: (products: Product[]) => void;
}

export default function ExcelImport({ onImport }: ExcelImportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const products: Product[] = jsonData.map((row: any, index: number) => ({
          id: `imported-${Date.now()}-${index}`,
          name: row.name || row.Name || row.product_name || row['Product Name'] || '',
          price: parseFloat(row.price || row.Price || row.cost || row.Cost || 0),
          discount: parseFloat(row.discount || row.Discount || row.discount_percent || row['Discount %'] || 0),
          category: row.category || row.Category || row.type || row.Type || 'General',
          stock: parseInt(row.stock || row.Stock || row.quantity || row.Quantity || 0),
          description: row.description || row.Description || row.notes || row.Notes || '',
        }));

        const validProducts = products.filter(p => p.name && p.price > 0);
        
        if (validProducts.length === 0) {
          toast.error('No valid products found in the Excel file');
          return;
        }

        onImport(validProducts);
        toast.success(`Successfully imported ${validProducts.length} products`);
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        toast.error('Error parsing Excel file. Please check the format.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const downloadTemplate = () => {
    const template = [
      {
        name: 'Sample Product 1',
        price: 100,
        discount: 10,
        category: 'Electronics',
        stock: 50,
        description: 'Sample product description'
      },
      {
        name: 'Sample Product 2',
        price: 200,
        discount: 15,
        category: 'Clothing',
        stock: 30,
        description: 'Another sample product'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Products');
    
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, 'product_template.xlsx');
    
    toast.success('Template downloaded successfully');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FileSpreadsheet className="h-6 w-6 text-blue-600 mr-3" />
          <h2 className="text-lg font-semibold text-gray-900">Excel Import</h2>
        </div>
        <button
          onClick={downloadTemplate}
          className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Template
        </button>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Import Products from Excel
        </h3>
        <p className="text-gray-500 mb-4">
          Upload an Excel file with your products, prices, and discounts
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
          className="hidden"
        />
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          <Upload className="h-5 w-5 mr-2" />
          Choose Excel File
        </button>
        
        <p className="text-xs text-gray-400 mt-4">
          Supported formats: .xlsx, .xls
        </p>
      </div>

      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Expected Excel Columns:</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-gray-600">
          <span>• name / Name / Product Name</span>
          <span>• price / Price / Cost</span>
          <span>• discount / Discount / Discount %</span>
          <span>• category / Category / Type</span>
          <span>• stock / Stock / Quantity</span>
          <span>• description / Description / Notes</span>
        </div>
      </div>
    </div>
  );
}