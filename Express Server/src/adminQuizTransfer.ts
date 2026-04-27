// I cannot do the order of returning error cases 401,403 400 as sometimes the quiz isnt valid and that is a 400 error

import { getData } from './dataStore';
import { tokenUserId } from './session';
import HTTPError from 'http-errors';
import { findQuiz, checkValidUser } from './other';

export function adminQuizTransfer(quizId: number, token: string, userEmail: string) {
  const authUserId = tokenUserId(token);

  const data = getData();
  const user = data.users.find((user) => user.userId === authUserId);
  const quiz = findQuiz(quizId);
  checkValidUser(quiz, authUserId);

  const userTranferee = data.users.find(item => item.email === userEmail);
  if (!userTranferee) {
    throw HTTPError(400, 'userEmail is not a real user');
  }

  if (userEmail.localeCompare(user.email) === 0) {
    throw HTTPError(400, 'userEmail is the current logged in user');
  }

  const quizName = quiz.quizTitle;
  for (const quizzes of data.quizzes) {
    if ((quizzes.quizTitle.localeCompare(quizName) === 0) && quizzes.ownerId === userTranferee.userId) {
      throw HTTPError(400, 'Quiz ID refers to a quiz that has a name that is already used by the target user');
    }
  }

  let quizIndex = 0;
  let found = false;
  for (const quizzes of data.quizzes) {
    if ((quizzes.quizTitle.localeCompare(quizName) === 0) && quizzes.ownerId === authUserId && found === false) {
      found = true;
    }

    if (found === false) {
      quizIndex++;
    }
  }

  data.quizzes[quizIndex].ownerId = userTranferee.userId;

  return {};
}
