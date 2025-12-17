import { render, screen } from '@testing-library/react';
import { Image } from '@/components/atoms/Image';

describe('Image 컴포넌트', () => {
  it('alt 속성이 필수로 렌더링된다', () => {
    render(<Image src="/test.jpg" alt="테스트 이미지" width={100} height={100} />);
    const img = screen.getByAltText('테스트 이미지');
    expect(img).toBeInTheDocument();
  });

  it('className prop이 올바르게 적용된다', () => {
    render(
      <Image
        src="/test.jpg"
        alt="테스트 이미지"
        width={100}
        height={100}
        className="custom-class"
      />
    );
    const img = screen.getByAltText('테스트 이미지');
    expect(img).toHaveClass('custom-class');
    expect(img).toHaveClass('object-cover'); // 기본 클래스도 포함
  });

  it('Next.js Image props가 올바르게 전달된다', () => {
    render(
      <Image
        src="/test.jpg"
        alt="테스트 이미지"
        width={200}
        height={150}
      />
    );
    const img = screen.getByAltText('테스트 이미지');
    expect(img).toBeInTheDocument();
  });
});
