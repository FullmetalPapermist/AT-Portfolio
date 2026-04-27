import { getPlayer, checkQuestionPosition } from './other';
import { STATE } from './dataStore';
import HTTPError from 'http-errors';

export function playerQuestionSubmit(playerId: number, questionPosition: number, answerIds: number[]): Record<string, never> {
  const obj = getPlayer(playerId);

  if (obj.quizSession.state !== STATE.QUESTION_OPEN) {
    throw HTTPError(400, 'State is not open');
  }

  checkQuestionPosition(questionPosition, obj.quizSession);

  if (answerIds.length === 0) {
    throw HTTPError(400, 'Answers cannot be empty');
  }

  const answers = obj.quizSession.metadata.questions[questionPosition - 1].answers;

  const currentAnswers = [];
  const ansIdsSet = new Set([]);
  for (const answerId of answerIds) {
    ansIdsSet.add(answerId);
    currentAnswers.push(answers.find((answer) => answer.answerId === answerId));
  }

  if (ansIdsSet.size !== answerIds.length) {
    throw HTTPError(400, 'No duplicate answers');
  }

  const ansIdsArray: number[] = [];
  for (const answer of answers) {
    ansIdsArray.push(answer.answerId);
  }

  if (!answerIds.some((id) => ansIdsArray.includes(id))) {
    throw HTTPError(400, 'Invalid answer Id');
  }

  for (const answer of currentAnswers) {
    obj.player.currentAnswers.push(answer);
  }

  obj.player.answerTime = Math.round(Date.now() / 1000) - obj.quizSession.questionStart;
  console.log(obj.player);
  return {

  };
}
