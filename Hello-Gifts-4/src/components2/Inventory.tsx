import  { useState } from 'react';
import { Plus, Edit2, X, ChevronDown, Package2 } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  code: string;
  category: string;
  price: number;
  stock: number;
  minStockLevel: number;
  store?: string;
}

function App() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Samsung Galaxy',
      code: 'SAM-S24',
      category: 'Smartphones',
      price: 75000,
      stock: 15,
      minStockLevel: 5
    },
    {
      id: '2',
      name: 'Apple iPhone 15',
      code: 'APL-IP15',
      category: 'Smartphones',
      price: 95000,
      stock: 8,
      minStockLevel: 5
    },
    {
      id: '3',
      name: 'Dell Laptop XPS 13',
      code: 'DEL-XPS13',
      category: 'Laptops',
      price: 125000,
      stock: 10,
      minStockLevel: 3
    },
    {
  id: '4',
  name: 'Redmi Note 13',
  code: 'RDM-NT13',
  category: 'Smartphones',
  price: 18000,
  stock: 25,
  minStockLevel: 5
}

  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    code: '',
    category: '',
    price: 0,
    stock: 0,
    minStockLevel: 10,
    store: ''
  });

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      code: product.code,
      category: product.category,
      price: product.price,
      stock: product.stock,
      minStockLevel: product.minStockLevel,
      store: product.store || ''
    });
    setIsModalOpen(true);
  };

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.code && newProduct.category) {
      if (editingProduct) {
        // Update existing product
        setProducts(products.map(p => 
          p.id === editingProduct.id 
            ? { ...editingProduct, ...newProduct }
            : p
        ));
      } else {
        // Add new product
        const product: Product = {
          id: Date.now().toString(),
          ...newProduct
        };
        setProducts([...products, product]);
      }
      setNewProduct({
        name: '',
        code: '',
        category: '',
        price: 0,
        stock: 0,
        minStockLevel: 10,
        store: ''
      });
      setEditingProduct(null);
      setIsModalOpen(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setNewProduct({
      name: '',
      code: '',
      category: '',
      price: 0,
      stock: 0,
      minStockLevel: 10,
      store: ''
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#EFF6FF', width: '100%', }}>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Inventory Management</h1>
            <p className="text-lg text-gray-600">Track products and stock levels across all stores</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors"
          >
            <Plus size={20} />
            Add New Product
          </button>
        </div>

        {/* Product Cards */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product) => (
                <div 
                  key={product.id}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 cursor-pointer"
                  style={{ width: 'calc(100%)' }}
                >
              <div className="flex justify-between items-start mb-4 gap-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-gray-500 text-sm mb-2">{product.code}</p>
                  <div className="flex items-center gap-2 text-gray-400 mb-4">
                    <Package2 size={16} />
                    <span className="text-sm">N/A</span>
                  </div>
                  <div className="inline-block bg-gray-100 hover:bg-indigo-100 hover:text-indigo-700 text-gray-700 px-3 py-1 rounded-full text-sm font-medium transition-colors cursor-pointer">
                    {product.category}
                  </div>
                </div>
               <button
                onClick={() => handleEditProduct(product)}
                className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-indigo-100 hover:text-indigo-600 transition-colors"
              >
                <Edit2 size={16} />
              </button>

              </div>
              
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Price</p>
                  <p className="text-xl font-bold text-gray-900">₹{product.price.toLocaleString()}</p>
                </div>
              <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">Stock</p>
                  <p className="text-sm font-medium text-green-600">
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      {product.stock} piece
                    </span>
                  </p>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* Store */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store
                  </label>
                  <div className="relative">
                    <select
                      value={newProduct.store}
                      onChange={(e) => setNewProduct({ ...newProduct, store: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none bg-white"
                    >
                      <option value="">Select a store</option>
                      <option value="downtown-electronics">Downtown Electronics</option>
                      <option value="tech-hub-gurgaon">Tech Hub Gurgaon</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                </div>

                {/* Product Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Code (SKU)
                  </label>
                  <input
                    type="text"
                    value={newProduct.code}
                    onChange={(e) => setNewProduct({ ...newProduct, code: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Price and Stock Row */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit Price (₹)
                  </label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-small text-gray-700 mb-2">
                    Min. Stock Level
                  </label>
                  <input
                    type="number"
                    value={newProduct.minStockLevel}
                    onChange={(e) => setNewProduct({ ...newProduct, minStockLevel: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-3 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddProduct}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors"
                >
                  <Package2 size={20} />
                  {editingProduct ? 'Update Product' : 'Save Product'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;