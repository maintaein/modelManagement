import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ModelCastingForm, type ModelCastingFormData } from '@/components/organisms/ModelCastingForm';

describe('ModelCastingForm 컴포넌트', () => {
  it('폼 제목이 렌더링된다', () => {
    render(<ModelCastingForm />);
    expect(screen.getByText('CASTING INQUIRY')).toBeInTheDocument();
    expect(screen.getByText('Request our models for your project')).toBeInTheDocument();
  });

  it('모든 입력 필드가 렌더링된다', () => {
    render(<ModelCastingForm />);
    expect(screen.getByLabelText(/Company Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contact Person/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Project Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Project Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Budget/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Project Requirements/i)).toBeInTheDocument();
  });

  it('제출 버튼이 렌더링된다', () => {
    render(<ModelCastingForm />);
    expect(screen.getByText('Submit Inquiry')).toBeInTheDocument();
  });

  it('폼 입력이 올바르게 작동한다', () => {
    render(<ModelCastingForm />);

    const companyInput = screen.getByLabelText(/Company Name/i) as HTMLInputElement;
    const contactInput = screen.getByLabelText(/Contact Person/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/Email/i) as HTMLInputElement;

    fireEvent.change(companyInput, { target: { value: 'Test Company' } });
    fireEvent.change(contactInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });

    expect(companyInput.value).toBe('Test Company');
    expect(contactInput.value).toBe('John Doe');
    expect(emailInput.value).toBe('john@example.com');
  });

  it('폼 제출 시 onSubmit이 호출된다', async () => {
    const handleSubmit = jest.fn();
    render(<ModelCastingForm onSubmit={handleSubmit} />);

    fireEvent.change(screen.getByLabelText(/Company Name/i), { target: { value: 'Test Company' } });
    fireEvent.change(screen.getByLabelText(/Contact Person/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: '010-1234-5678' } });
    fireEvent.change(screen.getByLabelText(/Project Date/i), { target: { value: '2025-12-31' } });
    fireEvent.change(screen.getByLabelText(/Project Requirements/i), { target: { value: 'Need 3 models' } });

    const form = screen.getByText('Submit Inquiry').closest('form');
    if (form) {
      fireEvent.submit(form);

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith({
          companyName: 'Test Company',
          contactPerson: 'John Doe',
          email: 'john@example.com',
          phone: '010-1234-5678',
          projectType: '',
          projectDate: '2025-12-31',
          budget: '',
          requirements: 'Need 3 models',
        });
      });
    }
  });

  it('isSubmitting 상태에서 버튼이 비활성화된다', () => {
    render(<ModelCastingForm isSubmitting />);
    const submitButton = screen.getByText('Submitting...');
    expect(submitButton).toBeDisabled();
  });

  it('필수 필드가 required 속성을 가진다', () => {
    render(<ModelCastingForm />);
    expect(screen.getByLabelText(/Company Name/i)).toBeRequired();
    expect(screen.getByLabelText(/Contact Person/i)).toBeRequired();
    expect(screen.getByLabelText(/Email/i)).toBeRequired();
    expect(screen.getByLabelText(/Phone/i)).toBeRequired();
    expect(screen.getByLabelText(/Project Date/i)).toBeRequired();
    expect(screen.getByLabelText(/Project Requirements/i)).toBeRequired();
  });

  it('Budget 필드는 선택사항이다', () => {
    render(<ModelCastingForm />);
    const budgetInput = screen.getByLabelText(/Budget/i);
    expect(budgetInput).not.toBeRequired();
  });

  it('프로젝트 타입 선택지가 렌더링된다', () => {
    render(<ModelCastingForm />);
    const selectTrigger = screen.getByText('Select project type');
    expect(selectTrigger).toBeInTheDocument();
  });
});
