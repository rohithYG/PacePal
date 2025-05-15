import { Link, useLocation } from 'wouter';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Calendar, 
  Clock, 
  CheckSquare, 
  BarChart2, 
  MessageCircle, 
  Settings, 
  LogOut,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const [location] = useLocation();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  const navItems = [
    { href: '/', label: 'Dashboard', icon: <LayoutDashboard className="mr-3 h-5 w-5" /> },
    { href: '/calendar', label: 'Calendar', icon: <Calendar className="mr-3 h-5 w-5" /> },
    { href: '/routines', label: 'Routines', icon: <Clock className="mr-3 h-5 w-5" /> },
    { href: '/habits', label: 'Habits', icon: <CheckSquare className="mr-3 h-5 w-5" /> },
    { href: '/analytics', label: 'Analytics', icon: <BarChart2 className="mr-3 h-5 w-5" /> },
    { href: '/notifications', label: 'Notifications', icon: <MessageCircle className="mr-3 h-5 w-5" /> },
  ];

  return (
    <aside className="flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 flex-col z-10 md:flex hidden">
      <div className="p-6 flex justify-between items-center">
        <Link href="/">
          <h1 className="text-2xl font-bold text-primary">PacePal</h1>
        </Link>
        
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <a
              className={`flex items-center px-4 py-3 rounded-lg font-medium transition ${
                location === item.href
                  ? 'text-primary bg-primary-foreground'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </a>
          </Link>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <Link href="/settings">
          <a
            className={`flex items-center px-4 py-3 rounded-lg font-medium transition ${
              location === '/settings'
                ? 'text-primary bg-primary-foreground'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Settings className="mr-3 h-5 w-5" />
            <span>Settings</span>
          </a>
        </Link>
        
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition w-full"
        >
          <LogOut className="mr-3 h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
