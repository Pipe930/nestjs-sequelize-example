import { StringTrimPipe } from './string-trim.pipe';

describe('StringTrimPipe', () => {

  let pipe: StringTrimPipe;

  const input = {
    name: '  John Doe  ',
    age: 30,
    email: '   john@example.com   ',
  }

  const expected = {
    name: 'John Doe',
    age: 30,
    email: 'john@example.com',
  }

  beforeEach(() => {
    pipe = new StringTrimPipe();
  })

  it('should be defined', () => {
    expect(new StringTrimPipe()).toBeDefined();
  });

  it('should trim a simple string', () => {
    const result = pipe.transform('   hello world   ', { type: 'body' });
    expect(result).toBe('hello world');
  });

  it('should trim and remove internal spaces in object strings', () => {
    expect(pipe.transform(input, { type: 'body' })).toEqual(expected);
  });

  it('should return value as is for non-string and non-object', () => {
    expect(pipe.transform(42, { type: 'query' })).toBe(42);
    expect(pipe.transform(null, { type: 'query' })).toBe(null);
    expect(pipe.transform(undefined, { type: 'query' })).toBe(undefined);
    expect(pipe.transform(true, { type: 'query' })).toBe(true);
  });
});
