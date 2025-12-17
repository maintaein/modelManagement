import { render, screen, fireEvent } from '@testing-library/react';
import { AdminSidebar, type SidebarMenuItem } from '@/components/organisms/AdminSidebar';

// usePathname 모킹
const mockUsePathname = jest.fn(() => '/admin/dashboard');
jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}));

// Next.js Link 모킹
jest.mock('next/link', () => {
  const MockLink = ({ children, href, className, 'aria-current': ariaCurrent }: { children: React.ReactNode; href: string; className?: string; 'aria-current'?: 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false' | boolean }) => {
    return <a href={href} className={className} aria-current={ariaCurrent}>{children}</a>;
  };
  MockLink.displayName = 'MockLink';
  return MockLink;
});

describe('AdminSidebar 컴포넌트', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/admin/dashboard');
  });

  it('기본 메뉴 항목들이 렌더링된다', () => {
    render(<AdminSidebar />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Models')).toBeInTheDocument();
    expect(screen.getByText('Archives')).toBeInTheDocument();
    expect(screen.getByText('Applications')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('브랜드 로고가 렌더링된다', () => {
    render(<AdminSidebar />);
    expect(screen.getByText('PLATINUM')).toBeInTheDocument();
  });

  it('토글 버튼이 렌더링된다', () => {
    render(<AdminSidebar />);
    const toggleButton = screen.getByLabelText('Collapse sidebar');
    expect(toggleButton).toBeInTheDocument();
  });

  it('토글 버튼 클릭 시 사이드바가 축소된다', () => {
    render(<AdminSidebar />);
    const toggleButton = screen.getByLabelText('Collapse sidebar');

    // 초기 상태: 확장됨
    expect(screen.getByText('PLATINUM')).toBeInTheDocument();

    // 토글: 축소
    fireEvent.click(toggleButton);

    // 축소된 상태: 브랜드명 숨김
    expect(screen.queryByText('PLATINUM')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Expand sidebar')).toBeInTheDocument();
  });

  it('축소된 사이드바를 다시 토글하면 확장된다', () => {
    render(<AdminSidebar />);
    const toggleButton = screen.getByLabelText('Collapse sidebar');

    // 축소
    fireEvent.click(toggleButton);
    expect(screen.queryByText('PLATINUM')).not.toBeInTheDocument();

    // 확장
    const expandButton = screen.getByLabelText('Expand sidebar');
    fireEvent.click(expandButton);
    expect(screen.getByText('PLATINUM')).toBeInTheDocument();
  });

  it('커스텀 메뉴 항목들이 렌더링된다', () => {
    const customMenuItems: SidebarMenuItem[] = [
      { label: 'Custom 1', href: '/admin/custom1' },
      { label: 'Custom 2', href: '/admin/custom2', icon: <span>🎨</span> },
    ];

    render(<AdminSidebar menuItems={customMenuItems} />);
    expect(screen.getByText('Custom 1')).toBeInTheDocument();
    expect(screen.getByText('Custom 2')).toBeInTheDocument();
    expect(screen.getByText('🎨')).toBeInTheDocument();
  });

  it('현재 경로와 일치하는 메뉴 항목에 active 스타일이 적용된다', () => {
    // 기본 pathname이 '/admin/dashboard'이므로 Dashboard 링크가 active
    render(<AdminSidebar />);
    const dashboardLink = screen.getByText('Dashboard').closest('a');
    expect(dashboardLink).toHaveClass('bg-blue-600');
  });

  it('메뉴 항목들이 올바른 href를 가진다', () => {
    render(<AdminSidebar />);
    const dashboardLink = screen.getByText('Dashboard').closest('a');
    const modelsLink = screen.getByText('Models').closest('a');

    expect(dashboardLink).toHaveAttribute('href', '/admin/dashboard');
    expect(modelsLink).toHaveAttribute('href', '/admin/models');
  });

  it('커스텀 className이 적용된다', () => {
    const { container } = render(<AdminSidebar className="custom-class" />);
    const aside = container.querySelector('aside');
    expect(aside).toHaveClass('custom-class');
  });
});
