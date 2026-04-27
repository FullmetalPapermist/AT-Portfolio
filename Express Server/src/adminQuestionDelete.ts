import { getData, Error } from './dataStore';
import { tokenUserId } from './session';
// import { getDuration } from './other';

// Deletes a question from a quiz
export function adminQuestionDelete(
  token: string,
  quizId: number,
  questionIdToDelete: number
): Error | Record<string, never> {
  const userId = tokenUserId(token);

  const data = getData();

  const quizToUpdate = data.quizzes.find((quiz) => quiz.quizId === quizId);
  if (quizToUpdate === undefined) {
    return { error: 'quiz not found' };
  }

  if (quizToUpdate.ownerId !== userId) {
    return { error: 'user is not owner of quiz' };
  }

  const questionIndex = quizToUpdate.questions.findIndex(
    (question) => question.questionId === questionIdToDelete
  );

  if (questionIndex === -1) {
    return { error: 'question not found' };
  }

  // uncomment when side effect tests are complete
  // quizToUpdate.duration = getDuration(quizToUpdate.questions);
  quizToUpdate.questions.splice(questionIndex, 1);

  return {};
}

// ADD DURATION!!
