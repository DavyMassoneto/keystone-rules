import { error, KeystoneError } from '#lib';

export function handleError(err) {
  if (err instanceof KeystoneError) {
    error(err.message);
    return err.exitCode;
  }
  error(err);
  return 1;
}
