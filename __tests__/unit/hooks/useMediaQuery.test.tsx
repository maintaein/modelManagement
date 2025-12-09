import { renderHook, act } from '@testing-library/react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

describe('useMediaQuery Hook', () => {
  let matchMediaMock: jest.Mock;
  let listeners: Array<(e: MediaQueryListEvent) => void> = [];

  beforeEach(() => {
    listeners = [];

    matchMediaMock = jest.fn((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: jest.fn((event: string, handler: (e: MediaQueryListEvent) => void) => {
        if (event === 'change') {
          listeners.push(handler);
        }
      }),
      removeEventListener: jest.fn((event: string, handler: (e: MediaQueryListEvent) => void) => {
        if (event === 'change') {
          listeners = listeners.filter((l) => l !== handler);
        }
      }),
      dispatchEvent: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMediaMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    listeners = [];
  });

  it('초기값으로 false를 반환한다', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(false);
  });

  it('미디어 쿼리가 매칭되면 true를 반환한다', () => {
    matchMediaMock.mockReturnValue({
      matches: true,
      media: '(min-width: 768px)',
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    });

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(true);
  });

  it('미디어 쿼리 변경 시 상태가 업데이트된다', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    expect(result.current).toBe(false);

    // 미디어 쿼리 변경 시뮬레이션
    act(() => {
      listeners.forEach((listener) => {
        listener({ matches: true } as MediaQueryListEvent);
      });
    });

    expect(result.current).toBe(true);
  });

  it('쿼리가 변경되면 새로운 matchMedia를 생성한다', () => {
    const { rerender } = renderHook(({ query }) => useMediaQuery(query), {
      initialProps: { query: '(min-width: 768px)' },
    });

    expect(matchMediaMock).toHaveBeenCalledWith('(min-width: 768px)');

    rerender({ query: '(min-width: 1024px)' });

    expect(matchMediaMock).toHaveBeenCalledWith('(min-width: 1024px)');
  });

  it('언마운트 시 이벤트 리스너가 제거된다', () => {
    const removeEventListenerMock = jest.fn();
    matchMediaMock.mockReturnValue({
      matches: false,
      media: '(min-width: 768px)',
      addEventListener: jest.fn(),
      removeEventListener: removeEventListenerMock,
      dispatchEvent: jest.fn(),
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    });

    const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    unmount();

    expect(removeEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('여러 미디어 쿼리를 동시에 사용할 수 있다', () => {
    const { result: mobile } = renderHook(() => useMediaQuery('(max-width: 767px)'));
    const { result: tablet } = renderHook(() =>
      useMediaQuery('(min-width: 768px) and (max-width: 1023px)')
    );
    const { result: desktop } = renderHook(() => useMediaQuery('(min-width: 1024px)'));

    expect(mobile.current).toBe(false);
    expect(tablet.current).toBe(false);
    expect(desktop.current).toBe(false);
  });

  it('복잡한 미디어 쿼리를 처리할 수 있다', () => {
    const complexQuery = '(min-width: 768px) and (max-width: 1024px) and (orientation: landscape)';
    const { result } = renderHook(() => useMediaQuery(complexQuery));

    expect(matchMediaMock).toHaveBeenCalledWith(complexQuery);
    expect(result.current).toBe(false);
  });

  it('prefers-color-scheme 미디어 쿼리를 처리할 수 있다', () => {
    matchMediaMock.mockReturnValue({
      matches: true,
      media: '(prefers-color-scheme: dark)',
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    });

    const { result } = renderHook(() => useMediaQuery('(prefers-color-scheme: dark)'));
    expect(result.current).toBe(true);
  });
});
