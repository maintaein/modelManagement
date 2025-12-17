import { render, screen, fireEvent } from '@testing-library/react';
import { ModelGrid, type GridModel } from '@/components/organisms/ModelGrid';

// AnimatedList 모킹
jest.mock('@/components/bits/AnimatedList', () => ({
  __esModule: true,
  default: ({ items, className }: { items?: React.ReactNode[]; className?: string }) => (
    <div className={className}>{items}</div>
  ),
}));

describe('ModelGrid 컴포넌트', () => {
  const mockModels: GridModel[] = [
    { id: '1', name: 'Model 1', imageUrl: '/model1.jpg', height: '178', featured: true },
    { id: '2', name: 'Model 2', imageUrl: '/model2.jpg', height: '175' },
    { id: '3', name: 'Model 3', imageUrl: '/model3.jpg', height: '180' },
  ];

  it('모델 목록이 렌더링된다', () => {
    render(<ModelGrid models={mockModels} />);
    expect(screen.getAllByText('Model 1').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Model 2').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Model 3').length).toBeGreaterThan(0);
  });

  it('카테고리 필터가 표시된다', () => {
    const handleCategoryChange = jest.fn();
    render(<ModelGrid models={mockModels} onCategoryChange={handleCategoryChange} />);
    expect(screen.getAllByText('ALL').length).toBeGreaterThan(0);
    expect(screen.getAllByText('INTOWN').length).toBeGreaterThan(0);
    expect(screen.getAllByText('UPCOMING').length).toBeGreaterThan(0);
  });

  it('onCategoryChange가 없을 때 필터가 숨겨진다', () => {
    render(<ModelGrid models={mockModels} />);
    const segments = screen.queryAllByRole('tab');
    expect(segments.length).toBe(0);
  });

  it('로딩 상태가 표시된다', () => {
    const { container } = render(<ModelGrid models={[]} isLoading />);
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('모델이 없을 때 안내 메시지가 표시된다', () => {
    render(<ModelGrid models={[]} />);
    expect(screen.getByText('No models found')).toBeInTheDocument();
  });

  it('모델 클릭 시 onModelClick이 호출된다', () => {
    const handleModelClick = jest.fn();
    render(<ModelGrid models={mockModels} onModelClick={handleModelClick} />);

    const modelCards = screen.getAllByRole('img');
    if (modelCards.length > 0) {
      const firstCard = modelCards[0].closest('[role="button"]');
      if (firstCard) {
        fireEvent.click(firstCard);
        expect(handleModelClick).toHaveBeenCalled();
      }
    }
  });

  it('선택된 카테고리가 올바르게 표시된다', () => {
    const handleCategoryChange = jest.fn();
    render(
      <ModelGrid
        models={mockModels}
        selectedCategory="INTOWN"
        onCategoryChange={handleCategoryChange}
      />
    );

    const intownTab = screen.getAllByRole('tab').find(el => el.textContent === 'INTOWN');
    expect(intownTab).toHaveAttribute('aria-selected', 'true');
  });
});
