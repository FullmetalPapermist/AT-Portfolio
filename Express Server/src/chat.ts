import { getData, Message } from './dataStore';
import HTTPError from 'http-errors';

// Given a playerId and messageBody, send a message to everyone
// in the session
/**
 * @param { number } playerId
 * @param { string } messageBody
 * @returns {}
 */
export function chatSend(playerId: number, messageBody: string) {
  // Import dataStore, get sessions
  const sessions = getData().quizSessions;

  // Check if playerId exists in a session and get that session and player
  const foundSession = sessions.find((session) =>
    session.players.some((item) => item.playerId === playerId)
  );

  if (!foundSession) {
    throw HTTPError(400, 'playerID does not exist');
  }

  const foundPlayer = foundSession.players.find((item) => item.playerId === playerId);

  if (messageBody.length < 1) {
    throw HTTPError(400, 'message length shorter than 1 character');
  }
  if (messageBody.length > 100) {
    throw HTTPError(400, 'message length longer than 100 characters');
  }

  // Add new message to the messages array in the session
  foundSession.messages.push({
    messageBody: messageBody,
    playerId: playerId,
    playerName: foundPlayer.playerName,
    timeSent: Date.now()
  });

  return {};
}

// Given a playerId, display all chat messages in session
/**
 * @param { number } playerId
 * @param { string } messageBody
 * @returns {}
 */
export function chatView(playerId: number) {
  // Import dataStore, get sessions
  const sessions = getData().quizSessions;
  // Check if playerId exists in a session and get that session and player
  const foundSession = sessions.find((session) =>
    session.players.some((item) => item.playerId === playerId)
  );

  if (!foundSession) {
    throw HTTPError(400, 'playerID does not exist');
  }

  const messages: Message[] = [];

  for (const msg of foundSession.messages) {
    messages.push(msg);
  }

  return {
    messages: messages
  };
}
