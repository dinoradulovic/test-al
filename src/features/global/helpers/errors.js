export class RandomError extends Error {
  constructor(errorMessage) {
    super(errorMessage);
    this.name = this.constructor.name;
  }
}
