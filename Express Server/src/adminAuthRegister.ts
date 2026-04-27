import { getData, User } from './dataStore';
import { validatePassword, validateEmail, validateNames } from './other';
import { createSessionToken } from './session';

/**
 * @param {string} email
 * @param {string} password
 * @param {string} nameFirst
 * @param {string} nameLast
 * @returns {token: string }
 */
export function adminAuthRegister(email: string, password: string, nameFirst: string, nameLast: string) {
  const data = getData();

  validateEmail(email);
  validateNames(nameFirst, nameLast);
  validatePassword(password);

  const newUser: User = {
    userId: data.nextUserId,
    email: email,
    password: password,
    prevPasswords: [password],
    firstName: nameFirst,
    lastName: nameLast,
    timeCreated: Date.now(),
    numFailedPasswordsSinceLastLogin: 0,
    numSuccessfulLogins: 1
  };

  data.nextUserId++;
  data.users.push(newUser);
  const token = createSessionToken(newUser.userId);

  return { token };
}
