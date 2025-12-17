'use client';

import { Button } from '@/components/ui/button';

export interface AdminHeaderProps {
  title?: string;
  userName?: string;
  onLogout?: () => void;
  className?: string;
}

export function AdminHeader({ title = 'Dashboard', userName, onLogout, className = '' }: AdminHeaderProps) {
  return (
    <header
      className={`bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between ${className}`}
      role="banner"
    >
      {/* 페이지 타이틀 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      </div>

      {/* 사용자 정보 & 로그아웃 */}
      <div className="flex items-center gap-4">
        {userName && (
          <div className="text-sm">
            <span className="text-gray-600">Welcome, </span>
            <span className="font-semibold text-gray-900">{userName}</span>
          </div>
        )}
        {onLogout && (
          <Button variant="outline" size="sm" onClick={onLogout}>
            Logout
          </Button>
        )}
      </div>
    </header>
  );
}
