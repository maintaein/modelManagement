import { render, screen } from '@testing-library/react';
import { Link } from '@/components/atoms/Link';

describe('Link 컴포넌트', () => {
  it('children이 올바르게 렌더링된다', () => {
    render(<Link href="/test">테스트 링크</Link>);
    const link = screen.getByText('테스트 링크');
    expect(link).toBeInTheDocument();
  });

  it('href 속성이 올바르게 전달된다', () => {
    render(<Link href="/test-page">테스트 링크</Link>);
    const link = screen.getByText('테스트 링크');
    expect(link).toHaveAttribute('href', '/test-page');
  });

  it('className prop이 올바르게 적용된다', () => {
    render(
      <Link href="/test" className="custom-link">
        커스텀 링크
      </Link>
    );
    const link = screen.getByText('커스텀 링크');
    expect(link).toHaveAttribute('href', '/test');
  });
});
