import { getData } from './dataStore';
import { tokenUserId } from './session';
import HttpError from 'http-errors';

// Get all of the relevant information about the current quiz.
/**
 * @param { string } token
 * @param { number } quizId
 * @returns {
*  quizId: number,
*  name: string,
*  timeCreated: number,
*  timeLastEdited: number,
*  description: string,
*  questions: array,
* }
*/
export function adminQuizInfo (token: string, quizId: number) {
  const data = getData();
  // Check if authUserId is valid
  // Check if the user owns the quiz

  const user = tokenUserId(token);
  const quiz = data.quizzes.find(item => item.quizId === quizId);
  if (quiz.ownerId === user) {
    return {
      quizId: quiz.quizId,
      name: quiz.quizTitle,
      timeCreated: quiz.timeCreated,
      timeLastEdited: quiz.timeLastEdited,
      description: quiz.quizDescription,
      questions: quiz.questions,
      duration: quiz.duration,
      // thumbnailURL:
    };
  } else {
    throw HttpError(403, 'User does not own this quiz');
  }
}
