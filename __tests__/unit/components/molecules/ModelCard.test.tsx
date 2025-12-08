import { render, screen, fireEvent } from '@testing-library/react';
import { ModelCard, type ModelCardProps } from '@/components/molecules/ModelCard';

describe('ModelCard 컴포넌트', () => {
  const mockProps: ModelCardProps = {
    id: '1',
    name: 'KAMI',
    imageUrl: '/test.jpg',
    height: '178',
    bust: '83',
    waist: '61',
    hip: '88',
  };

  it('모델 이름이 렌더링된다', () => {
    render(<ModelCard {...mockProps} />);
    const names = screen.getAllByText('KAMI');
    expect(names.length).toBeGreaterThan(0);
  });

  it('onClick 핸들러가 카드 클릭 시 호출된다', () => {
    const handleClick = jest.fn();
    render(<ModelCard {...mockProps} onClick={handleClick} />);

    const card = screen.getByRole('img', { name: /KAMI model photo/i }).parentElement;
    if (card) {
      fireEvent.click(card);
      expect(handleClick).toHaveBeenCalledWith('1');
    }
  });

  it('featured 배지가 표시된다', () => {
    render(<ModelCard {...mockProps} featured />);
    expect(screen.getByText('FEATURED')).toBeInTheDocument();
  });

  it('featured가 false일 때 배지가 표시되지 않는다', () => {
    render(<ModelCard {...mockProps} featured={false} />);
    expect(screen.queryByText('FEATURED')).not.toBeInTheDocument();
  });

  it('모델 정보(measurements)가 올바르게 렌더링된다', () => {
    render(<ModelCard {...mockProps} />);
    expect(screen.getByText('HEIGHT')).toBeInTheDocument();
    expect(screen.getByText('178')).toBeInTheDocument();
    expect(screen.getByText('BUST')).toBeInTheDocument();
    expect(screen.getByText('83')).toBeInTheDocument();
  });

  it('activity 정보가 있을 때 표시된다', () => {
    render(<ModelCard {...mockProps} activity="MODEL / ACTOR" />);
    expect(screen.getByText('ACTIVITY')).toBeInTheDocument();
    expect(screen.getByText('MODEL / ACTOR')).toBeInTheDocument();
  });

  it('화살표 버튼 클릭 시 onClick이 호출된다', () => {
    const handleClick = jest.fn();
    render(<ModelCard {...mockProps} onClick={handleClick} />);

    const arrowButton = screen.getByLabelText(/View KAMI profile/i);
    fireEvent.click(arrowButton);
    expect(handleClick).toHaveBeenCalledWith('1');
  });
});
