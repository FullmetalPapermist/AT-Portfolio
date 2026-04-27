import { Answer } from './dataStore';
import { tokenUserId } from './session';
import { findQuiz, checkValidUser, findQuestion, getDuration } from './other';
import { questionChecks, colourAnswers } from './adminQuestionCreate';

export function adminQuestionUpdate(
  quizId: number,
  questionId: number,
  token: string,
  question: string,
  duration: number,
  points: number,
  answers: Answer[],
  thumbnailUrl: string
): Record<string, never> {
  const userId = tokenUserId(token);

  const quizToUpdate = findQuiz(quizId);

  checkValidUser(quizToUpdate, userId);

  questionChecks(quizToUpdate, duration, points, question, answers, thumbnailUrl);

  const questToUpdate = findQuestion(quizToUpdate, questionId);

  questToUpdate.question = question;
  questToUpdate.duration = duration;
  questToUpdate.points = points;
  questToUpdate.answers = colourAnswers(answers);
  questToUpdate.thumbnailUrl = thumbnailUrl;

  quizToUpdate.timeLastEdited = Date.now();
  quizToUpdate.duration = getDuration(quizToUpdate.questions);

  return {

  };
}

// ADD DURATION!!
