import { getData } from './dataStore';
import { createSessionToken } from './session';

// Given a user's email and password returns their session token.
/**
 * @param { string } email
 * @param { string } password
 * @returns { string } token
 */
export function adminAuthLogin(email: string, password: string) {
  // Check the email is in the array
  const data = getData();
  const user = data.users.find(user => user.email === email);
  if (user) {
    // Check the password matches
    if (user.password === password) {
      user.numFailedPasswordsSinceLastLogin = 0;
      user.numSuccessfulLogins++;
      const token = createSessionToken(user.userId);
      return { token };
    } else {
      user.numFailedPasswordsSinceLastLogin++;
      return {
        error: 'password does not match the email'
      };
    }
  } else {
    return {
      error: 'user email not found!'
    };
  }
}
