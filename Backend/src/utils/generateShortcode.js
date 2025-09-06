import { v4 as uuidv4 } from 'uuid';
export const generateShortcode = () => {
  return uuidv4().replace(/-/g, '').substring(0, 6).toLowerCase();
};
export const isValidShortcode = (code) => {
  if (!code || typeof code !== 'string') return false;
  if (code.length < 4 || code.length > 10) return false;
  return /^[a-zA-Z0-9]+$/.test(code);
};
