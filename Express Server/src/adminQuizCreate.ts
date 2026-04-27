import { getData } from './dataStore';
import { tokenUserId } from './session';
import { Quiz } from './dataStore';
import { validateQuizName } from './other';
import HTTPError from 'http-errors';

// Given basic details about a new quiz, create one for the logged in user
/**
 * @param {number} token
 * @param {string} name
 * @param {string} description
 * @returns {quizId: number}
 */
export function adminQuizCreate(token: string, name: string, description: string) {
  // Check validity of inputs
  const authUserId = tokenUserId(token);

  validateQuizName(name, authUserId);

  if (description.length > 100) {
    throw HTTPError(400, 'Quiz description must be shorter than 100 characters in length');
  }

  // Import dataStore, check if userID exists in it
  const store = getData();
  const quizzes = store.quizzes;

  // create quiz and store it
  const newQuiz: Quiz = {
    quizId: store.nextQuizId,
    quizTitle: name,
    quizDescription: description,
    questions: [],
    timeCreated: Date.now(),
    timeLastEdited: Date.now(),
    ownerId: authUserId,
    thumbnailUrl: '',
    duration: 0,
  };
  // Please fix empty thumbnail URL!!
  quizzes.push(newQuiz);
  store.nextQuizId++;

  // Return ID of newly created quiz
  return {
    quizId: store.nextQuizId - 1
  };
}
