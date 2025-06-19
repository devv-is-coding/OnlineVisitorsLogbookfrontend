'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Users, UserPlus, Settings, LogOut, BookOpen, Shield } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';

interface NavigationProps {
  isAdmin?: boolean;
}

export function Navigation({ isAdmin = false }: NavigationProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    const result = await apiClient.logout();
    if (result.success) {
      toast.success('Logged out successfully');
      router.push('/');
    } else {
      toast.error('Error logging out');
    }
  };

  const navItems = [
    { href: '/', label: 'View Visitors', icon: Users },
    { href: '/add-visitor', label: 'Add Visitor', icon: UserPlus },
  ];

  const adminItems = [
    { href: '/admin', label: 'Admin Panel', icon: Shield },
  ];

  return (
    <Card className="p-4 mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Visitor Logbook</h1>
            <p className="text-xs text-gray-500">Digital Sign-in System</p>
          </div>
        </div>
        
        <nav className="flex items-center gap-2 flex-wrap">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Button
                key={item.href}
                asChild
                variant={isActive ? 'default' : 'ghost'}
                size="sm"
                className={`gap-2 transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md' 
                    : 'hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                <Link href={item.href}>
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </Button>
            );
          })}
          
          {isAdmin ? (
            <>
              {adminItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Button
                    key={item.href}
                    asChild
                    variant={isActive ? 'default' : 'ghost'}
                    size="sm"
                    className={`gap-2 transition-all duration-200 ${
                      isActive 
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md' 
                        : 'hover:bg-purple-50 hover:text-purple-700'
                    }`}
                  >
                    <Link href={item.href}>
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </Button>
                );
              })}
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="gap-2 hover:bg-purple-50 hover:text-purple-700 border-purple-200 transition-all duration-200"
            >
              <Link href="/admin/login">
                <Settings className="h-4 w-4" />
                Admin
              </Link>
            </Button>
          )}
        </nav>
      </div>
    </Card>
  );
}