import { getSession, generatePlayerId } from './other';
import { STATE, Answer } from './dataStore';
import HTTPError from 'http-errors';

export function playerJoin(sessionId: string, name: string) {
  const session = getSession(sessionId);
  if (session.state !== STATE.LOBBY) {
    throw HTTPError(400, 'Session not in lobby');
  }

  if (session.players.find((player) => player.playerName === name)) {
    throw HTTPError(400, 'Name already in lobby');
  }

  const playerId = generatePlayerId();

  const currentAnswers: Answer[] = [];

  const player = {
    playerId: playerId,
    playerName: name,
    playerPoints: 0,
    quizSessionId: sessionId,
    currentAnswers: currentAnswers,
    answerTime: 0,
  };

  session.players.push(player);

  return {
    playerId: playerId
  };
}
