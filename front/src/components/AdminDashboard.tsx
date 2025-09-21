// src/components/AdminDashboard.tsx
import React, { useState } from 'react';
import { LogOut, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Batch {
  id: string;
  species: string;
  farmer: string;
  quantity: number;
  harvestDate: string;
  status: string;
}

const AdminDashboard: React.FC = () => {
  const { logout, user } = useAuth();
  const [batches, setBatches] = useState<Batch[]>([
    { id: 'BATCH001', species: 'Ashwagandha', farmer: 'Ramesh', quantity: 50, harvestDate: '2024-01-15', status: 'Pending' },
    { id: 'BATCH002', species: 'Tulsi', farmer: 'Sita', quantity: 30, harvestDate: '2024-01-14', status: 'Collected' },
    { id: 'BATCH003', species: 'Neem', farmer: 'Mahesh', quantity: 20, harvestDate: '2024-01-13', status: 'Assigned to Lab' },
  ]);

  const [users, setUsers] = useState([
    { id: 1, name: 'Ramesh', role: 'Farmer' },
    { id: 2, name: 'Sita', role: 'Lab' },
    { id: 3, name: 'Mahesh', role: 'Manufacturer' },
  ]);

  const handleDeleteUser = (id: number) => setUsers(prev => prev.filter(u => u.id !== id));

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <header className="bg-green-600 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <ArrowLeft className="w-5 h-5 cursor-pointer hover:text-green-200" onClick={() => window.history.back()} />
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Users Management */}
        <section className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">User Management</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border border-gray-200 rounded-lg">
              <thead className="bg-green-100">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Role</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-t border-gray-200 hover:bg-green-50 transition">
                    <td className="px-4 py-2">{u.name}</td>
                    <td className="px-4 py-2">{u.role}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="px-3 py-1 text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Batch Overview */}
        <section className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Batch Overview</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border border-gray-200 rounded-lg">
              <thead className="bg-green-100">
                <tr>
                  <th className="px-4 py-2">Batch ID</th>
                  <th className="px-4 py-2">Species</th>
                  <th className="px-4 py-2">Farmer</th>
                  <th className="px-4 py-2">Quantity</th>
                  <th className="px-4 py-2">Harvest Date</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {batches.map(batch => (
                  <tr key={batch.id} className="border-t border-gray-200 hover:bg-green-50 transition">
                    <td className="px-4 py-2">{batch.id}</td>
                    <td className="px-4 py-2">{batch.species}</td>
                    <td className="px-4 py-2">{batch.farmer}</td>
                    <td className="px-4 py-2">{batch.quantity}</td>
                    <td className="px-4 py-2">{batch.harvestDate}</td>
                    <td className="px-4 py-2">{batch.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recall Simulation */}
        <section className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col md:flex-row md:justify-between items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-900">Recall Simulation</h2>
          <button className="px-6 py-3 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition">
            Simulate Recall
          </button>
        </section>

        {/* Compliance Reports */}
        <section className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col md:flex-row md:justify-between items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-900">Compliance Reports</h2>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
            Export Reports
          </button>
        </section>

        {/* Alerts / Notifications */}
        <section className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Alerts / Notifications</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Out-of-season harvest detected</li>
            <li>Failed lab test for batch BATCH002</li>
            <li>Low sustainability score for batch BATCH003</li>
          </ul>
        </section>

      </main>
    </div>
  );
};

export default AdminDashboard;
