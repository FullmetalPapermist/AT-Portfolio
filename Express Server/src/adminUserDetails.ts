import { getData } from './dataStore';
import { tokenUserId } from './session';

// Given an admin user's authUserId, return details about the user
/**
 * @param {number} authUserId
 * @returns {quizId: number}
 */

export function adminUserDetails(token: string) {
  const data = getData();

  const userId = tokenUserId(token);

  if (userId !== -1) {
    const adminUser = data.users.find((user) => user.userId === userId);

    if (adminUser) {
      return {
        user: {
          authUserId: adminUser.userId,
          name: adminUser.firstName + ' ' + adminUser.lastName,
          email: adminUser.email,
          numSuccessfulLogins: adminUser.numSuccessfulLogins,
          numFailedPasswordsSinceLastLogin: adminUser.numFailedPasswordsSinceLastLogin,
        },
      };
    }
  }

  return {
    error: 'Authentication failed. Token is not valid or admin user not found.',
  };
}
