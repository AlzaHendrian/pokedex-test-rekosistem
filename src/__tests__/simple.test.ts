// Pure Jest test without any Expo dependencies
describe('Basic Jest Test - Pure', () => {
  test('should work with numbers', () => {
    expect(1 + 1).toBe(2);
  });

  test('should work with strings', () => {
    const message = 'hello world';
    expect(message).toContain('world');
  });

  test('should work with objects', () => {
    const obj = { name: 'test', value: 42 };
    expect(obj.name).toBe('test');
    expect(obj.value).toBe(42);
  });

  test('should work with async/await', async () => {
    const result = await Promise.resolve('async works');
    expect(result).toBe('async works');
  });
});