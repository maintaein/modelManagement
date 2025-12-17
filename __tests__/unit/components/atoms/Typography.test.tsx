import { render, screen } from '@testing-library/react';
import { Heading, Text, H1, H2, H3, H4, H5, H6 } from '@/components/atoms/Typography';

describe('Typography 컴포넌트', () => {
  describe('Heading 컴포넌트', () => {
    it('올바른 heading 레벨로 렌더링된다', () => {
      const { container } = render(<Heading level="h2">테스트 제목</Heading>);
      const heading = container.querySelector('h2');
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('테스트 제목');
    });

    it('weight prop이 올바른 클래스를 적용한다', () => {
      render(<Heading level="h1" weight="semibold">굵기 테스트</Heading>);
      const heading = screen.getByText('굵기 테스트');
      expect(heading).toHaveClass('font-semibold');
    });

    it('lineHeight prop이 올바른 클래스를 적용한다', () => {
      render(<Heading level="h1" lineHeight="relaxed">줄높이 테스트</Heading>);
      const heading = screen.getByText('줄높이 테스트');
      expect(heading).toHaveClass('leading-relaxed');
    });

    it('custom className이 추가된다', () => {
      render(<Heading level="h1" className="custom-heading">커스텀 클래스</Heading>);
      const heading = screen.getByText('커스텀 클래스');
      expect(heading).toHaveClass('custom-heading');
    });
  });

  describe('Text 컴포넌트', () => {
    it('p 태그로 렌더링된다', () => {
      const { container } = render(<Text>테스트 텍스트</Text>);
      const text = container.querySelector('p');
      expect(text).toBeInTheDocument();
      expect(text).toHaveTextContent('테스트 텍스트');
    });

    it('size prop이 올바른 클래스를 적용한다', () => {
      render(<Text size="large">큰 텍스트</Text>);
      const text = screen.getByText('큰 텍스트');
      expect(text).toHaveClass('text-[1.125rem]');
    });

    it('weight prop이 올바른 클래스를 적용한다', () => {
      render(<Text weight="bold">굵은 텍스트</Text>);
      const text = screen.getByText('굵은 텍스트');
      expect(text).toHaveClass('font-bold');
    });
  });

  describe('편의 Heading 컴포넌트 (H1-H6)', () => {
    it('H1 컴포넌트가 h1로 렌더링된다', () => {
      const { container } = render(<H1>H1 제목</H1>);
      expect(container.querySelector('h1')).toBeInTheDocument();
    });

    it('H2 컴포넌트가 h2로 렌더링된다', () => {
      const { container } = render(<H2>H2 제목</H2>);
      expect(container.querySelector('h2')).toBeInTheDocument();
    });

    it('H3 컴포넌트가 h3로 렌더링된다', () => {
      const { container } = render(<H3>H3 제목</H3>);
      expect(container.querySelector('h3')).toBeInTheDocument();
    });

    it('H4 컴포넌트가 h4로 렌더링된다', () => {
      const { container } = render(<H4>H4 제목</H4>);
      expect(container.querySelector('h4')).toBeInTheDocument();
    });

    it('H5 컴포넌트가 h5로 렌더링된다', () => {
      const { container } = render(<H5>H5 제목</H5>);
      expect(container.querySelector('h5')).toBeInTheDocument();
    });

    it('H6 컴포넌트가 h6로 렌더링된다', () => {
      const { container } = render(<H6>H6 제목</H6>);
      expect(container.querySelector('h6')).toBeInTheDocument();
    });
  });
});
