import { exec } from 'child_process';
import { checkoutToBranch, getBranches } from './git';

const branchOutput = `branch-1*  some-hash-1 some commit message 1
branch-2  some-hash-2 some commit message 2`;

jest.mock('./util', () => ({
  startSpinner: jest.fn().mockImplementation(() => ({
    stopAndPersist: jest.fn(),
  })),
}));
jest.mock('util', () => ({
  promisify: jest.fn((f) => f),
}));
jest.mock('child_process', () => ({
  exec: jest.fn(),
}));

describe('Git commands', () => {
  describe('getBranches()', () => {
    it('should return branches', async () => {
      (exec as unknown as jest.Mock).mockImplementation(() => Promise.resolve({ stdout: branchOutput, stderr: null }));
      const branches = await getBranches();

      expect(exec).toHaveBeenCalled();
      expect(branches).toEqual([
        {
          disabled: true,
          hint: 'some commit message 1',
          value: 'some-hash-1',
        },
        {
          disabled: false,
          hint: 'some commit message 2',
          value: 'some-hash-2',
        },
      ]);
    });
  });

  describe('checkoutToBranch()', () => {
    it('should switch branch', async () => {
      (exec as unknown as jest.Mock).mockImplementation(() => Promise.resolve({ stderr: null, stdout: '' }));
      await checkoutToBranch('random');
      expect(exec).toHaveBeenCalledWith('git switch random', expect.anything());
    });
  });
});
