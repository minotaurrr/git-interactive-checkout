#!/usr/bin/env node --es-module-specifier-resolution=node

import inquirer from 'inquirer';
import autoComplete from 'inquirer-autocomplete-prompt';
import { getChosenBranch } from './lib/prompt';
import { startSpinner } from './lib/util';
import { getBranches, checkoutToBranch } from './lib/git';

inquirer.registerPrompt('autocomplete', autoComplete);
(async () => {
  const spinner = startSpinner('Loading branches...');
  const branches = await getBranches();

  spinner.succeed();
  if (branches) {
    const branch = await getChosenBranch(branches);

    await checkoutToBranch(branch);
  }
})();
