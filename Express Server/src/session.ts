import { Session } from './dataStore';
import { getData } from './dataStore';
import { v4 as uuidv4 } from 'uuid';
import HTTPError from 'http-errors';

export function createSessionToken(userId: number): string {
  const data = getData();

  let token = uuidv4();
  while (data.sessions.some((session) => session.token === token)) {
    token = uuidv4();
  }

  const session: Session = {
    token,
    userId,

  };

  data.sessions.push(session);

  return token;
}

export function tokenUserId(token: string): number {
  const data = getData();

  const possibleSession = data.sessions.find((session) => session.token === token);

  if (!possibleSession) {
    throw HTTPError(401, 'User not found');
  }

  return possibleSession.userId;
}

export function invalidateToken(token: string) {
  const data = getData();

  const possibleSessionIndex = data.sessions.findIndex((session) => session.token === token);

  if (possibleSessionIndex === -1) {
    return;
  }

  data.sessions.splice(possibleSessionIndex, 1);
}

export function createQuizSession() {
  let newquizSession = uuidv4();
  const data = getData();

  for (const session of data.quizSessions) {
    if (session.sessionId === newquizSession) {
      newquizSession = uuidv4();
    }
  }

  return newquizSession;
}
