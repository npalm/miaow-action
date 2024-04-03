import { Octokit } from '@octokit/rest';
import * as core from '@actions/core';

export async function findMiauw(
  owner: string,
  repo: string,
  issue: number,
  token: string,
): Promise<number | undefined> {
  core.debug(`Finding miauw in ${owner}/${repo}#${issue}`);
  const octokit = new Octokit({
    auth: token,
  });

  // lookup issue comment for repo that contains the hidden markdown `<!-- miaow -->`. If a match return the latest one. Keep in mind the large number of comments (pageination).
  const comments = await octokit.paginate(octokit.issues.listComments, {
    owner,
    repo,
    issue_number: issue,
  });

  const miaowComment = comments.reverse().find(comment => comment.body?.includes('<!-- miaow -->'));
  if (miaowComment) {
    return miaowComment.id;
  } else {
    return undefined;
  }
}

export async function insertMiaow(
  owner: string,
  repo: string,
  issue: number,
  token: string,
  catImageUrl: string,
  commentId?: number,
): Promise<void> {
  const octokit = new Octokit({
    auth: token,
  });

  const comment = `![Miauw](${catImageUrl})\n<!-- miaow -->`;
  if (commentId) {
    await octokit.issues.updateComment({
      owner,
      repo,
      comment_id: commentId,
      body: comment,
    });
  } else {
    await octokit.issues.createComment({
      owner,
      repo,
      issue_number: issue,
      body: comment,
    });
  }
}
