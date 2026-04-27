import { getData } from './dataStore';
import { validatePassword } from './other';
import { tokenUserId } from './session';
import HTTPError from 'http-errors';

export function adminUserPassword(token: string, oldPassword: string, newPassword: string) {
  const authUserId = tokenUserId(token);
  const data = getData();

  const user = data.users.find((user) => user.userId === authUserId);

  if (!(oldPassword.localeCompare(user.password) === 0)) {
    throw HTTPError(400, 'Old Password is not the correct old password');
  }

  if (oldPassword.localeCompare(newPassword) === 0) {
    throw HTTPError(400, 'Old Password and New Password match exactly');
  }

  for (const passwords of user.prevPasswords) {
    if (newPassword.localeCompare(passwords) === 0) {
      throw HTTPError(400, 'New Password has already been used before by this user');
    }
  }

  validatePassword(newPassword);

  user.password = newPassword;
  user.prevPasswords.push(newPassword);

  return {};
}
