import { getData } from './dataStore';
import { validateEmail, validateNames } from './other';
import { tokenUserId } from './session';

export function adminUserDetailsNonPass(token: string, email: string, nameFirst: string, nameLast: string) {
  const userIndex = tokenUserId(token);
  const data = getData();

  validateEmail(email);
  validateNames(nameFirst, nameLast);

  data.users[userIndex].email = email;
  data.users[userIndex].firstName = nameFirst;
  data.users[userIndex].lastName = nameLast;

  return {};
}
