// deno-lint-ignore-file no-explicit-any
const g = globalThis as any;

if (!g.Deno) {
  g.Deno = {
    env: {
      get: (key: string): string | undefined => process.env[key],
      has: (key: string): boolean => key in process.env,
      toObject: () => ({ ...process.env })
    }
  };
}

export {};