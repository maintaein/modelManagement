import { render, screen, fireEvent } from '@testing-library/react';
import { AdminHeader } from '@/components/organisms/AdminHeader';

describe('AdminHeader 컴포넌트', () => {
  it('기본 타이틀이 렌더링된다', () => {
    render(<AdminHeader />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('커스텀 타이틀이 렌더링된다', () => {
    render(<AdminHeader title="Models Management" />);
    expect(screen.getByText('Models Management')).toBeInTheDocument();
  });

  it('사용자 이름이 표시된다', () => {
    render(<AdminHeader userName="John Doe" />);
    expect(screen.getByText('Welcome,')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('사용자 이름이 없으면 표시되지 않는다', () => {
    render(<AdminHeader />);
    expect(screen.queryByText('Welcome,')).not.toBeInTheDocument();
  });

  it('로그아웃 버튼이 렌더링된다', () => {
    const handleLogout = jest.fn();
    render(<AdminHeader onLogout={handleLogout} />);
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('로그아웃 버튼 클릭 시 onLogout이 호출된다', () => {
    const handleLogout = jest.fn();
    render(<AdminHeader onLogout={handleLogout} />);

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    expect(handleLogout).toHaveBeenCalledTimes(1);
  });

  it('onLogout이 없으면 로그아웃 버튼이 표시되지 않는다', () => {
    render(<AdminHeader />);
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });

  it('모든 props가 함께 작동한다', () => {
    const handleLogout = jest.fn();
    render(<AdminHeader title="Settings" userName="Jane Smith" onLogout={handleLogout} />);

    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('커스텀 className이 적용된다', () => {
    const { container } = render(<AdminHeader className="custom-class" />);
    const header = container.querySelector('header');
    expect(header).toHaveClass('custom-class');
  });

  it('header 요소에 role="banner"가 있다', () => {
    const { container } = render(<AdminHeader />);
    const header = container.querySelector('header');
    expect(header).toHaveAttribute('role', 'banner');
  });
});
