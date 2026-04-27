import { setData, getData, Quiz, Question, createDataStore, QuizSession } from './dataStore';
import isEmail from 'validator/lib/isEmail.js';
import HTTPError from 'http-errors';

// // Reset the state of the application back to the start
export function clear(): Record<string, never> {
  setData(createDataStore());
  return {};
}

/**
 * Helper function which returns if a string has numbers or not
 * @param {*} str
 * @returns
 */
export function hasNumbers(str: string) {
  if (str.match(/\d+/g) != null) {
    return true;
  } else {
    return false;
  }
}

export function validatePassword(password: string) {
  if (password.length < 8) {
    throw HTTPError(400, 'New Password is less than 8 characters');
  }

  if (!hasNumbers(password)) {
    throw HTTPError(400, 'password needs to contain both letters and numbers');
  }

  let result = false;
  for (let passCounter = 0; passCounter < password.length; passCounter++) {
    if (isCharacterOnly(password[passCounter])) {
      result = true;
    }
  }

  if (result === false) {
    throw HTTPError(400, 'password needs to contain both letters and numbers');
  }
}

export function validateEmail(email: string) {
  if (!isEmail(email)) {
    throw HTTPError(400, 'invalid email');
  }

  const data = getData();

  for (const user of data.users) {
    if (email.localeCompare(user.email) === 0) {
      throw HTTPError(400, 'error email is already in use');
    }
  }
}

export function validateNames(nameFirst: string, nameLast: string) {
  for (let counter = 0; counter < nameFirst.length; counter++) {
    if (!isCharacterValid(nameFirst[counter])) {
      throw HTTPError(400, 'invalid first name, only use characters');
    }
  }

  if (!(nameFirst.length >= 2 && nameFirst.length <= 20)) {
    throw HTTPError(400, 'invalid first name character length');
  }

  for (let counter = 0; counter < nameLast.length; counter++) {
    if (!isCharacterValid(nameLast[counter])) {
      throw HTTPError(400, 'invalid last name, only use characters');
    }
  }

  if (!(nameLast.length >= 2 && nameLast.length <= 20)) {
    throw HTTPError(400, 'invalid last name character length');
  }
}

export function validateQuizName(name: string, authUserId: number) {
  if (!name) {
    throw HTTPError(400, 'Empty quiz name');
  }

  if (!(/^[a-zA-Z0-9\s]+$/).test(name)) {
    throw HTTPError(400, 'Invalid quiz name. Alphanumeric characters only');
  }

  if (name.length < 3 || name.length > 30) {
    throw HTTPError(400, 'Quiz name must be between 3 and 30 characters in length');
  }

  const store = getData();
  const quizzes = store.quizzes;

  const sameAuthId = quizzes.filter(item => item.ownerId === authUserId);
  if (sameAuthId.find(item => item.quizTitle === name)) {
    throw HTTPError(400, 'Name is already used by the current logged in user for another quiz');
  }
}

/**
 * Helper function to determine if a char is a letter, apostrophe, hyphen or space
 * @param {*} char
 * @returns
 */
export function isCharacterValid(char: string) {
  return (/[a-zA-Z'\- ]/).test(char);
}

/**
 * Helper function to determine if a char is a letter, apostrophe, hyphen or space
 * @param {*} char
 * @returns
 */
export function isCharacterOnly(char: string) {
  return (/[a-zA-Z]/).test(char);
}

export function findQuiz(quizId: number) {
  const data = getData();
  const quiz = data.quizzes.find((quiz) => quiz.quizId === quizId);
  if (quiz === undefined) {
    throw HTTPError(400, 'Quiz not found');
  }
  return quiz;
}

export function checkValidUser(quiz: Quiz, userId: number) {
  if (quiz.ownerId !== userId) {
    throw HTTPError(403, 'User is not owner');
  }
}

export function findQuestion(quiz: Quiz, questionId: number): Question {
  const question = quiz.questions.find((question) => question.questionId === questionId);
  if (!question) {
    throw HTTPError(400, 'Question not found');
  }
  return question;
}

export function shuffleList(array: unknown[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export function getDuration(questions: Question[]): number {
  let quizDuration = 0;
  for (const question of questions) {
    quizDuration += question.duration;
  }
  return quizDuration;
}

export function getSession(sessionId: string): QuizSession {
  const data = getData();
  const session = data.quizSessions.find((quizSession) => quizSession.sessionId === sessionId);
  if (!session) {
    throw HTTPError(400, 'Session not found');
  }
  return session;
}

export function generatePlayerId(): number {
  const nextPlayerId = getData().nextPlayerId;
  if (nextPlayerId === 0) {
    getData().nextPlayerId += Math.floor(Math.random() * 10) + 1;
    return generatePlayerId();
  }
  getData().nextPlayerId += Math.floor(Math.random() * 10) + 1;
  return nextPlayerId;
}

export function getPlayer(playerId: number) {
  const sessions = getData().quizSessions;
  for (const session of sessions) {
    const playerFound = session.players.find((player) => player.playerId === playerId);
    if (playerFound !== undefined) {
      return { player: playerFound, quizSession: session };
    }
  }
  throw HTTPError(400, 'Player not found');
}

export function checkQuestionPosition(questionPosition: number, quizSession: QuizSession) {
  if (quizSession.questionPosition !== questionPosition) {
    throw HTTPError(400, 'invalid question position');
  }

  if (questionPosition - 1 >= quizSession.metadata.questions.length) {
    throw HTTPError(400, 'invalid question position');
  }
}
