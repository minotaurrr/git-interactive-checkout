import inquirer from 'inquirer';
import { Branch } from '../types';

export const getChosenBranch = async (branches: Branch[]) => {
  const { branch } = await inquirer.prompt([
    {
      type: 'autocomplete',
      name: 'branch',
      message: 'Type branch name to search:',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // eslint-disable-next-line no-shadow
      source: (answers: any, input: string) => {
        if (input) {
          const filtered = branches.filter((b: Branch) => b.value.toLowerCase().includes(input.toLowerCase()));

          return Promise.resolve(filtered);
        }

        return Promise.resolve(branches);
      },
      pageSize: 20,
    },
  ]);

  return branch;
};
