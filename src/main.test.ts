import { describe, it, expect, jest } from '@jest/globals';
import { findMiauw } from './github.js';
import { getRandomCatImage } from './cat.js';
import { run } from './main.js';
import * as core from '@actions/core';

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
  beforeEach(() => {
    delete process.env['INPUT_GITHUB_TOKEN'];
  });

  it('should call findMiauw, getRandomCatImage and insertMiaow', async () => {
    process.env['INPUT_GITHUB_TOKEN'] = '__fake_token__';
    await run();
    expect(findMiauw).toHaveBeenCalled();
    expect(getRandomCatImage).toHaveBeenCalled();
  });

  it('should error if token is not set.', async () => {
    const setFailed = jest.spyOn(core, 'setFailed');
    await run();
    expect(setFailed).toHaveBeenCalledWith('Inserting cat failed');
  });
});
