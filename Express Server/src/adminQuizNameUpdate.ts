import { getData } from './dataStore';
import { tokenUserId } from './session';
import { findQuiz, checkValidUser, validateQuizName } from './other';

// Updates the name of the relevant quiz.
/**
 * @param {number} authUserId
 * @param {number} quizId
 * @param {string} name
 * @returns {}
 */
export function adminQuizNameUpdate(quizId: number, token: string, name: string) {
  const authUserId = tokenUserId(token);

  const data = getData();

  const quiz = findQuiz(quizId);

  checkValidUser(quiz, authUserId);

  let result = false;
  let quizPosition = 0;
  for (const key of data.quizzes) {
    if (key.quizId === quizId) {
      result = true;
    }
    if (result === false) {
      quizPosition++;
    }
  }

  validateQuizName(name, authUserId);

  data.quizzes[quizPosition].quizTitle = name;
  data.quizzes[quizPosition].timeLastEdited = Date.now();
  return {};
}
