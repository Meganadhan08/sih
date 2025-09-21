import React, { useState } from 'react';
import { MapPin, Eye, Edit, LogOut, ArrowLeft, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Batch {
  id: string;
  species: string;
  quantity: number;
  date: string;
  status: string;
  gps: { lat: number; lng: number };
  farmerName: string;
}

const AgentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [statusUpdate, setStatusUpdate] = useState('');

  const assignedBatches: Batch[] = [
    { id: 'BATCH002', species: 'Ashwagandha', quantity: 30, date: '2024-01-14', status: 'assigned_to_agency', gps: { lat: 12.9716, lng: 77.5946 }, farmerName: 'Ramesh Kumar' },
    { id: 'BATCH003', species: 'Ashwagandha', quantity: 25, date: '2024-01-13', status: 'collected', gps: { lat: 12.9716, lng: 77.5946 }, farmerName: 'Suresh Naik' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned_to_agency': return 'bg-blue-100 text-blue-800';
      case 'collected': return 'bg-green-100 text-green-800';
      case 'in_transit': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'assigned_to_agency': return 'Assigned to Agency';
      case 'collected': return 'Collected';
      case 'in_transit': return 'In Transit';
      default: return status;
    }
  };

  const handleStatusUpdate = () => {
    if (selectedBatch && statusUpdate) {
      selectedBatch.status = statusUpdate; // frontend only
      setSelectedBatch(null);
      setStatusUpdate('');
    }
  };

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <header className="bg-green-600 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate('/')} className="text-white hover:text-gray-200">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold text-white">Agent Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
              <User className="w-5 h-5 text-green-700" />
              <span className="text-green-700 font-medium">{user?.name}</span>
            </div>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Assigned Batches</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignedBatches.map(batch => (
            <div key={batch.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">{batch.species}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(batch.status)}`}>
                  {getStatusText(batch.status)}
                </span>
              </div>
              <p className="text-sm text-gray-600"><strong>Batch ID:</strong> {batch.id}</p>
              <p className="text-sm text-gray-600"><strong>Farmer:</strong> {batch.farmerName}</p>
              <p className="text-sm text-gray-600"><strong>Quantity:</strong> {batch.quantity} kg</p>
              <p className="text-sm text-gray-600"><strong>Date:</strong> {batch.date}</p>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{batch.gps.lat.toFixed(4)}, {batch.gps.lng.toFixed(4)}</span>
              </div>
              <button
                onClick={() => setSelectedBatch(batch)}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 mt-3"
              >
                <Eye className="w-4 h-4" />
                <span>View Details</span>
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Batch Details Modal */}
      {selectedBatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Batch Details</h2>
              <button onClick={() => setSelectedBatch(null)} className="text-gray-500 hover:text-gray-700">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p><strong>Batch ID:</strong> {selectedBatch.id}</p>
              <p><strong>Species:</strong> {selectedBatch.species}</p>
              <p><strong>Quantity:</strong> {selectedBatch.quantity} kg</p>
              <p><strong>Date:</strong> {selectedBatch.date}</p>
              <p><strong>Farmer:</strong> {selectedBatch.farmerName}</p>
              <p><strong>GPS:</strong> {selectedBatch.gps.lat.toFixed(4)}, {selectedBatch.gps.lng.toFixed(4)}</p>
              <p><strong>Status:</strong> <span className={`inline-flex px-2 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedBatch.status)}`}>{getStatusText(selectedBatch.status)}</span></p>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Update Status</label>
                <select
                  value={statusUpdate}
                  onChange={(e) => setStatusUpdate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select Status</option>
                  <option value="in_transit">In Transit</option>
                  <option value="collected">Collected</option>
                </select>
                <button
                  onClick={handleStatusUpdate}
                  className="mt-3 w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>Update Status</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentDashboard;
