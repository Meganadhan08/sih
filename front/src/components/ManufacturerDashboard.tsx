// src/components/ManufacturerDashboard.tsx
import React, { useState } from 'react';
import { Save, LogOut, ArrowLeft } from 'lucide-react';
import QRCode from 'react-qr-code';
import { useAuth } from '../contexts/AuthContext';

interface ManufacturerDashboardProps {
  onBack?: () => void;
}

const ManufacturerDashboard: React.FC<ManufacturerDashboardProps> = ({ onBack }) => {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    herbName: '',
    partUsed: '',
    quantityProcessed: '',
    dryingMethod: '',
    extractionMethod: '',
    productName: '',
    formulationType: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Manufacturing batch submitted:', formData);
    alert('Batch submitted successfully!');
    setFormData({
      herbName: '',
      partUsed: '',
      quantityProcessed: '',
      dryingMethod: '',
      extractionMethod: '',
      productName: '',
      formulationType: '',
    });
  };

  // Custom dropdown component for reuse
  const Dropdown: React.FC<{ name: string; value: string; options: string[]; placeholder: string }> = ({ name, value, options, placeholder }) => (
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={handleInputChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 cursor-pointer transition hover:border-green-500"
        required
      >
        <option value="">{placeholder}</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">▼</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <header className="bg-green-600 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            {onBack && (
              <button onClick={onBack} className="p-2 rounded hover:bg-green-500/30">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h1 className="text-2xl font-bold">Manufacturer Dashboard</h1>
            <span className="text-green-100 text-sm">Welcome, {user?.name}</span>
          </div>
          <button
            onClick={logout}
            className="flex items-center space-x-2 px-3 py-2 bg-red-500 rounded hover:bg-red-600 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto p-6">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Processing & Manufacturing Form</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Dropdown name="herbName" value={formData.herbName} options={['Ashwagandha', 'Tulsi', 'Neem']} placeholder="Select Herb" />
              <Dropdown name="partUsed" value={formData.partUsed} options={['Root', 'Leaf', 'Seed']} placeholder="Select Part" />
            </div>

            <div>
              <input
                type="number"
                name="quantityProcessed"
                value={formData.quantityProcessed}
                onChange={handleInputChange}
                placeholder="Quantity Processed (kg)"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Dropdown name="dryingMethod" value={formData.dryingMethod} options={['Sun', 'Shade', 'Mechanical']} placeholder="Select Drying Method" />
              <Dropdown name="extractionMethod" value={formData.extractionMethod} options={['None', 'Water', 'Alcohol']} placeholder="Select Extraction Method" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Dropdown name="productName" value={formData.productName} options={['Ashwagandha Capsule', 'Churna', 'Tablet']} placeholder="Select Product" />
              <Dropdown name="formulationType" value={formData.formulationType} options={['Capsule', 'Powder', 'Syrup']} placeholder="Select Formulation Type" />
            </div>

            {/* Submit & QR */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 flex items-center space-x-2 transition"
              >
                <Save className="w-4 h-4" />
                <span>Save Batch</span>
              </button>

              <div className="p-4 bg-gray-100 rounded-xl flex flex-col items-center">
                <h3 className="font-medium mb-2">QR Code</h3>
                <QRCode value={JSON.stringify(formData)} size={128} />
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ManufacturerDashboard;
