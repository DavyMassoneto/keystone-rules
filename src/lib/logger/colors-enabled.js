export function colorsEnabled() {
  if (process.stdout.isTTY !== true) {
    return false;
  }
  if (process.env.NO_COLOR) {
    return false;
  }
  return true;
}
