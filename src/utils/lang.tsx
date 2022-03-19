export const lang = (t: string, ...args: string[]) =>
    args.reduce((a, x, i) => a.replace(`{${i}}`, x), t);
