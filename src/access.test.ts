import { includesKey } from './access';

describe('Access TEST', () => {
  it('Test Permission Includes', () => {
    const permission = ['a', 'b', 'c'];
    const data = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }];
    expect(includesKey(permission, data)).toBe(true);
  });
});
