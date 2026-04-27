import { ACTION, STATE, getData } from './dataStore';
import { tokenUserId } from './session';
import { getSession } from './other';
import HttpError from 'http-errors';

export function adminQuizSessionUpdate(quizId: number, sessionId: string, token: string, action: string): Record<string, never> {
  const data = getData();
  const user = tokenUserId(token);

  if (!(quizId === user)) {
    throw HttpError(403, 'This user does not own this quiz');
  }

  const session = getSession(sessionId);

  let validAction = false;

  if (action === ACTION.END) {
    if (session.state === STATE.END) {
      throw HttpError(400, 'Action enum cannot be applied in the current state');
    }
    session.state = STATE.END;
    validAction = true;
  }

  if (action === ACTION.NEXT_QUESTION) {
    if (session.state === STATE.END || session.state === STATE.FINAL_RESULTS ||
      session.state === STATE.QUESTION_OPEN || session.state === STATE.QUESTION_COUNTDOWN) {
      throw HttpError(400, 'Action enum cannot be applied in the current state');
    } else {
      session.state = STATE.QUESTION_COUNTDOWN;
      session.questionPosition++;
      validAction = true;
    }
  }

  if (action === ACTION.SKIP_COUNTDOWN) {
    if (session.state !== STATE.QUESTION_COUNTDOWN) {
      throw HttpError(400, 'Action enum cannot be applied in the current state');
    } else {
      session.state = STATE.QUESTION_OPEN;
      validAction = true;
      session.questionStart = Math.round(Date.now() / 1000);
    }
  }

  if (action === ACTION.GO_TO_ANSWER) {
    if (session.state === STATE.END || session.state === STATE.FINAL_RESULTS ||
      session.state === STATE.LOBBY || session.state === STATE.QUESTION_COUNTDOWN ||
       session.state === STATE.ANSWER_SHOWER) {
      throw HttpError(400, 'Action enum cannot be applied in the current state');
    } else {
      session.state = STATE.ANSWER_SHOWER;
      validAction = true;
    }
  }

  if (action === ACTION.GO_TO_FINAL_RESULTS) {
    if (session.state === STATE.END || session.state === STATE.FINAL_RESULTS ||
      session.state === STATE.LOBBY || session.state === STATE.QUESTION_COUNTDOWN ||
       session.state === STATE.QUESTION_OPEN) {
      throw HttpError(400, 'Action enum cannot be applied in the current state');
    } else {
      session.state = STATE.FINAL_RESULTS;
      validAction = true;
    }
  }

  if (validAction === false) {
    throw HttpError(400, 'Action provided is not a valid Action enum');
  }

  let quizPosition = 0;
  let found = false;
  for (const key of data.quizzes) {
    if (key.quizId === quizId) {
      found = true;
    }

    if (found === false) {
      quizPosition++;
    }
  }
  data.quizzes[quizPosition].timeLastEdited = Date.now();

  return {

  };
}
