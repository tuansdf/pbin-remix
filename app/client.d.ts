// globals.d.ts
export {};

declare global {
  interface Window {
    SALT: string | undefined | null;
  }
}
