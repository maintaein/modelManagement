/**
 * Jest 설정 확인용 예시 테스트
 */

describe('Jest 설정 테스트', () => {
  it('Jest가 정상적으로 동작한다', () => {
    expect(1 + 1).toBe(2);
  });

  it('TypeScript가 정상적으로 컴파일된다', () => {
    const greeting = (name: string): string => `Hello, ${name}!`;
    expect(greeting('World')).toBe('Hello, World!');
  });
});
