import ora from 'ora';

export const startSpinner = (message: string) => ora({ text: message, stream: process.stdout }).start();
