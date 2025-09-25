import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Store, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Package, 
  BarChart3,
  Receipt,
  ChevronRight,
} from 'lucide-react';

interface NavigationItem {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  path: string;
}

const navigationItems: NavigationItem[] = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, color: 'text-blue-500', path: '/dashboard' },
  { id: 'stores', name: 'Stores', icon: Store, color: 'text-purple-500', path: '/stores' },
  { id: 'sales', name: 'Sales', icon: DollarSign, color: 'text-green-500', path: '/sales' },
  { id: 'payroll', name: 'Payroll', icon: Users, color: 'text-orange-500', path: '/payroll' },
  { id: 'expenses', name: 'Expenses', icon: TrendingUp, color: 'text-red-500', path: '/expenses' },
  { id: 'inventory', name: 'Inventory', icon: Package, color: 'text-blue-600', path: '/inventory' },
  { id: 'reports', name: 'Reports', icon: BarChart3, color: 'text-orange-400', path: '/reports' },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleItemClick = (itemId: string) => {
    const item = navigationItems.find(nav => nav.id === itemId);
    if (item) {
      navigate(item.path);
    }
  };

  const getActiveItem = () => {
    const currentPath = location.pathname;
    const activeNav = navigationItems.find(nav => nav.path === currentPath);
    return activeNav?.id || 'dashboard';
  };

  return (
    <div 
      className="h-screen bg-gray-50 border-r border-gray-200 flex flex-col relative overflow-hidden"
      style={{ width: '265px' }}
    >
      {/* Fixed Header */}
      <div className="p-6 pb-4 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">BizManager</h1>
            <p className="text-sm text-gray-500">Pro Business Suite</p>
          </div>
        </div>
      </div>

      {/* Scrollable Navigation Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 px-3">
            Menu
          </h2>
          
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = getActiveItem() === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200
                    ${isActive 
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                      : 'text-gray-700 hover:bg-white hover:shadow-md hover:shadow-gray-200/50'
                    }
                  `}
                >
                  <Icon 
                    className={`w-5 h-5 ${isActive ? 'text-white' : item.color}`} 
                  />
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
        
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 px-3 hover:text-blue-600 cursor-pointer">
            Quick Actions - Sale
          </h2>
       

          
          <button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl p-4 flex items-center justify-between transition-all duration-200 hover:shadow-lg hover:shadow-green-500/25">
            <div>
               <a href="/sales">
              <div className="font-semibold">New Sale</div>
              <div className="text-sm text-green-100">Create bill</div>
              </a>
            </div>
            <Receipt className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Fixed User Profile */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white hover:shadow-md hover:shadow-gray-200/50 transition-all duration-200 cursor-pointer">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">G</span>
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900">John Doe</div>
            <div className="text-sm text-gray-500">user</div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
}