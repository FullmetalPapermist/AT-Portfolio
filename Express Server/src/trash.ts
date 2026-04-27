import { getData } from './dataStore';
import { tokenUserId } from './session';
import HTTPError from 'http-errors';

// View quizzes in the trash for the currently logged in user
/**
 * @param {string} token
 * @param {number} quizId
 * @returns {array}
 */
export function adminQuizTrashDetails(token: string) {
  // Import dataStore, check if authUserID exist in it
  const store = getData();
  const userId = tokenUserId(token);

  const quizzes = [];

  for (const item of store.trash) {
    if (item.ownerId === userId) {
      quizzes.push({ quizId: item.quizId, name: item.quizTitle });
    }
  }

  return { quizzes: quizzes };
}

// Restore a quiz from the trash from a given quizId
/**
 * @param {string} token
 * @param {number} quizId
 * @returns {}
 */
export function adminQuizTrashRestore(token: string, quizId: number) {
  // Import dataStore, check if authUserID and quizId exist in it
  const store = getData();
  const quizzes = store.quizzes;
  const trash = store.trash;

  // Get authUserId from token
  const authUserId = tokenUserId(token);

  if (!trash.find(item => item.quizId === quizId) && !quizzes.find(item => item.quizId === quizId)) {
    throw HTTPError(403, 'Valid token but user is not owner');
  }

  const foundQuiz = trash.find(item => item.quizId === quizId);

  if (foundQuiz.ownerId !== authUserId) {
    throw HTTPError(403, 'you are not the owner');
  }

  if (quizzes.find(item => item.quizTitle === foundQuiz.quizTitle)) {
    throw HTTPError(400, 'quiz name already used by existing quiz');
  }

  foundQuiz.timeLastEdited = Date.now();
  quizzes.push(foundQuiz);
  trash.splice(trash.findIndex(item => item.quizId === quizId), 1);
  return {};
}

// Restore a quiz from the trash from a given quizId
/**
 * @param {string} token
 * @param {number} quizId
 * @returns {}
 */
export function adminQuizTrashEmpty(token: string, quizIds: string) {
  // Import dataStore
  const store = getData();
  const trash = store.trash;
  // Get authUserId from token
  const authUserId = tokenUserId(token);

  quizIds = JSON.parse(quizIds);

  // Check each quizId to be valid
  for (const quizId of quizIds) {
    if (typeof trash[trash.findIndex((quiz) => quiz.quizId === parseInt(quizId))] === 'undefined') {
      throw HTTPError(400, 'one or more of the quizIDs is not currently in the trash');
    }
    if (trash[trash.findIndex((quiz) => quiz.quizId === parseInt(quizId))].ownerId !== authUserId) {
      throw HTTPError(403, 'you are not the owner of one or more of these quizzes');
    }
  }

  // Delete the indexes
  for (const quizId of quizIds) {
    trash.splice(trash.findIndex((quiz) => quiz.quizId === parseInt(quizId)), 1);
  }
  return {};
}
