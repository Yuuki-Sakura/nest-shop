// import dayjs from 'dayjs';
import { customAlphabet } from 'nanoid';
export const generateSn = (prefix = '') => {
  // return (
  //   prefix +
  //   dayjs().format('YYYYMMDDHHmmssSSS') +
  //   customAlphabet('0123456789', 5)()
  // );
  return prefix + Date.now() + customAlphabet('0123456789', 5)();
};
