/* eslint-disable no-console */
import { exec as execSync } from 'child_process';
import symbol from 'log-symbols';
import { promisify } from 'util';
import { Branch } from '../types';
import { startSpinner } from './util';

const exec = promisify(execSync);

export const getBranches = async () => {
  const { stdout: branches, stderr } = await exec('git branch -av --sort=-committerdate', {
    maxBuffer: 1024 * 1024 * 10,
  });

  if (branches) {
    const choices = String(branches)
      .split(/\n/)
      .filter((branch) => !!branch.trim())
      .map((branch) => {
        const [, flag, value, commitMessage] = branch.match(/([* ]) +([^ ]+) +(.+)/) as string[];

        return { value, commitMessage, disabled: flag === '*' } as Branch;
      });

    return choices;
  }

  if (stderr) console.error(stderr);
  return null;
};

export const checkoutToBranch = async (branch: string) => {
  if (!branch) return;

  const branchName = branch.replace(/remotes\/origin\//, '');
  const spinner = startSpinner(`Checking out branch ${branchName}`);

  const { stderr, stdout } = await exec(`git switch ${branchName}`, { maxBuffer: 1024 * 1024 * 10 });

  console.log(stdout);
  if (stderr) console.log(stderr);

  spinner.stopAndPersist({ symbol: symbol.success, text: `Successfully checked out ${branchName}` });
};
