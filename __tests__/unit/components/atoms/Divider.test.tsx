import { render } from '@testing-library/react';
import { Divider } from '@/components/atoms/Divider';

describe('Divider 컴포넌트', () => {
  it('horizontal orientation으로 렌더링된다 (기본값)', () => {
    const { container } = render(<Divider />);
    const separator = container.querySelector('[data-orientation="horizontal"]');
    expect(separator).toBeInTheDocument();
  });

  it('vertical orientation으로 렌더링된다', () => {
    const { container } = render(<Divider orientation="vertical" />);
    const separator = container.querySelector('[data-orientation="vertical"]');
    expect(separator).toBeInTheDocument();
  });

  it('spacing prop이 올바른 클래스를 적용한다', () => {
    const { container } = render(<Divider spacing="lg" />);
    const separator = container.querySelector('[data-orientation]');
    expect(separator).toHaveClass('my-12');
  });

  it('variant prop이 올바른 클래스를 적용한다', () => {
    const { container: dashedContainer } = render(<Divider variant="dashed" />);
    const dashedSeparator = dashedContainer.querySelector('[data-orientation]');
    expect(dashedSeparator).toHaveClass('border-dashed');

    const { container: dottedContainer } = render(<Divider variant="dotted" />);
    const dottedSeparator = dottedContainer.querySelector('[data-orientation]');
    expect(dottedSeparator).toHaveClass('border-dotted');
  });

  it('custom className이 추가된다', () => {
    const { container } = render(<Divider className="custom-divider" />);
    const separator = container.querySelector('[data-orientation]');
    expect(separator).toHaveClass('custom-divider');
  });
});
