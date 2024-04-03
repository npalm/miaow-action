import { describe, it, expect, jest } from '@jest/globals';
import { findMiauw } from './github';
import { getRandomCatImage } from './cat';

jest.mock('./github', () => ({
  findMiauw: jest.fn(),
  insertMiaow: jest.fn(),
}));

jest.mock('./cat', () => ({
  getRandomCatImage: jest.fn().mockReturnValue('https://http.cat/images/200.jpg'),
}));

jest.mock('@actions/github', () => ({
  context: {
    repo: {
      owner: 'owner',
      repo: 'repo',
    },
    issue: {
      number: 1,
    },
  },
}));

describe('Main', () => {
  it('should call findMiauw, getRandomCatImage and insertMiaow', async () => {
    process.env['INPUT_GITHUB_TOKEN'] = '__fake_token__';

    await import('./main');
    expect(findMiauw).toHaveBeenCalled();
    expect(getRandomCatImage).toHaveBeenCalled();
  });

  it('should error if token is not set.', async () => {
    try {
      await import('./main');
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});
