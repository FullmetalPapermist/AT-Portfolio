import { getData, Error } from './dataStore';
import { tokenUserId } from './session';
import { arrayMove } from './arrayMove';

export function adminQuestionMove(
  token: string,
  quizId: number,
  questionIdToMove: number,
  newPosition: number
): Error | Record<string, never> {
  const userId = tokenUserId(token);

  if (userId === -1) {
    return { error: 'invalid token' };
  }

  const data = getData();

  const quizToUpdate = data.quizzes.find((quiz) => quiz.quizId === quizId);
  if (quizToUpdate === undefined) {
    return { error: 'quiz not found' };
  }

  if (quizToUpdate.ownerId !== userId) {
    return { error: 'user is not owner of quiz' };
  }

  const questionIndex = quizToUpdate.questions.findIndex(
    (question) => question.questionId === questionIdToMove
  );

  if (questionIndex === -1) {
    return { error: 'question not found' };
  }

  if (
    newPosition < 0 ||
    newPosition >= quizToUpdate.questions.length ||
    newPosition === questionIndex
  ) {
    return { error: 'Invalid new position' };
  }

  arrayMove(quizToUpdate.questions, questionIndex, newPosition);

  return {};
}
