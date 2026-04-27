import { requestClear, createStandardQuizSession, requestSessionUpdate, ERROR, requestPlayerJoin } from '../request';
import { ACTION } from '../dataStore';

beforeEach(() => {
  requestClear();
});

const standardPlayerName = 'Viola Alfreds';

describe('Failed player joined', () => {
  test.each([
    ACTION.END
  ])('Session not in lobby %s', (action) => {
    const obj = createStandardQuizSession();
    const sessionId = obj.sessionId;
    const quizId = obj.quizId;
    const token = obj.token;
    requestSessionUpdate(quizId, sessionId, token, action);
    const res = requestPlayerJoin(sessionId, standardPlayerName);
    expect(res.statusCode).toStrictEqual(400);
    expect(JSON.parse(res.body as string)).toStrictEqual(ERROR);
  });

  test.each([
    standardPlayerName, 'Michael Jackson'
  ])('Same name %s', (name) => {
    const sessionId = createStandardQuizSession().sessionId;
    let res = requestPlayerJoin(sessionId, name);
    expect(res.statusCode).toStrictEqual(200);
    res = requestPlayerJoin(sessionId, name);
    expect(res.statusCode).toStrictEqual(400);
    expect(JSON.parse(res.body as string)).toStrictEqual(ERROR);
  });

  test.each([
    'badId', 'invalid'
  ])('Bad sessionId', (sessionId) => {
    const res = requestPlayerJoin(sessionId, standardPlayerName);
    expect(res.statusCode).toStrictEqual(400);
    expect(JSON.parse(res.body as string)).toStrictEqual(ERROR);
  });
});

describe('Success player joined', () => {
  test.each([
    standardPlayerName, 'Michael Jackson'
  ])('correct return object %s', (name) => {
    const sessionId = createStandardQuizSession().sessionId;
    const res = requestPlayerJoin(sessionId, name);
    expect(res.statusCode).toStrictEqual(200);
    expect(JSON.parse(res.body as string)).toStrictEqual({ playerId: expect.any(Number) });
  });

  test.each([
    ['First', 'Second'],
    ['Toad', 'Toadette'],
  ])('different playerIds %s', (name1, name2) => {
    const sessionId = createStandardQuizSession().sessionId;
    let res = requestPlayerJoin(sessionId, name1);
    let parsedRes = JSON.parse(res.body as string);
    expect(parsedRes).toStrictEqual({ playerId: expect.any(Number) });
    const playerId1 = parsedRes.playerId;
    res = requestPlayerJoin(sessionId, name2);
    parsedRes = JSON.parse(res.body as string);
    const playerId2 = parsedRes.playerId;
    expect(playerId1).not.toStrictEqual(playerId2);
  });
});
