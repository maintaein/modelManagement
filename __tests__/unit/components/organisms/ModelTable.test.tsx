import { render, screen, fireEvent } from '@testing-library/react';
import { ModelTable, type TableModel } from '@/components/organisms/ModelTable';

describe('ModelTable 컴포넌트', () => {
  const mockModels: TableModel[] = [
    { id: '1', name: 'Model 1', imageUrl: '/model1.jpg', category: 'INTOWN', height: '178', featured: true },
    { id: '2', name: 'Model 2', imageUrl: '/model2.jpg', category: 'DIRECT', height: '175', featured: false },
    { id: '3', name: 'Model 3', imageUrl: '/model3.jpg', category: 'ALL' },
  ];

  it('테이블 헤더가 렌더링된다', () => {
    const { container } = render(<ModelTable models={mockModels} />);
    const headers = container.querySelectorAll('thead th');
    expect(headers[0]).toHaveTextContent('Image');
    expect(headers[1]).toHaveTextContent('Name');
    expect(headers[2]).toHaveTextContent('Category');
    expect(headers[3]).toHaveTextContent('Height');
    expect(headers[4]).toHaveTextContent('Featured');
    expect(headers[5]).toHaveTextContent('Actions');
  });

  it('모델 데이터가 렌더링된다', () => {
    render(<ModelTable models={mockModels} />);
    expect(screen.getByText('Model 1')).toBeInTheDocument();
    expect(screen.getByText('Model 2')).toBeInTheDocument();
    expect(screen.getByText('Model 3')).toBeInTheDocument();
  });

  it('카테고리 배지가 렌더링된다', () => {
    render(<ModelTable models={mockModels} />);
    expect(screen.getByText('INTOWN')).toBeInTheDocument();
    expect(screen.getByText('DIRECT')).toBeInTheDocument();
    expect(screen.getByText('ALL')).toBeInTheDocument();
  });

  it('키 정보가 렌더링된다', () => {
    render(<ModelTable models={mockModels} />);
    expect(screen.getByText('178')).toBeInTheDocument();
    expect(screen.getByText('175')).toBeInTheDocument();
  });

  it('키가 없는 경우 "-"가 표시된다', () => {
    const { container } = render(<ModelTable models={mockModels} />);
    const heightCells = container.querySelectorAll('tbody td:nth-child(4)');
    expect(heightCells[2]).toHaveTextContent('-');
  });

  it('Featured 배지가 올바르게 표시된다', () => {
    const { container } = render(<ModelTable models={mockModels} />);
    const featuredBadges = container.querySelectorAll('.bg-blue-100');
    expect(featuredBadges).toHaveLength(1);
    expect(featuredBadges[0]).toHaveTextContent('Featured');
  });

  it('Edit 버튼이 렌더링된다', () => {
    const handleEdit = jest.fn();
    render(<ModelTable models={mockModels} onEdit={handleEdit} />);
    const editButtons = screen.getAllByText('Edit');
    expect(editButtons).toHaveLength(3);
  });

  it('Delete 버튼이 렌더링된다', () => {
    const handleDelete = jest.fn();
    render(<ModelTable models={mockModels} onDelete={handleDelete} />);
    const deleteButtons = screen.getAllByText('Delete');
    expect(deleteButtons).toHaveLength(3);
  });

  it('Edit 버튼 클릭 시 onEdit이 호출된다', () => {
    const handleEdit = jest.fn();
    render(<ModelTable models={mockModels} onEdit={handleEdit} />);

    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);

    expect(handleEdit).toHaveBeenCalledWith('1');
  });

  it('Delete 버튼 클릭 시 onDelete가 호출된다', () => {
    const handleDelete = jest.fn();
    render(<ModelTable models={mockModels} onDelete={handleDelete} />);

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[1]);

    expect(handleDelete).toHaveBeenCalledWith('2');
  });

  it('모델이 없을 때 "No models found" 메시지가 표시된다', () => {
    render(<ModelTable models={[]} />);
    expect(screen.getByText('No models found')).toBeInTheDocument();
  });

  it('onEdit이 없으면 Edit 버튼이 표시되지 않는다', () => {
    render(<ModelTable models={mockModels} />);
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
  });

  it('onDelete가 없으면 Delete 버튼이 표시되지 않는다', () => {
    render(<ModelTable models={mockModels} />);
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });
});
