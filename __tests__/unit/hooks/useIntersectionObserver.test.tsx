import { renderHook } from '@testing-library/react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

// IntersectionObserver 모킹
const mockObserve = jest.fn();
const mockUnobserve = jest.fn();
const mockDisconnect = jest.fn();

describe('useIntersectionObserver Hook', () => {
  beforeEach(() => {
    mockObserve.mockClear();
    mockUnobserve.mockClear();
    mockDisconnect.mockClear();

    global.IntersectionObserver = jest.fn().mockImplementation(() => ({
      observe: mockObserve,
      unobserve: mockUnobserve,
      disconnect: mockDisconnect,
    }));
  });

  it('ref와 isIntersecting 상태를 반환한다', () => {
    const { result } = renderHook(() => useIntersectionObserver());

    expect(result.current).toHaveLength(2);
    expect(result.current[0]).toHaveProperty('current');
    expect(typeof result.current[1]).toBe('boolean');
  });

  it('초기 isIntersecting 값은 false다', () => {
    const { result } = renderHook(() => useIntersectionObserver());
    const [, isIntersecting] = result.current;

    expect(isIntersecting).toBe(false);
  });

  it('ref 객체가 올바른 타입이다', () => {
    const { result } = renderHook(() => useIntersectionObserver());
    const [elementRef] = result.current;

    expect(elementRef).toEqual({ current: null });
  });

  it('옵션을 받아 초기화할 수 있다', () => {
    const options = {
      threshold: 0.5,
      rootMargin: '10px',
      freezeOnceVisible: true,
    };

    const { result } = renderHook(() => useIntersectionObserver(options));

    expect(result.current).toHaveLength(2);
  });

  it('threshold 배열을 옵션으로 받을 수 있다', () => {
    const { result } = renderHook(() => useIntersectionObserver({ threshold: [0, 0.5, 1] }));

    expect(result.current[1]).toBe(false);
  });

  it('freezeOnceVisible 옵션을 받을 수 있다', () => {
    const { result } = renderHook(() =>
      useIntersectionObserver({ freezeOnceVisible: true })
    );

    expect(result.current[1]).toBe(false);
  });

  it('rootMargin 옵션을 받을 수 있다', () => {
    const { result } = renderHook(() =>
      useIntersectionObserver({ rootMargin: '10px 20px' })
    );

    expect(result.current[0].current).toBeNull();
  });

  it('Hook이 정상적으로 cleanup된다', () => {
    const { unmount } = renderHook(() => useIntersectionObserver());

    expect(() => unmount()).not.toThrow();
  });
});
