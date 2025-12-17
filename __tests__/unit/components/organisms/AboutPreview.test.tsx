import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { AboutPreview, type AboutSlide } from '@/components/organisms/AboutPreview';

// FadeContent 모킹
jest.mock('@/components/bits/FadeContent', () => ({
  __esModule: true,
  default: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
}));

describe('AboutPreview 컴포넌트', () => {
  const mockSlides: AboutSlide[] = [
    { id: '1', title: 'Slide 1', description: 'Description 1' },
    { id: '2', title: 'Slide 2', description: 'Description 2' },
    { id: '3', title: 'Slide 3', description: 'Description 3' },
  ];

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it('첫 번째 슬라이드가 렌더링된다', () => {
    render(<AboutPreview slides={mockSlides} autoPlayInterval={0} />);
    expect(screen.getByText('Slide 1')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
  });

  it('인디케이터가 슬라이드 개수만큼 렌더링된다', () => {
    render(<AboutPreview slides={mockSlides} autoPlayInterval={0} />);
    const indicators = screen.getAllByRole('button', { name: /Go to slide/i });
    expect(indicators).toHaveLength(3);
  });

  it('인디케이터 클릭 시 해당 슬라이드로 이동한다', () => {
    render(<AboutPreview slides={mockSlides} autoPlayInterval={0} />);

    const secondIndicator = screen.getByLabelText('Go to slide 2');
    fireEvent.click(secondIndicator);

    expect(screen.getByText('Slide 2')).toBeInTheDocument();
  });

  it('자동 재생이 작동한다', async () => {
    render(<AboutPreview slides={mockSlides} autoPlayInterval={1000} />);

    // 초기 슬라이드
    expect(screen.getByText('Slide 1')).toBeInTheDocument();

    // 1초 후 다음 슬라이드
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    await waitFor(() => {
      expect(screen.getByText('Slide 2')).toBeInTheDocument();
    });

    // 다시 1초 후 다음 슬라이드
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    await waitFor(() => {
      expect(screen.getByText('Slide 3')).toBeInTheDocument();
    });
  });

  it('마지막 슬라이드 후 첫 슬라이드로 돌아간다', async () => {
    render(<AboutPreview slides={mockSlides} autoPlayInterval={1000} />);

    // 3초 후 (3번 전환) 첫 슬라이드로 돌아감
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    await waitFor(() => {
      expect(screen.getByText('Slide 1')).toBeInTheDocument();
    });
  });

  it('autoPlayInterval이 0일 때 자동 재생되지 않는다', () => {
    render(<AboutPreview slides={mockSlides} autoPlayInterval={0} />);

    expect(screen.getByText('Slide 1')).toBeInTheDocument();

    // 시간이 지나도 슬라이드 변경 없음
    act(() => {
      jest.advanceTimersByTime(10000);
    });
    expect(screen.getByText('Slide 1')).toBeInTheDocument();
  });
});
