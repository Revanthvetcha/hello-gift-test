import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  LayoutDashboard, 
  Store, 
  Receipt, 
  Users, 
  CreditCard,
  TrendingUp, 
  Package,
  BarChart3,
  LogOut,
  Settings,
  Bell
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { User } from "@/entities/User";

interface NavigationItem {
  title: string;
  url: string;
  icon: React.ElementType;
  color: string;
}

const navigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
    color: "text-blue-600"
  },
  {
    title: "Stores",
    url: createPageUrl("Stores"),
    icon: Store,
    color: "text-purple-600"
  },
  {
    title: "Sales",
    url: createPageUrl("Sales"),
    icon: Receipt,
    color: "text-green-600"
  },
  {
    title: "Payroll",
    url: createPageUrl("Payroll"),
    icon: CreditCard,
    color: "text-orange-600"
  },
  {
    title: "Expenses",
    url: createPageUrl("Expenses"),
    icon: TrendingUp,
    color: "text-red-600"
  },
  {
    title: "Inventory",
    url: createPageUrl("Inventory"),
    icon: Package,
    color: "text-indigo-600"
  },
  {
    title: "Reports",
    url: createPageUrl("Reports"),
    icon: BarChart3,
    color: "text-amber-600"
  }
];

interface LayoutProps {
  children: React.ReactNode;
  currentPageName?: string;
}

export default function Layout({ children, currentPageName }: LayoutProps) {
  const location = useLocation();
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await User.me();
        setUser(userData);
      } catch (error) {
        console.error("Error loading user:", error);
      }
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    await User.logout();
  };

  return (
    <SidebarProvider>
      <style>
        {`
          :root {
            --gradient-primary: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
            --gradient-secondary: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
            --shadow-elegant: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            --shadow-luxury: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          }
          
          .gradient-bg {
            background: var(--gradient-primary);
          }
          
          .glass-effect {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          
          .hover-lift {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          
          .hover-lift:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-luxury);
          }
        `}
      </style>
      
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Sidebar className="border-r border-blue-100/50 glass-effect">
          <SidebarHeader className="border-b border-blue-100/50 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shadow-lg">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-xl bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">
                  BizManager
                </h2>
                <p className="text-sm text-slate-500 font-medium">Pro Business Suite</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-3">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover-lift rounded-xl transition-all duration-300 ${
                          location.pathname === item.url 
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                            : 'hover:bg-white/70 hover:shadow-md'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-4 px-4 py-3">
                          <item.icon className={`w-5 h-5 ${
                            location.pathname === item.url ? 'text-white' : item.color
                          }`} />
                          <span className="font-semibold">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-3">
                Quick Actions
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-3 py-2 space-y-3">
                  <Link to={createPageUrl("Sales")} className="block">
                    <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white hover-lift">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium opacity-90">New Sale</p>
                          <p className="text-xs opacity-75">Create bill</p>
                        </div>
                        <Receipt className="w-5 h-5" />
                      </div>
                    </div>
                  </Link>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-blue-100/50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.full_name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm truncate">
                    {user?.full_name || 'User'}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{user?.role || 'Admin'}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-slate-500 hover:text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/70 backdrop-blur-sm border-b border-slate-200/50 px-6 py-4 md:hidden">
            <div className="flex items-center justify-between">
              <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-lg transition-colors duration-200" />
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm">
                  <Bell className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}