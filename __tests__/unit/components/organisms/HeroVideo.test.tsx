import { render, screen } from '@testing-library/react';
import { HeroVideo } from '@/components/organisms/HeroVideo';

// SplitText 모킹 (GSAP 애니메이션 제거)
jest.mock('@/components/bits/SplitText', () => ({
  __esModule: true,
  default: ({ text }: { text: string }) => <span>{text}</span>,
}));

describe('HeroVideo 컴포넌트', () => {
  const mockVideoSrc = '/videos/hero.mp4';

  it('비디오 요소가 렌더링된다', () => {
    const { container } = render(<HeroVideo videoSrc={mockVideoSrc} />);
    const video = container.querySelector('video');
    expect(video).toBeInTheDocument();
    expect(video).toHaveClass('absolute');
    expect(video).toHaveClass('object-cover');
  });

  it('기본 타이틀이 렌더링된다', () => {
    render(<HeroVideo videoSrc={mockVideoSrc} />);
    expect(screen.getByText('PLATINUM MANAGEMENT')).toBeInTheDocument();
  });

  it('커스텀 타이틀이 렌더링된다', () => {
    render(<HeroVideo videoSrc={mockVideoSrc} title="CUSTOM TITLE" />);
    expect(screen.getByText('CUSTOM TITLE')).toBeInTheDocument();
  });

  it('서브타이틀이 있을 때 렌더링된다', () => {
    render(
      <HeroVideo
        videoSrc={mockVideoSrc}
        subtitle="Leading Model Agency"
      />
    );
    expect(screen.getByText('Leading Model Agency')).toBeInTheDocument();
  });

  it('서브타이틀이 없을 때 렌더링되지 않는다', () => {
    render(<HeroVideo videoSrc={mockVideoSrc} />);
    const subtitle = screen.queryByText(/Leading/i);
    expect(subtitle).not.toBeInTheDocument();
  });

  it('스크롤 인디케이터가 기본적으로 표시된다', () => {
    render(<HeroVideo videoSrc={mockVideoSrc} />);
    expect(screen.getByText('SCROLL')).toBeInTheDocument();
  });

  it('showScrollIndicator가 false일 때 인디케이터가 숨겨진다', () => {
    render(<HeroVideo videoSrc={mockVideoSrc} showScrollIndicator={false} />);
    expect(screen.queryByText('SCROLL')).not.toBeInTheDocument();
  });

  it('video source가 올바르게 설정된다', () => {
    const { container } = render(<HeroVideo videoSrc={mockVideoSrc} />);
    const source = container.querySelector('source');
    expect(source).toHaveAttribute('src', mockVideoSrc);
    expect(source).toHaveAttribute('type', 'video/mp4');
  });
});
