declare class AsyncTaskQueue {
  maxConcurrency: number;
  queue: Array<() => Promise<unknown>>;
  running: number;

  constructor(maxConcurrency?: number);
  addTask(tasks: Array<() => Promise<unknown>>): void;
  run(): void;
}

export default AsyncTaskQueue;
