import { requestClear, createStandardQuizSession, requestSessionUpdate, requestPlayerJoin, ERROR, requestPlayerQuestionInfo, requestQuizInfo } from '../request';
import { ACTION } from '../dataStore';

beforeEach(() => {
  requestClear();
});

const standardName = 'Chichi Bones';

describe('Failed questionInfo', () => {
  test('playerId does not exist', () => {
    const obj = createStandardQuizSession();
    const playerId = JSON.parse(requestPlayerJoin(obj.sessionId, standardName).body as string).playerId;
    requestSessionUpdate(obj.quizId, obj.sessionId, obj.token, ACTION.NEXT_QUESTION);
    const res = requestPlayerQuestionInfo(playerId + 1, 1);
    expect(res.statusCode).toStrictEqual(400);
    expect(JSON.parse(res.body as string)).toStrictEqual(ERROR);
  });

  test.each([2, 3, 4])('questionPosition is incorrect %d', (number) => {
    const obj = createStandardQuizSession();
    const playerId = JSON.parse(requestPlayerJoin(obj.sessionId, standardName).body as string).playerId;
    requestSessionUpdate(obj.quizId, obj.sessionId, obj.token, ACTION.NEXT_QUESTION);
    const res = requestPlayerQuestionInfo(playerId, number);
    expect(res.statusCode).toStrictEqual(400);
    expect(JSON.parse(res.body as string)).toStrictEqual(ERROR);
  });

  test('invalid question position', () => {
    const obj = createStandardQuizSession();
    const playerId = JSON.parse(requestPlayerJoin(obj.sessionId, standardName).body as string).playerId;
    for (let i = 0; i < 2; i++) {
      requestSessionUpdate(obj.quizId, obj.sessionId, obj.token, ACTION.NEXT_QUESTION);
      requestSessionUpdate(obj.quizId, obj.sessionId, obj.token, ACTION.SKIP_COUNTDOWN);
      requestSessionUpdate(obj.quizId, obj.sessionId, obj.token, ACTION.GO_TO_ANSWER);
    }
    requestSessionUpdate(obj.quizId, obj.sessionId, obj.token, ACTION.NEXT_QUESTION);
    const res = requestPlayerQuestionInfo(playerId, 3);
    expect(res.statusCode).toStrictEqual(400);
    expect(JSON.parse(res.body as string)).toStrictEqual(ERROR);
  });

  test('Session in end', () => {
    const obj = createStandardQuizSession();
    const playerId = JSON.parse(requestPlayerJoin(obj.sessionId, standardName).body as string).playerId;
    requestSessionUpdate(obj.quizId, obj.sessionId, obj.token, ACTION.END);
    const res = requestPlayerQuestionInfo(playerId, 1);
    expect(res.statusCode).toStrictEqual(400);
    expect(JSON.parse(res.body as string)).toStrictEqual(ERROR);
  });

  test('Session in lobby', () => {
    const obj = createStandardQuizSession();
    const playerId = JSON.parse(requestPlayerJoin(obj.sessionId, standardName).body as string).playerId;
    const res = requestPlayerQuestionInfo(playerId, 1);
    expect(res.statusCode).toStrictEqual(400);
    expect(JSON.parse(res.body as string)).toStrictEqual(ERROR);
  });
});

describe('Success cases', () => {
  test('successful question info', () => {
    const obj = createStandardQuizSession();
    const playerId = JSON.parse(requestPlayerJoin(obj.sessionId, standardName).body as string).playerId;
    requestSessionUpdate(obj.quizId, obj.sessionId, obj.token, ACTION.NEXT_QUESTION);
    const res = requestPlayerQuestionInfo(playerId, 1);
    expect(res.statusCode).toStrictEqual(200);
    const question = JSON.parse(
      requestQuizInfo(obj.token, obj.quizId).body as string).questions[0];
    expect(
      JSON.parse(res.body as string)).toStrictEqual(question);
  });
});
