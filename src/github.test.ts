import { describe, it, expect, jest } from '@jest/globals';
import { findMiauw, insertMiaow } from './github.js';

const mockOctokit = {
  paginate: jest.fn(),
  issues: { listComments: jest.fn(), createComment: jest.fn(), updateComment: jest.fn() },
};

jest.mock('@octokit/rest', () => ({
  Octokit: jest.fn().mockImplementation(() => mockOctokit),
}));

describe('Write comment', () => {
  it('should write a new comment with "miauw"', async () => {
    // how to mock the paginate function when called with octokit.issues.listComments as first argument?
    mockOctokit.issues.createComment = jest.fn().mockImplementation(() => {
      return { data: { id: 1 } };
    });

    expect(await insertMiaow('owner', 'repo', 1, '__invalid_token__', 'catImageUrl', 1)).resolves;
  });

  it('should update a comment with "miauw"', async () => {
    // how to mock the paginate function when called with octokit.issues.listComments as first argument?
    mockOctokit.issues.updateComment = jest.fn().mockImplementation(() => {
      return { data: { id: 1 } };
    });

    expect(await insertMiaow('owner', 'repo', 1, '__invalid_token__', 'catImageUrl')).resolves;
  });
});

describe('Comment finder', () => {
  it('should find comments with "miauw"', async () => {
    mockOctokit.paginate.mockImplementationOnce(async method => {
      if (method === mockOctokit.issues.listComments) {
        return Promise.resolve([
          {
            id: 1,
            body: 'some text before\n<!-- miaow -->\nsome text after',
          },
          {
            id: 2,
            body: 'some text before\n<!-- miaow -->\nsome text after',
          },
          {
            id: 3,
            body: 'some data',
          },
          {
            id: 4,
          },
        ]);
      }
    });

    const miauwId = await findMiauw('owner', 'repo', 1, '__invalid_token__');
    expect(miauwId).toBe(2);
  });

  it('should find comments with "miauw"', async () => {
    mockOctokit.paginate.mockImplementationOnce(async method => {
      if (method === mockOctokit.issues.listComments) {
        return Promise.resolve([
          {
            id: 1,
            body: 'some data',
          },
        ]);
      }
    });

    const miauwId = await findMiauw('owner', 'repo', 1, '__invalid_token__');
    expect(miauwId).toBeUndefined();
  });
});
