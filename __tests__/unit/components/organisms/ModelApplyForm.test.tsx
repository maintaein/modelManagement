import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ModelApplyForm } from '@/components/organisms/ModelApplyForm';

describe('ModelApplyForm 컴포넌트', () => {
  it('폼 제목이 렌더링된다', () => {
    render(<ModelApplyForm />);
    expect(screen.getByText('MODEL APPLICATION')).toBeInTheDocument();
    expect(screen.getByText('Join PLATINUM MANAGEMENT')).toBeInTheDocument();
  });

  it('모든 입력 필드가 렌더링된다', () => {
    render(<ModelApplyForm />);
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Age/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Height/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Tell us about yourself/i)).toBeInTheDocument();
  });

  it('제출 버튼이 렌더링된다', () => {
    render(<ModelApplyForm />);
    expect(screen.getByText('Submit Application')).toBeInTheDocument();
  });

  it('폼 입력이 올바르게 작동한다', () => {
    render(<ModelApplyForm />);

    const nameInput = screen.getByLabelText(/Full Name/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/Email/i) as HTMLInputElement;
    const phoneInput = screen.getByLabelText(/Phone/i) as HTMLInputElement;

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(phoneInput, { target: { value: '010-1234-5678' } });

    expect(nameInput.value).toBe('Test User');
    expect(emailInput.value).toBe('test@example.com');
    expect(phoneInput.value).toBe('010-1234-5678');
  });

  it('폼 제출 시 onSubmit이 호출된다', async () => {
    const handleSubmit = jest.fn();
    render(<ModelApplyForm onSubmit={handleSubmit} />);

    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: '010-1234-5678' } });
    fireEvent.change(screen.getByLabelText(/Age/i), { target: { value: '25' } });
    fireEvent.change(screen.getByLabelText(/Height/i), { target: { value: '175' } });

    const form = screen.getByText('Submit Application').closest('form');
    if (form) {
      fireEvent.submit(form);

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith({
          name: 'Test User',
          email: 'test@example.com',
          phone: '010-1234-5678',
          age: '25',
          height: '175',
          message: '',
        });
      });
    }
  });

  it('isSubmitting 상태에서 버튼이 비활성화된다', () => {
    render(<ModelApplyForm isSubmitting />);
    const submitButton = screen.getByText('Submitting...');
    expect(submitButton).toBeDisabled();
  });

  it('필수 필드가 required 속성을 가진다', () => {
    render(<ModelApplyForm />);
    expect(screen.getByLabelText(/Full Name/i)).toBeRequired();
    expect(screen.getByLabelText(/Email/i)).toBeRequired();
    expect(screen.getByLabelText(/Phone/i)).toBeRequired();
    expect(screen.getByLabelText(/Age/i)).toBeRequired();
    expect(screen.getByLabelText(/Height/i)).toBeRequired();
  });

  it('나이와 키에 min/max 제약이 있다', () => {
    render(<ModelApplyForm />);
    const ageInput = screen.getByLabelText(/Age/i) as HTMLInputElement;
    const heightInput = screen.getByLabelText(/Height/i) as HTMLInputElement;

    expect(ageInput).toHaveAttribute('min', '16');
    expect(ageInput).toHaveAttribute('max', '99');
    expect(heightInput).toHaveAttribute('min', '150');
    expect(heightInput).toHaveAttribute('max', '220');
  });
});
