import { getData, ColouredAnswer } from './dataStore';
import { tokenUserId } from './session';
import { findQuiz, findQuestion, checkValidUser, getDuration } from './other';

interface QuestionDuplicateReturn {
  newQuestionId: number;
}

export function newAnswerId(answers: ColouredAnswer[]) {
  for (const answer of answers) {
    answer.answerId = getData().nextAnswerId;
    getData().nextAnswerId++;
  }
}

export function adminQuestionDuplicate (
  quizId: number,
  questionId: number,
  token: string): QuestionDuplicateReturn {
  const userId = tokenUserId(token);

  const quizToUpdate = findQuiz(quizId);

  checkValidUser(quizToUpdate, userId);

  const questToCopy = findQuestion(quizToUpdate, questionId);

  const data = getData();
  const newQuestionId = data.nextQuestionId;
  data.nextQuestionId++;
  const newQuestion = {
    question: questToCopy.question,
    duration: questToCopy.duration,
    points: questToCopy.points,
    answers: questToCopy.answers,
    questionId: newQuestionId,
    thumbnailUrl: questToCopy.thumbnailUrl,
  };

  newAnswerId(newQuestion.answers);

  quizToUpdate.questions.push(newQuestion);
  quizToUpdate.timeLastEdited = Date.now();
  quizToUpdate.duration = getDuration(quizToUpdate.questions);

  return {
    newQuestionId: newQuestionId
  };
}

// ADD DURATION!!
