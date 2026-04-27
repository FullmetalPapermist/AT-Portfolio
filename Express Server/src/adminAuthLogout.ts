import { invalidateToken, tokenUserId } from './session';
// Given a user's session token, logs them out of that session.
/**
 * @param { string } token
 * @returns {}
 */
export function adminAuthLogout(token: string) {
  tokenUserId(token);
  invalidateToken(token);
  return {};
}
