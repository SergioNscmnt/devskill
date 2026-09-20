export class DevskillError extends Error {
  constructor(
    message: string,
    readonly code = 'DEVSKILL_ERROR',
  ) {
    super(message);
    this.name = 'DevskillError';
  }
}
