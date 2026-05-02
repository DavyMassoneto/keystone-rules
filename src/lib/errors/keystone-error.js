export class KeystoneError extends Error {
  constructor({ message, code = 'KEYSTONE', exitCode = 1 }) {
    super(message);
    // this.constructor.name garante que erros tipados aparecem com o nome real
    // (ex.: "InvalidArgumentError") em stack traces e instanceof, em vez do
    // nome do tipo base "KeystoneError".
    this.name = this.constructor.name;
    this.code = code;
    this.exitCode = exitCode;
  }
}
