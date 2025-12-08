'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface SidebarMenuItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export interface AdminSidebarProps {
  menuItems?: SidebarMenuItem[];
  className?: string;
}

const DEFAULT_MENU_ITEMS: SidebarMenuItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Models', href: '/admin/models' },
  { label: 'Archives', href: '/admin/archives' },
  { label: 'Applications', href: '/admin/applications' },
  { label: 'Settings', href: '/admin/settings' },
];

export function AdminSidebar({ menuItems = DEFAULT_MENU_ITEMS, className = '' }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <aside
      className={`bg-gray-900 text-white transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      } ${className}`}
      aria-label="Admin sidebar navigation"
    >
      {/* 헤더 */}
      <div className="p-4 flex items-center justify-between border-b border-gray-700">
        {!isCollapsed && <h2 className="text-xl font-bold">PLATINUM</h2>}
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-800 rounded transition-colors"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg
            className={`w-5 h-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* 메뉴 */}
      <nav className="py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                    isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
