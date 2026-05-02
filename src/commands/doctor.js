import {
  print,
  runDoctorChecks,
  formatHumanOutput,
  formatJsonOutput,
} from '#lib';

export const doctorCommand = {
  name: 'doctor',
  description: 'Run diagnostic checks on keystone-rules installation',
  run: async (commands, parsed) => {
    const results = await runDoctorChecks();
    let output;
    if (parsed.flags.json) {
      output = formatJsonOutput(results);
    } else {
      const colors =
        process.stdout.isTTY === true && !process.env.NO_COLOR;
      output = formatHumanOutput(results, { colors });
    }
    print(output);
    return results.some((r) => r.status === 'error') ? 1 : 0;
  },
};
