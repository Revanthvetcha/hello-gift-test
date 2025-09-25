import React, { useState } from 'react';
import { Plus, MapPin, Phone, Edit3, X, Save } from 'lucide-react';
// import StoreIcon from './components2/StoreIcon';
import StoreIcon from './StoreIcon';

interface Store {
  id: string;
  name: string;
  address: string;
  contact: string;
  gstin: string;
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingStoreId, setEditingStoreId] = useState<string | null>(null);
  const [stores, setStores] = useState<Store[]>([
    {
      id: '1',
      name: 'Downtown Electronics',
      address: '123 Main Street, New Delhi, 110001',
      contact: '+91-98765-43210',
      gstin: '07AABCU9603R1ZX'
    },
    {
      id: '2',
      name: 'Tech Hub Gurgaon',
      address: '456 Cyber City, Gurgaon, Haryana, 122002',
      contact: '+91-98765-43211',
      gstin: '06AABCU9603R1ZY'
    }
  ]);

  const [formData, setFormData] = useState({
    storeName: '',
    address: '',
    contactNumber: '',
    gstin: '',
    logoUrl: ''
  });

  const openAddModal = () => {
    setIsEditMode(false);
    setEditingStoreId(null);
    setFormData({
      storeName: '',
      address: '',
      contactNumber: '',
      gstin: '',
      logoUrl: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (store: Store) => {
    setIsEditMode(true);
    setEditingStoreId(store.id);
    setFormData({
      storeName: store.name,
      address: store.address,
      contactNumber: store.contact,
      gstin: store.gstin,
      logoUrl: ''
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditMode && editingStoreId) {
      // Update existing store
      setStores(stores.map(store => 
        store.id === editingStoreId 
          ? {
              ...store,
              name: formData.storeName,
              address: formData.address,
              contact: formData.contactNumber,
              gstin: formData.gstin
            }
          : store
      ));
    } else {
      // Add new store
      const newStore: Store = {
        id: Date.now().toString(),
        name: formData.storeName,
        address: formData.address,
        contact: formData.contactNumber,
        gstin: formData.gstin
      };
      setStores([...stores, newStore]);
    }
    
    setIsModalOpen(false);
    setFormData({
      storeName: '',
      address: '',
      contactNumber: '',
      gstin: '',
      logoUrl: ''
    });
    setIsEditMode(false);
    setEditingStoreId(null);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#EFF6FF' }}>
      <div className="container mx-auto px-8 py-8">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Stores</h1>
            <p className="text-gray-600 text-lg">Add, edit, and view your business locations</p>
          </div>
          <button
            onClick={openAddModal}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-medium shadow-lg transition-all duration-200 hover:shadow-xl"
          >
            <Plus size={20} />
            Add New Store
          </button>
        </div>

        {/* Store Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 max-w-5xl">
          {stores.map((store) => (
                    <div 
                    key={store.id} 
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100 relative max-w-md" 
                    style={{ width: '300px' }}
                    >              {/* Edit Icon */}
              <button 
                onClick={() => openEditModal(store)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Edit3 size={18} />
              </button>

              {/* Store Icon and Name */}
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-purple-600 p-4 rounded-2xl">
                  <StoreIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{store.name}</h3>
                </div>
              </div>

              {/* Store Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                  <span>{store.address}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone size={16} className="text-gray-400 flex-shrink-0" />
                  <span>{store.contact}</span>
                </div>
              </div>

              {/* Separator */}
              <hr className="border-gray-200 mb-4" />

              {/* GSTIN */}
              <div className="text-sm">
                <span className="text-gray-500 uppercase tracking-wide">GSTIN</span>
                <div className="font-bold text-gray-900 mt-1">{store.gstin}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Store Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-5 w-full max-w-xl shadow-2xl">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {isEditMode ? 'Edit Store' : 'Add New Store'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Store Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Store Name
                  </label>
                  <input
                    type="text"
                    name="storeName"
                    value={formData.storeName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                    required
                  />
                </div>

                {/* Contact Number and GSTIN */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      GSTIN
                    </label>
                    <input
                      type="text"
                      name="gstin"
                      value={formData.gstin}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                {/* Logo URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Logo URL
                  </label>
                  <input
                    type="url"
                    name="logoUrl"
                    value={formData.logoUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/logo.png"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                  />
                </div>

                {/* Form Buttons */}
                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-200 font-medium flex items-center gap-2"
                  >
                    <Save size={18} />
                    {isEditMode ? 'Update Store' : 'Save Store'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;