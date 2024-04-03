import * as core from '@actions/core';
import { context } from '@actions/github';
import { findMiauw, insertMiaow } from './github.js';
import { getRandomCatImage } from './cat.js';

export async function run(): Promise<void> {
  try {
    const githubToken = core.getInput('GITHUB_TOKEN', { required: true });
    core.setSecret(githubToken);

    core.debug(`Context: ${JSON.stringify(context, null, 2)}`);

    const id = await findMiauw(context.repo.owner, context.repo.repo, context.issue.number, githubToken);
    core.debug(`Miauw id: ${id}`);
    const image = await getRandomCatImage();
    core.debug(`Cat image: ${image}`);
    await insertMiaow(context.repo.owner, context.repo.repo, context.issue.number, githubToken, image, id);
    core.debug('Miauw inserted');
  } catch (error) {
    core.setFailed('Inserting cat failed');
  }
}

run();
