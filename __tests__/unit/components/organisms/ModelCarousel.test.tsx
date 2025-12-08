import { render, screen, fireEvent } from '@testing-library/react';
import { ModelCarousel, type CarouselModel } from '@/components/organisms/ModelCarousel';

// Carousel 모킹
jest.mock('@/components/bits/Carousel', () => ({
  __esModule: true,
  default: ({ items }: { items: { id: number; title: string; description: string; icon: React.ReactNode }[] }) => (
    <div data-testid="carousel">
      {items.map((item) => (
        <div key={item.id}>
          <div>{item.title}</div>
          <div>{item.description}</div>
          <div>{item.icon}</div>
        </div>
      ))}
    </div>
  ),
}));

describe('ModelCarousel 컴포넌트', () => {
  const mockModels: CarouselModel[] = [
    { id: '1', name: 'Model 1', imageUrl: '/model1.jpg', category: 'INTOWN' },
    { id: '2', name: 'Model 2', imageUrl: '/model2.jpg', category: 'GLOBAL' },
    { id: '3', name: 'Model 3', imageUrl: '/model3.jpg' },
  ];

  it('모든 모델이 렌더링된다', () => {
    render(<ModelCarousel models={mockModels} />);
    expect(screen.getAllByText('Model 1').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Model 2').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Model 3').length).toBeGreaterThan(0);
  });

  it('카테고리가 있을 때 표시된다', () => {
    render(<ModelCarousel models={mockModels} />);
    expect(screen.getAllByText('INTOWN').length).toBeGreaterThan(0);
    expect(screen.getAllByText('GLOBAL').length).toBeGreaterThan(0);
  });

  it('모델 클릭 시 onModelClick이 호출된다', () => {
    const handleModelClick = jest.fn();
    render(<ModelCarousel models={mockModels} onModelClick={handleModelClick} />);

    const modelCard = screen.getAllByText('Model 1')[0].closest('[role="button"]');
    if (modelCard) {
      fireEvent.click(modelCard);
      expect(handleModelClick).toHaveBeenCalledWith('1');
    }
  });

  it('Enter 키 입력 시 onModelClick이 호출된다', () => {
    const handleModelClick = jest.fn();
    render(<ModelCarousel models={mockModels} onModelClick={handleModelClick} />);

    const modelCard = screen.getAllByText('Model 1')[0].closest('[role="button"]');
    if (modelCard) {
      fireEvent.keyDown(modelCard, { key: 'Enter' });
      expect(handleModelClick).toHaveBeenCalledWith('1');
    }
  });

  it('Space 키 입력 시 onModelClick이 호출된다', () => {
    const handleModelClick = jest.fn();
    render(<ModelCarousel models={mockModels} onModelClick={handleModelClick} />);

    const modelCard = screen.getAllByText('Model 1')[0].closest('[role="button"]');
    if (modelCard) {
      fireEvent.keyDown(modelCard, { key: ' ' });
      expect(handleModelClick).toHaveBeenCalledWith('1');
    }
  });

  it('모델이 없을 때 안내 메시지가 표시된다', () => {
    render(<ModelCarousel models={[]} />);
    expect(screen.getByText('No models available')).toBeInTheDocument();
  });

  it('이미지 alt 속성이 올바르게 설정된다', () => {
    render(<ModelCarousel models={mockModels} />);
    const img = screen.getByAltText('Model 1 model photo');
    expect(img).toBeInTheDocument();
  });
});
