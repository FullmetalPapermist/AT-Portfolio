import { tokenUserId } from './session';
import { getSession } from './other';
import HttpError from 'http-errors';

export function adminQuizSessionGet(quizId: number, sessionId: string, token: string) {
  const user = tokenUserId(token);
  if (!(quizId === user)) {
    throw HttpError(403, 'This user does not own this quiz');
  }

  const session = getSession(sessionId);
  const sessionReturn = {
    state: session.state,
    atQuestion: session.questionPosition,
    players: session.players,
    metadata: {
      quizId: session.metadata.quizId,
      name: session.metadata.quizTitle,
      timeCreated: session.metadata.timeCreated,
      timeLastEdited: session.metadata.timeLastEdited,
      description: session.metadata.quizDescription,
      numQuestions: session.metadata.questions.length,
      questions: session.metadata.questions,
      duration: session.metadata.duration,
      thumbnailUrl: session.metadata.thumbnailUrl,
    }
  };

  return sessionReturn;
}
