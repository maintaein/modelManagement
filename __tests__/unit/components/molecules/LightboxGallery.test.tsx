import { render, screen, fireEvent } from '@testing-library/react';
import { LightboxGallery, type GalleryImage } from '@/components/molecules/LightboxGallery';

describe('LightboxGallery 컴포넌트', () => {
  const mockImages: GalleryImage[] = [
    { id: '1', url: '/image1.jpg', alt: 'Image 1', caption: 'Caption 1' },
    { id: '2', url: '/image2.jpg', alt: 'Image 2', caption: 'Caption 2' },
    { id: '3', url: '/image3.jpg', alt: 'Image 3' },
  ];

  it('갤러리가 렌더링된다', () => {
    render(<LightboxGallery images={mockImages} />);
    expect(screen.getByRole('dialog', { name: 'Image gallery' })).toBeInTheDocument();
  });

  it('초기 인덱스의 이미지가 표시된다', () => {
    render(<LightboxGallery images={mockImages} initialIndex={1} />);
    expect(screen.getByAltText('Image 2')).toBeInTheDocument();
  });

  it('캡션이 있을 때 표시된다', () => {
    render(<LightboxGallery images={mockImages} initialIndex={0} />);
    expect(screen.getByText('Caption 1')).toBeInTheDocument();
  });

  it('이미지 카운터가 올바르게 표시된다', () => {
    render(<LightboxGallery images={mockImages} initialIndex={0} />);
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
  });

  it('닫기 버튼 클릭 시 onClose가 호출된다', () => {
    const handleClose = jest.fn();
    render(<LightboxGallery images={mockImages} onClose={handleClose} />);

    const closeButton = screen.getByLabelText('Close gallery');
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalled();
  });

  it('다음 버튼 클릭 시 다음 이미지로 이동한다', () => {
    render(<LightboxGallery images={mockImages} initialIndex={0} />);

    const nextButton = screen.getByLabelText('Next image');
    fireEvent.click(nextButton);

    expect(screen.getByText('2 / 3')).toBeInTheDocument();
  });

  it('이전 버튼 클릭 시 이전 이미지로 이동한다', () => {
    render(<LightboxGallery images={mockImages} initialIndex={1} />);

    const prevButton = screen.getByLabelText('Previous image');
    fireEvent.click(prevButton);

    expect(screen.getByText('1 / 3')).toBeInTheDocument();
  });

  it('마지막 이미지에서 다음 버튼 클릭 시 첫 이미지로 돌아간다', () => {
    render(<LightboxGallery images={mockImages} initialIndex={2} />);

    const nextButton = screen.getByLabelText('Next image');
    fireEvent.click(nextButton);

    expect(screen.getByText('1 / 3')).toBeInTheDocument();
  });

  it('첫 이미지에서 이전 버튼 클릭 시 마지막 이미지로 이동한다', () => {
    render(<LightboxGallery images={mockImages} initialIndex={0} />);

    const prevButton = screen.getByLabelText('Previous image');
    fireEvent.click(prevButton);

    expect(screen.getByText('3 / 3')).toBeInTheDocument();
  });

  it('이미지가 1개일 때 이전/다음 버튼이 표시되지 않는다', () => {
    const singleImage = [mockImages[0]];
    render(<LightboxGallery images={singleImage} />);

    expect(screen.queryByLabelText('Next image')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Previous image')).not.toBeInTheDocument();
  });
});
