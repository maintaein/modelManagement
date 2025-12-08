import { render, screen } from '@testing-library/react';
import { ContactLanding, type ContactCard } from '@/components/organisms/ContactLanding';

describe('ContactLanding 컴포넌트', () => {
  it('제목과 설명이 렌더링된다', () => {
    render(<ContactLanding />);
    expect(screen.getByText('GET IN TOUCH')).toBeInTheDocument();
    expect(screen.getByText(/Whether you want to join us/i)).toBeInTheDocument();
  });

  it('기본 카드들이 렌더링된다', () => {
    render(<ContactLanding />);
    expect(screen.getByText('MODEL APPLICATION')).toBeInTheDocument();
    expect(screen.getByText('CASTING INQUIRY')).toBeInTheDocument();
    expect(screen.getByText('GENERAL CONTACT')).toBeInTheDocument();
  });

  it('기본 카드의 버튼들이 렌더링된다', () => {
    render(<ContactLanding />);
    expect(screen.getByText('Apply Now')).toBeInTheDocument();
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
    expect(screen.getByText('Send Message')).toBeInTheDocument();
  });

  it('커스텀 카드들이 렌더링된다', () => {
    const customCards: ContactCard[] = [
      {
        title: 'Custom Card 1',
        description: 'Custom description 1',
        buttonText: 'Custom Button 1',
        href: '/custom1',
      },
      {
        title: 'Custom Card 2',
        description: 'Custom description 2',
        buttonText: 'Custom Button 2',
        href: '/custom2',
        icon: '🎨',
      },
    ];

    render(<ContactLanding cards={customCards} />);
    expect(screen.getByText('Custom Card 1')).toBeInTheDocument();
    expect(screen.getByText('Custom Card 2')).toBeInTheDocument();
    expect(screen.getByText('🎨')).toBeInTheDocument();
  });

  it('카드 링크가 올바른 href를 가진다', () => {
    render(<ContactLanding />);
    const applyButton = screen.getByText('Apply Now').closest('a');
    const contactButton = screen.getByText('Contact Us').closest('a');

    expect(applyButton).toHaveAttribute('href', '/contact/apply');
    expect(contactButton).toHaveAttribute('href', '/contact/casting');
  });

  it('카드가 3개일 때 올바르게 렌더링된다', () => {
    const { container } = render(<ContactLanding />);
    const cards = container.querySelectorAll('.bg-white.p-8');
    expect(cards.length).toBe(3);
  });
});
