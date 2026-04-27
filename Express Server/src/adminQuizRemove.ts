import { getData } from './dataStore';
import { tokenUserId } from './session';
import HTTPError from 'http-errors';

// Given a particular quiz, permanently remove the quiz
/**
 * @param {string} token
 * @param {number} quizId
 * @returns {}
 */
export function adminQuizRemove(token: string, quizId: number) {
  // Import dataStore, check if authUserID and quizId exist in it
  const store = getData();
  const quizzes = store.quizzes;

  // Get authUserId from token
  const authUserId = tokenUserId(token);

  // Check that the quiz is owned by the user
  const sameQuizId = quizzes.find(item => item.quizId === quizId);
  if (sameQuizId.ownerId !== authUserId) {
    throw HTTPError(403, 'Corresponding quiz is not owned by you');
  }
  // Place quiz into trash
  sameQuizId.timeLastEdited = Date.now();
  store.trash.push(sameQuizId);
  quizzes.splice(quizzes.findIndex((quiz) => quiz.quizId === quizId), 1);

  return {};
}
