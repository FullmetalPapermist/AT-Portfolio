import { getPlayer, checkQuestionPosition } from './other';
import { STATE } from './dataStore';
import HTTPError from 'http-errors';

export function playerQuestionInfo (playerId: number, questionPosition: number) {
  const obj = getPlayer(playerId);
  if (obj.quizSession.state === STATE.LOBBY || obj.quizSession.state === STATE.END) {
    throw HTTPError(400, 'Session in lobby or end');
  }

  checkQuestionPosition(questionPosition, obj.quizSession);

  return obj.quizSession.metadata.questions[questionPosition - 1];
}
