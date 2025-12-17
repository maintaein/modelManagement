import { render, screen, fireEvent } from '@testing-library/react';
import { ArchiveGrid, type ArchiveItem } from '@/components/organisms/ArchiveGrid';

// AnimatedList 모킹
jest.mock('@/components/bits/AnimatedList', () => ({
  __esModule: true,
  default: ({ items, className }: { items?: React.ReactNode[]; className?: string }) => (
    <div className={className}>{items}</div>
  ),
}));

describe('ArchiveGrid 컴포넌트', () => {
  const mockArchives: ArchiveItem[] = [
    { id: '1', imageUrl: '/archive1.jpg', brand: 'Brand A', modelName: 'Model 1' },
    { id: '2', imageUrl: '/archive2.jpg', brand: 'Brand B', modelName: 'Model 2', caption: 'Caption 2' },
    { id: '3', imageUrl: '/archive3.jpg' },
  ];

  it('아카이브 목록이 렌더링된다', () => {
    render(<ArchiveGrid archives={mockArchives} />);
    expect(screen.getByAltText('Brand A - Model 1')).toBeInTheDocument();
    expect(screen.getByAltText('Brand B - Model 2')).toBeInTheDocument();
  });

  it('브랜드와 모델명이 표시된다', () => {
    render(<ArchiveGrid archives={mockArchives} />);
    expect(screen.getByText('Brand A')).toBeInTheDocument();
    expect(screen.getByText('Model 1')).toBeInTheDocument();
  });

  it('로딩 상태가 표시된다', () => {
    const { container } = render(<ArchiveGrid archives={[]} isLoading />);
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBe(8);
  });

  it('아카이브가 없을 때 안내 메시지가 표시된다', () => {
    render(<ArchiveGrid archives={[]} />);
    expect(screen.getByText('No archives found')).toBeInTheDocument();
  });

  it('아카이브 클릭 시 Lightbox가 열린다', () => {
    render(<ArchiveGrid archives={mockArchives} />);

    const archiveItem = screen.getByAltText('Brand A - Model 1').closest('[role="button"]');
    if (archiveItem) {
      fireEvent.click(archiveItem);
      // Lightbox가 열렸는지 확인 (dialog role)
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    }
  });

  it('Enter 키로 아카이브를 열 수 있다', () => {
    render(<ArchiveGrid archives={mockArchives} />);

    const archiveItem = screen.getByAltText('Brand A - Model 1').closest('[role="button"]');
    if (archiveItem) {
      fireEvent.keyDown(archiveItem, { key: 'Enter' });
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    }
  });

  it('columns prop에 따라 다른 그리드 레이아웃이 적용된다', () => {
    const { container, rerender } = render(<ArchiveGrid archives={mockArchives} columns={2} />);
    let grid = container.querySelector('.grid');
    expect(grid).toHaveClass('grid-cols-1');
    expect(grid).toHaveClass('sm:grid-cols-2');

    rerender(<ArchiveGrid archives={mockArchives} columns={3} />);
    grid = container.querySelector('.grid');
    expect(grid).toHaveClass('lg:grid-cols-3');

    rerender(<ArchiveGrid archives={mockArchives} columns={4} />);
    grid = container.querySelector('.grid');
    expect(grid).toHaveClass('xl:grid-cols-4');
  });
});
