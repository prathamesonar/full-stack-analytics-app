

'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, FileText, Users, Settings, MessageSquare, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Invoice', href: '/invoice', icon: FileText },
  { name: 'Other files', href: '/other-files', icon: FileText },
  { name: 'Departments', href: '/departments', icon: Building2 },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Chat with Data', href: '/chat', icon: MessageSquare },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="h-full flex flex-col bg-white text-gray-900 border-r border-gray-200">
      {/* Header/Logo Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center font-bold text-sm">
            L
          </div>
          <span className="font-bold text-sm">Buchhaltung</span>
        </div>
        <p className="text-xs text-gray-500">12 members</p>
      </div>

      {/* General Navigation */}
      <div className="flex-1 flex flex-col p-4 space-y-0">
        <h3 className="text-xs font-semibold uppercase text-gray-500 mb-3 px-2">General</h3>
        {navItems.slice(0, 6).map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-sm',
              pathname === item.href
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            )}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </div>

      {/* AI Section (Chat with Data) */}
      <div className="flex flex-col p-4 space-y-1 border-t border-gray-200">
        {navItems.slice(6).map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-sm',
              pathname === item.href
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            )}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </div>

      {/* Footer/Flowbit AI Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg font-bold">F</span>
          </div>
          <span className="font-bold text-base text-gray-900">Flowbit AI</span>
        </div>
      </div>
    </div>
  );
}