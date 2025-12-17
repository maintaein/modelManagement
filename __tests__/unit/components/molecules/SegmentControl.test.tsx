import { render, screen, fireEvent } from '@testing-library/react';
import { SegmentControl, type SegmentOption } from '@/components/molecules/SegmentControl';

describe('SegmentControl 컴포넌트', () => {
  const mockOptions: SegmentOption[] = [
    { value: 'all', label: 'ALL' },
    { value: 'intown', label: 'INTOWN' },
    { value: 'global', label: 'GLOBAL' },
  ];

  it('모든 옵션이 렌더링된다', () => {
    render(<SegmentControl options={mockOptions} />);
    expect(screen.getByText('ALL')).toBeInTheDocument();
    expect(screen.getByText('INTOWN')).toBeInTheDocument();
    expect(screen.getByText('GLOBAL')).toBeInTheDocument();
  });

  it('defaultValue로 지정된 옵션이 선택된다', () => {
    render(<SegmentControl options={mockOptions} defaultValue="intown" />);
    const intownButton = screen.getByRole('tab', { name: 'INTOWN' });
    expect(intownButton).toHaveAttribute('aria-selected', 'true');
  });

  it('첫 번째 옵션이 기본 선택된다', () => {
    render(<SegmentControl options={mockOptions} />);
    const allButton = screen.getByRole('tab', { name: 'ALL' });
    expect(allButton).toHaveAttribute('aria-selected', 'true');
  });

  it('옵션 클릭 시 onChange가 호출된다', () => {
    const handleChange = jest.fn();
    render(<SegmentControl options={mockOptions} onChange={handleChange} />);

    const globalButton = screen.getByRole('tab', { name: 'GLOBAL' });
    fireEvent.click(globalButton);

    expect(handleChange).toHaveBeenCalledWith('global');
  });

  it('disabled 옵션은 클릭할 수 없다', () => {
    const disabledOptions: SegmentOption[] = [
      ...mockOptions,
      { value: 'disabled', label: 'DISABLED', disabled: true },
    ];
    const handleChange = jest.fn();
    render(<SegmentControl options={disabledOptions} onChange={handleChange} />);

    const disabledButton = screen.getByRole('tab', { name: 'DISABLED' });
    expect(disabledButton).toBeDisabled();
    fireEvent.click(disabledButton);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('controlled mode에서 value prop이 우선된다', () => {
    render(<SegmentControl options={mockOptions} value="global" />);
    const globalButton = screen.getByRole('tab', { name: 'GLOBAL' });
    expect(globalButton).toHaveAttribute('aria-selected', 'true');
  });

  it('size prop에 따라 올바른 크기 클래스가 적용된다', () => {
    const { rerender } = render(<SegmentControl options={mockOptions} size="sm" />);
    let allButton = screen.getByRole('tab', { name: 'ALL' });
    expect(allButton).toHaveClass('text-sm');

    rerender(<SegmentControl options={mockOptions} size="lg" />);
    allButton = screen.getByRole('tab', { name: 'ALL' });
    expect(allButton).toHaveClass('text-lg');
  });
});
