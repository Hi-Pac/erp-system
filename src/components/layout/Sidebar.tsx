import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Warehouse, 
  ShoppingCart, 
  TruckDelivery,
  CreditCard,
  BarChart,
  Settings,
  LogOut,
  ChevronRight,
  ChevronDown,
  Factory
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isMobileOpen: boolean;
  toggleMobileSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isMobileOpen, 
  toggleMobileSidebar 
}) => {
  const { userProfile, signOut } = useAuth();
  const [openSubmenu, setOpenSubmenu] = React.useState<string | null>(null);

  const toggleSubmenu = (key: string) => {
    setOpenSubmenu(openSubmenu === key ? null : key);
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) => `
    flex items-center text-sm px-4 py-2.5 rounded-md transition-colors
    ${isActive 
      ? 'bg-primary-100 text-primary-800' 
      : 'text-gray-700 hover:bg-gray-100'
    }
  `;

  const submenuLinkClasses = ({ isActive }: { isActive: boolean }) => `
    flex items-center text-sm pl-12 pr-4 py-2 rounded-md transition-colors
    ${isActive 
      ? 'bg-primary-50 text-primary-800' 
      : 'text-gray-600 hover:bg-gray-50'
    }
  `;

  return (
    <>
      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleMobileSidebar}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed top-0 right-0 h-full w-64 bg-white border-l border-gray-200 
        transition-transform duration-300 ease-in-out z-30
        transform lg:translate-x-0
        ${isMobileOpen ? 'translate-x-0' : 'translate-x-full'}
        lg:sticky
      `}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b border-gray-200">
            <h1 className="text-xl font-bold text-primary-600">HCP ERP</h1>
          </div>
          
          {/* Nav Links */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            <div className="space-y-1">
              <NavLink to="/dashboard" className={navLinkClasses} end>
                <LayoutDashboard className="w-5 h-5 ml-2" />
                لوحة التحكم
              </NavLink>
              
              <NavLink to="/customers" className={navLinkClasses}>
                <Users className="w-5 h-5 ml-2" />
                العملاء
              </NavLink>
              
              <NavLink to="/suppliers" className={navLinkClasses}>
                <Factory className="w-5 h-5 ml-2" />
                الموردين
              </NavLink>
              
              <NavLink to="/products" className={navLinkClasses}>
                <Warehouse className="w-5 h-5 ml-2" />
                المنتجات
              </NavLink>
              
              {/* Sales submenu */}
              <div>
                <button 
                  className={`w-full flex items-center justify-between text-sm px-4 py-2.5 rounded-md 
                    ${openSubmenu === 'sales' 
                      ? 'bg-gray-100 text-gray-900' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  onClick={() => toggleSubmenu('sales')}
                >
                  <div className="flex items-center">
                    <ShoppingCart className="w-5 h-5 ml-2" />
                    المبيعات
                  </div>
                  {openSubmenu === 'sales' ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                
                {openSubmenu === 'sales' && (
                  <div className="mt-1 space-y-1">
                    <NavLink to="/orders" className={submenuLinkClasses}>
                      كل الطلبات
                    </NavLink>
                    <NavLink to="/orders/create" className={submenuLinkClasses}>
                      طلب جديد
                    </NavLink>
                  </div>
                )}
              </div>
              
              <NavLink to="/payments" className={navLinkClasses}>
                <CreditCard className="w-5 h-5 ml-2" />
                الحسابات
              </NavLink>
              
              <NavLink to="/reports" className={navLinkClasses}>
                <BarChart className="w-5 h-5 ml-2" />
                التقارير
              </NavLink>
              
              {userProfile?.role === 'admin' && (
                <NavLink to="/users" className={navLinkClasses}>
                  <Settings className="w-5 h-5 ml-2" />
                  المستخدمين
                </NavLink>
              )}
            </div>
          </nav>
          
          {/* User Profile and Logout */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-800 font-semibold">
                  {userProfile?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{userProfile?.name}</p>
                <p className="text-xs text-gray-500">
                  {userProfile?.role === 'admin' ? 'مدير النظام' : 
                   userProfile?.role === 'manager' ? 'مشرف' : 'مستخدم'}
                </p>
              </div>
            </div>
            
            <button 
              onClick={signOut}
              className="w-full flex items-center text-sm px-4 py-2 text-red-600 
                rounded-md hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5 ml-2" />
              تسجيل الخروج
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
