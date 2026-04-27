import { tokenUserId } from './session';
import { findQuiz, checkValidUser } from './other';
import HTTPError from 'http-errors';

// Updates description of relevant quiz
export function adminQuizDescriptionUpdate (
  token: string,
  quizId: number,
  description: string
): Record<string, never> {
  const userId = tokenUserId(token);

  const quizToUpdate = findQuiz(quizId);

  checkValidUser(quizToUpdate, userId);

  if (description.length > 100) {
    throw HTTPError(400, 'description cannot exceed 100 characters');
  }

  quizToUpdate.quizDescription = description;
  quizToUpdate.timeLastEdited = Date.now();

  return {};
}
