import { getData } from './dataStore';
import { STATE } from './dataStore';
import { findQuiz } from './other';
import { tokenUserId } from './session';
import HttpError from 'http-errors';

export function quizSessionList(token: string, quizId: number) {
  const data = getData();
  const activeSessions: string[] = [];
  const inactiveSessions: string[] = [];

  const userId = tokenUserId(token);
  const quiz = findQuiz(quizId);

  if (!(userId === quiz.ownerId)) {
    throw HttpError(403, 'UserId does not own this quiz!');
  }

  for (const session of data.quizSessions) {
    if (session.state === STATE.END) {
      inactiveSessions.push(session.sessionId);
    } else {
      activeSessions.push(session.sessionId);
    }
  }

  return {
    activeSessions: activeSessions,
    inactiveSessions: inactiveSessions,
  };
}
