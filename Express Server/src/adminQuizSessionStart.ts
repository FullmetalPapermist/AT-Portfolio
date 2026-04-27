import { tokenUserId, createQuizSession } from './session';
import HttpError from 'http-errors';
import { QuizSession, STATE, getData } from './dataStore';
import { findQuiz } from './other';

export function adminQuizSessionStart(token: string, autoStartNum: number, quizId: number) {
  const user = tokenUserId(token);
  const quiz = findQuiz(quizId);

  if (!(quiz.ownerId === user)) {
    throw HttpError(403, 'This user does not own this quiz');
  }
  if (autoStartNum > 50) {
    throw HttpError(400, 'autoStartNum is greater than 50');
  }

  if (!quiz.questions.length) {
    throw HttpError(400, 'This quiz has no questions');
  }

  const newSession: QuizSession = {
    sessionId: createQuizSession(),
    state: STATE.LOBBY,
    autoStartNum: autoStartNum,
    players: [],
    ownerId: quiz.ownerId,
    metadata: quiz,
    questionPosition: 0,
    questionResults: [],
    questionStart: 0,
    messages: []
  };

  const data = getData();

  let activeSessions = 0;
  for (const session of data.quizSessions) {
    if (!(session.state === STATE.END)) {
      activeSessions++;
    }
  }

  if (activeSessions >= 10) {
    throw HttpError(400, '10 sessions max not in END state');
  }

  data.quizSessions.push(newSession);

  return { sessionId: newSession.sessionId };
}
