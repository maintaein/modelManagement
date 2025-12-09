import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

describe('useLocalStorage Hook', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('초기값을 반환한다', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    expect(result.current[0]).toBe('initial');
  });

  it('값을 설정할 수 있다', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');
  });

  it('localStorage에 값이 저장된다', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('updated');
    });

    expect(localStorage.getItem('test-key')).toBe(JSON.stringify('updated'));
  });

  it('기존 localStorage 값을 읽어온다', () => {
    localStorage.setItem('test-key', JSON.stringify('existing'));

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    expect(result.current[0]).toBe('existing');
  });

  it('함수형 업데이트를 지원한다', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 10));

    act(() => {
      result.current[1]((prev) => prev + 5);
    });

    expect(result.current[0]).toBe(15);
  });

  it('객체를 저장할 수 있다', () => {
    const { result } = renderHook(() =>
      useLocalStorage('test-key', { name: 'test', age: 25 })
    );

    act(() => {
      result.current[1]({ name: 'updated', age: 30 });
    });

    expect(result.current[0]).toEqual({ name: 'updated', age: 30 });
  });

  it('배열을 저장할 수 있다', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', [1, 2, 3]));

    act(() => {
      result.current[1]([4, 5, 6]);
    });

    expect(result.current[0]).toEqual([4, 5, 6]);
  });

  it('값을 삭제할 수 있다', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');

    act(() => {
      result.current[2]();
    });

    expect(result.current[0]).toBe('initial');
    expect(localStorage.getItem('test-key')).toBeNull();
  });

  it('잘못된 JSON을 처리한다', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    localStorage.setItem('test-key', 'invalid-json{');

    const { result } = renderHook(() => useLocalStorage('test-key', 'fallback'));

    expect(result.current[0]).toBe('fallback');
    expect(consoleWarnSpy).toHaveBeenCalled();

    consoleWarnSpy.mockRestore();
  });

  it('여러 타입의 초기값을 지원한다', () => {
    const { result: stringResult } = renderHook(() => useLocalStorage('string-key', 'test'));
    const { result: numberResult } = renderHook(() => useLocalStorage('number-key', 42));
    const { result: booleanResult } = renderHook(() => useLocalStorage('boolean-key', true));

    expect(stringResult.current[0]).toBe('test');
    expect(numberResult.current[0]).toBe(42);
    expect(booleanResult.current[0]).toBe(true);
  });
});
