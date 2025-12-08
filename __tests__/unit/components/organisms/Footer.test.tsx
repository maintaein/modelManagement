import { render, screen } from '@testing-library/react';
import { Footer } from '@/components/organisms/Footer';

describe('Footer 컴포넌트', () => {
  it('기본 회사명이 렌더링된다', () => {
    render(<Footer />);
    expect(screen.getAllByText(/PLATINUM MANAGEMENT/i).length).toBeGreaterThan(0);
  });

  it('커스텀 회사명이 렌더링된다', () => {
    render(<Footer companyName="CUSTOM COMPANY" />);
    expect(screen.getAllByText('CUSTOM COMPANY').length).toBeGreaterThan(0);
  });

  it('연락처 정보가 렌더링된다', () => {
    render(<Footer email="test@example.com" phone="+82-10-1234-5678" />);
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('+82-10-1234-5678')).toBeInTheDocument();
  });

  it('주소가 렌더링된다', () => {
    render(<Footer address="Seoul, Korea" />);
    expect(screen.getByText('Seoul, Korea')).toBeInTheDocument();
  });

  it('현재 연도가 저작권에 표시된다', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${currentYear}`, 'i'))).toBeInTheDocument();
  });

  it('이메일 링크가 올바른 href를 가진다', () => {
    render(<Footer email="test@example.com" />);
    const emailLink = screen.getByText('test@example.com').closest('a');
    expect(emailLink).toHaveAttribute('href', 'mailto:test@example.com');
  });

  it('전화번호 링크가 올바른 href를 가진다', () => {
    render(<Footer phone="+82-10-1234-5678" />);
    const phoneLink = screen.getByText('+82-10-1234-5678').closest('a');
    expect(phoneLink).toHaveAttribute('href', 'tel:+821012345678');
  });

  it('네비게이션 링크들이 렌더링된다', () => {
    render(<Footer />);
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Models')).toBeInTheDocument();
    expect(screen.getByText('Archives')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('네비게이션 링크가 올바른 href를 가진다', () => {
    render(<Footer />);
    const aboutLink = screen.getByText('About').closest('a');
    const modelsLink = screen.getByText('Models').closest('a');

    expect(aboutLink).toHaveAttribute('href', '/about');
    expect(modelsLink).toHaveAttribute('href', '/models');
  });
});
