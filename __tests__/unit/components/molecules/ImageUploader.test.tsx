import { render, screen } from '@testing-library/react';
import { ImageUploader } from '@/components/molecules/ImageUploader';

describe('ImageUploader 컴포넌트', () => {

  it('업로드 영역이 렌더링된다', () => {
    render(<ImageUploader />);
    expect(screen.getByText(/이미지를 드래그하거나 클릭하여 업로드/i)).toBeInTheDocument();
  });

  it('파일 제한 정보가 표시된다', () => {
    render(<ImageUploader maxFiles={5} maxSize={10 * 1024 * 1024} />);
    expect(screen.getByText(/최대 5개/i)).toBeInTheDocument();
    expect(screen.getByText(/10\.0MB/i)).toBeInTheDocument();
  });

  it('파일 input이 올바른 속성으로 렌더링된다', () => {
    const { container } = render(<ImageUploader accept="image/jpeg" multiple />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('accept', 'image/jpeg');
    expect(input).toHaveAttribute('multiple');
  });

  it('maxFiles와 maxSize가 올바르게 표시된다', () => {
    render(<ImageUploader maxFiles={3} maxSize={2 * 1024 * 1024} />);
    expect(screen.getByText(/최대 3개/i)).toBeInTheDocument();
    expect(screen.getByText(/2\.0MB/i)).toBeInTheDocument();
  });

  it('disabled 상태에서는 파일 선택이 불가능하다', () => {
    const { container } = render(<ImageUploader disabled />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toBeDisabled();
  });
});
