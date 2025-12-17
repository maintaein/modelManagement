import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ModelForm, type ModelFormData } from '@/components/organisms/ModelForm';

// ResizeObserver 모킹
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

describe('ModelForm 컴포넌트', () => {
  it('생성 모드 제목이 렌더링된다', () => {
    const { container } = render(<ModelForm mode="create" />);
    const heading = container.querySelector('h2');
    expect(heading).toHaveTextContent('Create Model');
  });

  it('수정 모드 제목이 렌더링된다', () => {
    const { container } = render(<ModelForm mode="edit" />);
    const heading = container.querySelector('h2');
    expect(heading).toHaveTextContent('Edit Model');
  });

  it('모든 입력 필드가 렌더링된다', () => {
    render(<ModelForm />);
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Slug/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Height/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Bust/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Waist/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Hip/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Shoe Size/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Hair Color/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Eye Color/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Bio/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Featured Model/i)).toBeInTheDocument();
  });

  it('필수 필드가 required 속성을 가진다', () => {
    render(<ModelForm />);
    expect(screen.getByLabelText(/Name/i)).toBeRequired();
    expect(screen.getByLabelText(/Slug/i)).toBeRequired();
  });

  it('초기 데이터가 폼에 채워진다', () => {
    const initialData: Partial<ModelFormData> = {
      name: 'Test Model',
      slug: 'test-model',
      height: '175',
      featured: true,
    };

    render(<ModelForm initialData={initialData} />);

    expect(screen.getByLabelText(/Name/i)).toHaveValue('Test Model');
    expect(screen.getByLabelText(/Slug/i)).toHaveValue('test-model');
    expect(screen.getByLabelText(/Height/i)).toHaveValue(175);
    expect(screen.getByLabelText(/Featured Model/i)).toBeChecked();
  });

  it('폼 입력이 올바르게 작동한다', () => {
    render(<ModelForm />);

    const nameInput = screen.getByLabelText(/Name/i) as HTMLInputElement;
    const slugInput = screen.getByLabelText(/Slug/i) as HTMLInputElement;
    const heightInput = screen.getByLabelText(/Height/i) as HTMLInputElement;

    fireEvent.change(nameInput, { target: { value: 'New Model' } });
    fireEvent.change(slugInput, { target: { value: 'new-model' } });
    fireEvent.change(heightInput, { target: { value: '180' } });

    expect(nameInput.value).toBe('New Model');
    expect(slugInput.value).toBe('new-model');
    expect(heightInput.value).toBe('180');
  });

  it('폼 제출 시 onSubmit이 호출된다', async () => {
    const handleSubmit = jest.fn();
    render(<ModelForm onSubmit={handleSubmit} />);

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Test Model' } });
    fireEvent.change(screen.getByLabelText(/Slug/i), { target: { value: 'test-model' } });

    const form = screen.getByRole('button', { name: /Create Model/i }).closest('form');
    if (form) {
      fireEvent.submit(form);

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Test Model',
            slug: 'test-model',
          })
        );
      });
    }
  });

  it('Cancel 버튼 클릭 시 onCancel이 호출된다', () => {
    const handleCancel = jest.fn();
    render(<ModelForm onCancel={handleCancel} />);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(handleCancel).toHaveBeenCalledTimes(1);
  });

  it('onCancel이 없으면 Cancel 버튼이 표시되지 않는다', () => {
    render(<ModelForm />);
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
  });

  it('isSubmitting 상태에서 버튼들이 비활성화된다', () => {
    render(<ModelForm isSubmitting onCancel={jest.fn()} />);

    const submitButton = screen.getByText('Saving...');
    const cancelButton = screen.getByText('Cancel');

    expect(submitButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });

  it('Featured 체크박스가 올바르게 작동한다', () => {
    render(<ModelForm />);

    const checkbox = screen.getByLabelText(/Featured Model/i);
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('생성 모드에서 제출 버튼 텍스트가 "Create Model"이다', () => {
    render(<ModelForm mode="create" />);
    const submitButton = screen.getByRole('button', { name: /Create Model/i });
    expect(submitButton).toBeInTheDocument();
  });

  it('수정 모드에서 제출 버튼 텍스트가 "Save Changes"이다', () => {
    render(<ModelForm mode="edit" />);
    expect(screen.getByText('Save Changes')).toBeInTheDocument();
  });

  it('Height 필드에 min/max 제약이 있다', () => {
    render(<ModelForm />);
    const heightInput = screen.getByLabelText(/Height/i) as HTMLInputElement;
    expect(heightInput).toHaveAttribute('min', '150');
    expect(heightInput).toHaveAttribute('max', '220');
  });
});
