import {
  requestAuthRegister, requestQuizCreate, createStandardQuizSession,
  requestSessionUpdate, requestClear
} from '../request';
import { ACTION } from '../dataStore';

const INPUT_ERROR = 400;
const UNAUTHOURIZED = 401;
const FORBIDDEN = 403;
const OK = 200;

beforeEach(() => {
  requestClear();
});

describe('Session Update', () => {
  test('Succesful Two tests', () => {
    const responseUnparsed = requestAuthRegister('myotheremail@email.com', 'shibainu1', 'Ethan', 'Wrong');
    const user1 = JSON.parse(responseUnparsed.body as string);
    requestQuizCreate(user1.token, 'quiz123', 'default quiz');

    const obj = createStandardQuizSession();
    const token = obj.token;
    const quizId = obj.quizId;
    const sessionId = obj.sessionId;
    const res = requestSessionUpdate(quizId, sessionId, token, ACTION.END);
    const bodyObj = JSON.parse(res.body as string);
    expect(res.statusCode).toStrictEqual(OK);
    expect(bodyObj).toStrictEqual({});
  });

  test('Succesful END', () => {
    const obj = createStandardQuizSession();
    const token = obj.token;
    const quizId = obj.quizId;
    const sessionId = obj.sessionId;
    const res = requestSessionUpdate(quizId, sessionId, token, ACTION.END);
    const bodyObj = JSON.parse(res.body as string);
    expect(res.statusCode).toStrictEqual(OK);
    expect(bodyObj).toStrictEqual({});
  });

  test('Succesful NEXT_QUESTION', () => {
    const obj = createStandardQuizSession();
    const token = obj.token;
    const quizId = obj.quizId;
    const sessionId = obj.sessionId;
    const res = requestSessionUpdate(quizId, sessionId, token, ACTION.NEXT_QUESTION);
    const bodyObj = JSON.parse(res.body as string);
    expect(res.statusCode).toStrictEqual(OK);
    expect(bodyObj).toStrictEqual({});
  });

  test('Succesful SKIP_COUNTDOWN', () => {
    const obj = createStandardQuizSession();
    const token = obj.token;
    const quizId = obj.quizId;
    const sessionId = obj.sessionId;
    requestSessionUpdate(quizId, sessionId, token, ACTION.NEXT_QUESTION);
    const res = requestSessionUpdate(quizId, sessionId, token, ACTION.SKIP_COUNTDOWN);
    const bodyObj = JSON.parse(res.body as string);
    expect(res.statusCode).toStrictEqual(OK);
    expect(bodyObj).toStrictEqual({});
  });

  test('Succesful GO_TO_ANSWER', () => {
    const obj = createStandardQuizSession();
    const token = obj.token;
    const quizId = obj.quizId;
    const sessionId = obj.sessionId;
    requestSessionUpdate(quizId, sessionId, token, ACTION.NEXT_QUESTION);
    requestSessionUpdate(quizId, sessionId, token, ACTION.SKIP_COUNTDOWN);
    const res = requestSessionUpdate(quizId, sessionId, token, ACTION.GO_TO_ANSWER);
    const bodyObj = JSON.parse(res.body as string);
    expect(res.statusCode).toStrictEqual(OK);
    expect(bodyObj).toStrictEqual({});
  });

  test('Succesful GO_TO_FINAL_RESULTS', () => {
    const obj = createStandardQuizSession();
    const token = obj.token;
    const quizId = obj.quizId;
    const sessionId = obj.sessionId;
    requestSessionUpdate(quizId, sessionId, token, ACTION.NEXT_QUESTION);
    requestSessionUpdate(quizId, sessionId, token, ACTION.SKIP_COUNTDOWN);
    requestSessionUpdate(quizId, sessionId, token, ACTION.GO_TO_ANSWER);
    const res = requestSessionUpdate(quizId, sessionId, token, ACTION.GO_TO_FINAL_RESULTS);
    const bodyObj = JSON.parse(res.body as string);
    expect(res.statusCode).toStrictEqual(OK);
    expect(bodyObj).toStrictEqual({});
  });

  test('Error 400: Session Id does not refer to a valid session within this quiz', () => {
    const obj = createStandardQuizSession();
    const token = obj.token;
    const quizId = obj.quizId;
    const sessionId = obj.sessionId;
    const res = requestSessionUpdate(quizId, sessionId + 'INVALID', token, ACTION.END);
    expect(res.statusCode).toStrictEqual(INPUT_ERROR);
  });

  test('Error 400: ACTION provided is not a valid ACTION enum', () => {
    const obj = createStandardQuizSession();
    const token = obj.token;
    const quizId = obj.quizId;
    const sessionId = obj.sessionId;
    const res = requestSessionUpdate(quizId, sessionId, token, ACTION.END + 'INVALID');
    expect(res.statusCode).toStrictEqual(INPUT_ERROR);
  });

  test('Error 400: ACTION enum cannot be applied in the current state NEXT_QUESTION', () => {
    const obj = createStandardQuizSession();
    const token = obj.token;
    const quizId = obj.quizId;
    const sessionId = obj.sessionId;
    requestSessionUpdate(quizId, sessionId, token, ACTION.END);
    const res = requestSessionUpdate(quizId, sessionId, token, ACTION.NEXT_QUESTION);
    expect(res.statusCode).toStrictEqual(INPUT_ERROR);
  });

  test('Error 400: ACTION enum cannot be applied in the current state SKIP_COUNTDOWN', () => {
    const obj = createStandardQuizSession();
    const token = obj.token;
    const quizId = obj.quizId;
    const sessionId = obj.sessionId;
    const res = requestSessionUpdate(quizId, sessionId, token, ACTION.SKIP_COUNTDOWN);
    expect(res.statusCode).toStrictEqual(INPUT_ERROR);
  });

  test('Error 400: ACTION enum cannot be applied in the current state GO_TO_ANSWER', () => {
    const obj = createStandardQuizSession();
    const token = obj.token;
    const quizId = obj.quizId;
    const sessionId = obj.sessionId;
    requestSessionUpdate(quizId, sessionId, token, ACTION.END);
    const res = requestSessionUpdate(quizId, sessionId, token, ACTION.GO_TO_ANSWER);
    expect(res.statusCode).toStrictEqual(INPUT_ERROR);
  });

  test('Error 400: ACTION enum cannot be applied in the current state GO_TO_FINAL_RESULTS', () => {
    const obj = createStandardQuizSession();
    const token = obj.token;
    const quizId = obj.quizId;
    const sessionId = obj.sessionId;
    requestSessionUpdate(quizId, sessionId, token, ACTION.END);
    const res = requestSessionUpdate(quizId, sessionId, token, ACTION.GO_TO_FINAL_RESULTS);
    expect(res.statusCode).toStrictEqual(INPUT_ERROR);
  });

  test('Error 400: ACTION enum cannot be applied in the current state END', () => {
    const obj = createStandardQuizSession();
    const token = obj.token;
    const quizId = obj.quizId;
    const sessionId = obj.sessionId;
    requestSessionUpdate(quizId, sessionId, token, ACTION.END);
    const res = requestSessionUpdate(quizId, sessionId, token, ACTION.END);
    expect(res.statusCode).toStrictEqual(INPUT_ERROR);
  });

  test('Error 401: Token is empty or invalid', () => {
    const obj = createStandardQuizSession();
    const token = obj.token;
    const quizId = obj.quizId;
    const sessionId = obj.sessionId;
    const res = requestSessionUpdate(quizId, sessionId, token + 'INVALID', ACTION.END);
    expect(res.statusCode).toStrictEqual(UNAUTHOURIZED);
  });

  test('Error 403: ACTION provided is not a valid ACTION enum', () => {
    const obj = createStandardQuizSession();
    const responseUnparsed = requestAuthRegister('myotheremail@email.com', 'shibainu1', 'Ethan', 'Wrong');
    const user1 = JSON.parse(responseUnparsed.body as string);
    const quizId = obj.quizId;
    const sessionId = obj.sessionId;
    const res = requestSessionUpdate(quizId, sessionId, user1.token, ACTION.END);
    expect(res.statusCode).toStrictEqual(FORBIDDEN);
  });
});
