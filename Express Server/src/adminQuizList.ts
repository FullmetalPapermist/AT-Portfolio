import { getData } from './dataStore';
import { tokenUserId } from './session';

// Given an admin user's authUserId,
// provide a list of all quizzes that are owned by the currently logged in user

/**
 * @param {number} authUserId
 * @returns {quizes: [{quizId: number, name: string}]}
 */

export function adminQuizList(token: string) {
  const data = getData();

  const userId = tokenUserId(token);

  if (userId !== -1) {
    const userQuizzes = data.quizzes.filter((quiz) => quiz.ownerId === userId);

    return {
      quizzes: userQuizzes.map((quiz) => ({
        quizId: quiz.quizId,
        name: quiz.quizTitle,
      })),
    };
  }

  return { error: 'AuthUserId is not a valid user' };
}
