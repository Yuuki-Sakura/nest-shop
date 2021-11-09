import { customAlphabet } from 'nanoid';
export const nanoid = (size: number) =>
  customAlphabet(
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    size,
  )();
