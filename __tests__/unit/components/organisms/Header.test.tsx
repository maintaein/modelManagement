import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '@/components/organisms/Header';

describe('Header 컴포넌트', () => {
  it('로고가 렌더링된다', () => {
    render(<Header />);
    expect(screen.getByText('PLATINUM')).toBeInTheDocument();
  });

  it('모든 네비게이션 항목이 렌더링된다', () => {
    render(<Header />);
    expect(screen.getAllByText('ABOUT').length).toBeGreaterThan(0);
    expect(screen.getAllByText('MODELS').length).toBeGreaterThan(0);
    expect(screen.getAllByText('ARCHIVES').length).toBeGreaterThan(0);
    expect(screen.getAllByText('CONTACT').length).toBeGreaterThan(0);
  });

  it('로고 링크가 올바른 href를 가진다', () => {
    render(<Header />);
    const logoLink = screen.getByText('PLATINUM').closest('a');
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('네비게이션 링크가 올바른 href를 가진다', () => {
    render(<Header />);
    const links = screen.getAllByRole('link');

    // 로고 링크 제외하고 네비게이션 링크만 확인
    const aboutLinks = links.filter(link => link.getAttribute('href') === '/about');
    const modelsLinks = links.filter(link => link.getAttribute('href') === '/models');
    const archivesLinks = links.filter(link => link.getAttribute('href') === '/archives');
    const contactLinks = links.filter(link => link.getAttribute('href') === '/contact');

    expect(aboutLinks.length).toBeGreaterThan(0);
    expect(modelsLinks.length).toBeGreaterThan(0);
    expect(archivesLinks.length).toBeGreaterThan(0);
    expect(contactLinks.length).toBeGreaterThan(0);
  });

  it('모바일 메뉴 버튼이 렌더링된다', () => {
    render(<Header />);
    const menuButton = screen.getByLabelText('Toggle menu');
    expect(menuButton).toBeInTheDocument();
  });

  it('모바일 메뉴 버튼 클릭 시 메뉴가 열린다', () => {
    render(<Header />);
    const menuButton = screen.getByLabelText('Toggle menu');

    // 초기에는 aria-expanded가 false
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');

    // 클릭 후 aria-expanded가 true
    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('모바일 메뉴 버튼 재클릭 시 메뉴가 닫힌다', () => {
    render(<Header />);
    const menuButton = screen.getByLabelText('Toggle menu');

    // 메뉴 열기
    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-expanded', 'true');

    // 메뉴 닫기
    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('스크롤 시 스타일이 변경된다', () => {
    const { container } = render(<Header />);
    const header = container.querySelector('header');

    // 초기 상태: bg-transparent
    expect(header).toHaveClass('bg-transparent');
    expect(header).not.toHaveClass('bg-white/90');

    // 스크롤 이벤트 시뮬레이션 (scrollY > 50)
    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
    fireEvent.scroll(window);

    // 스크롤 후: bg-white/90 backdrop-blur-md shadow-sm
    expect(header).toHaveClass('bg-white/90');
    expect(header).toHaveClass('backdrop-blur-md');
    expect(header).toHaveClass('shadow-sm');
  });
});
