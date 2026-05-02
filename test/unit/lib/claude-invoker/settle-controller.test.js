import { describe, it, expect, vi, afterEach } from 'vitest';
import { SettleController } from '#lib';

afterEach(() => {
  vi.useRealTimers();
});

describe('SettleController', () => {
  it('invokes the callback with the value when settling for the first time', () => {
    const controller = new SettleController();
    const cb = vi.fn();
    controller.settle(cb, 'result');
    expect(cb).toHaveBeenCalledWith('result');
  });

  it('does not invoke the callback again when settling twice', () => {
    const controller = new SettleController();
    const cb = vi.fn();
    controller.settle(cb, 'first');
    controller.settle(cb, 'second');
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb).toHaveBeenCalledWith('first');
  });

  it('clears the registered timer when settling', () => {
    vi.useFakeTimers();
    const controller = new SettleController();
    const fired = vi.fn();
    controller.setTimer(setTimeout(fired, 1000));
    controller.settle(() => {}, null);
    vi.advanceTimersByTime(2000);
    expect(fired).not.toHaveBeenCalled();
  });

  it('does not throw when settling without a registered timer', () => {
    const controller = new SettleController();
    expect(() => controller.settle(() => {}, null)).not.toThrow();
  });
});
