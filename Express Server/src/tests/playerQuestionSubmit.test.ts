import { requestPlayerQuestionSubmit, standardName, requestClear, createStandardQuizSession, requestSessionUpdate, requestPlayerJoin, ERROR, requestPlayerQuestionInfo } from '../request';
import { ACTION } from '../dataStore';

beforeEach(() => {
  requestClear();
});

describe('Failed submission', () => {
  test('player id does not exist', () => {
    const obj = createStandardQuizSession();
    const playerId = JSON.parse(requestPlayerJoin(obj.sessionId, standardName).body as string).playerId;
    requestSessionUpdate(obj.quizId, obj.sessionId, obj.token, ACTION.NEXT_QUESTION);
    requestSessionUpdate(obj.quizId, obj.sessionId, obj.token, ACTION.SKIP_COUNTDOWN);
    const answers = JSON.parse(requestPlayerQuestionInfo(playerId, 1).body as string).answers;
    const res = requestPlayerQuestionSubmit(playerId + 1, 1, [answers[0].answerId]);
    expect(res.statusCode).toStrictEqual(400);
    expect(JSON.parse(res.body as string)).toStrictEqual(ERROR);
  });

  test('invalid question position', () => {
    const obj = createStandardQuizSession();
    const playerId = JSON.parse(requestPlayerJoin(obj.sessionId, standardName).body as string).playerId;
    requestSessionUpdate(obj.quizId, obj.sessionId, obj.token, ACTION.NEXT_QUESTION);
    requestSessionUpdate(obj.quizId, obj.sessionId, obj.token, ACTION.SKIP_COUNTDOWN);
    const answers = JSON.parse(requestPlayerQuestionInfo(playerId, 1).body as string).answers;
    const res = requestPlayerQuestionSubmit(playerId, 2, [answers[0].answerId]);
    expect(res.statusCode).toStrictEqual(400);
    expect(JSON.parse(res.body as string)).toStrictEqual(ERROR);
  });

  test('question position outside quiz', () => {
    const obj = createStandardQuizSession();
    const playerId = JSON.parse(requestPlayerJoin(obj.sessionId, standardName).body as string).playerId;
    requestSessionUpdate(obj.quizId, obj.sessionId, obj.token, ACTION.NEXT_QUESTION);
    const answers = JSON.parse(requestPlayerQuestionInfo(playerId, 1).body as string).answers;
    for (let i = 0; i < 2; i++) {
      requestSessionUpdate(obj.quizId, obj.sessionId, obj.token, ACTION.SKIP_COUNTDOWN);
      requestSessionUpdate(obj.quizId, obj.sessionId, obj.token, ACTION.GO_TO_ANSWER);
      requestSessionUpdate(obj.quizId, obj.sessionId, obj.token, ACTION.NEXT_QUESTION);
    }
    const res = requestPlayerQuestionSubmit(playerId, 3, [answers[0].answerId]);
    expect(res.statusCode).toStrictEqual(400);
    expect(JSON.parse(res.body as string)).toStrictEqual(ERROR);
  });

  test.each([ACTION.GO_TO_ANSWER, ACTION.END])('Not in question open %s', (action) => {
    const obj = createStandardQuizSession();
    const playerId = JSON.parse(requestPlayerJoin(obj.sessionId, standardName).body as string).playerId;
    requestSessionUpdate(obj.quizId, obj.sessionId, obj.token, ACTION.NEXT_QUESTION);
    const answers = JSON.parse(requestPlayerQuestionInfo(playerId, 1).body as string).answers;
    requestSessionUpdate(obj.quizId, obj.sessionId, obj.token, ACTION.SKIP_COUNTDOWN);
    requestSessionUpdate(obj.quizId, obj.sessionId, obj.token, action);
    const res = requestPlayerQuestionSubmit(playerId, 1, [answers[0].answerId]);
    expect(res.statusCode).toStrictEqual(400);
    expect(JSON.parse(res.body as string)).toStrictEqual(ERROR);
  });

  test('duplicate answerId', () => {
    const obj = createStandardQuizSession();
    const playerId = JSON.parse(requestPlayerJoin(obj.sessionId, standardName).body as string).playerId;
    requestSessionUpdate(obj.quizId, obj.sessionId, obj.token, ACTION.NEXT_QUESTION);
    requestSessionUpdate(obj.quizId, obj.sessionId, obj.token, ACTION.SKIP_COUNTDOWN);
    const answers = JSON.parse(requestPlayerQuestionInfo(playerId, 1).body as string).answers;
    const res = requestPlayerQuestionSubmit(playerId, 1, [answers[0].answerId, answers[0].answerId]);
    expect(res.statusCode).toStrictEqual(400);
    expect(JSON.parse(res.body as string)).toStrictEqual(ERROR);
  });

  test('invalid answerId', () => {
    const obj = createStandardQuizSession();
    const playerId = JSON.parse(requestPlayerJoin(obj.sessionId, standardName).body as string).playerId;
    requestSessionUpdate(obj.quizId, obj.sessionId, obj.token, ACTION.NEXT_QUESTION);
    requestSessionUpdate(obj.quizId, obj.sessionId, obj.token, ACTION.SKIP_COUNTDOWN);
    const answers = JSON.parse(requestPlayerQuestionInfo(playerId, 1).body as string).answers;
    const res = requestPlayerQuestionSubmit(playerId, 1, [answers[0].answerId + 10]);
    expect(res.statusCode).toStrictEqual(400);
    expect(JSON.parse(res.body as string)).toStrictEqual(ERROR);
  });

  test('no answerId supplied', () => {
    const obj = createStandardQuizSession();
    const playerId = JSON.parse(requestPlayerJoin(obj.sessionId, standardName).body as string).playerId;
    requestSessionUpdate(obj.quizId, obj.sessionId, obj.token, ACTION.NEXT_QUESTION);
    requestSessionUpdate(obj.quizId, obj.sessionId, obj.token, ACTION.SKIP_COUNTDOWN);
    const res = requestPlayerQuestionSubmit(playerId, 1, []);
    expect(res.statusCode).toStrictEqual(400);
    expect(JSON.parse(res.body as string)).toStrictEqual(ERROR);
  });
});

describe('Successful submit', () => {
  test.each([0, 1])('successful submit 1 answer %d', (index) => {
    const obj = createStandardQuizSession();
    const playerId = JSON.parse(requestPlayerJoin(obj.sessionId, standardName).body as string).playerId;
    requestSessionUpdate(obj.quizId, obj.sessionId, obj.token, ACTION.NEXT_QUESTION);
    requestSessionUpdate(obj.quizId, obj.sessionId, obj.token, ACTION.SKIP_COUNTDOWN);
    const answers = JSON.parse(requestPlayerQuestionInfo(playerId, 1).body as string).answers;
    const res = requestPlayerQuestionSubmit(playerId, 1, [answers[index].answerId]);
    expect(res.statusCode).toStrictEqual(200);
    expect(JSON.parse(res.body as string)).toStrictEqual({});
  });
  test('successful submit answers', () => {
    const obj = createStandardQuizSession();
    const playerId = JSON.parse(requestPlayerJoin(obj.sessionId, standardName).body as string).playerId;
    requestSessionUpdate(obj.quizId, obj.sessionId, obj.token, ACTION.NEXT_QUESTION);
    requestSessionUpdate(obj.quizId, obj.sessionId, obj.token, ACTION.SKIP_COUNTDOWN);
    const answers = JSON.parse(requestPlayerQuestionInfo(playerId, 1).body as string).answers;
    const res = requestPlayerQuestionSubmit(playerId, 1, [answers[0].answerId, answers[1].answerId]);
    expect(res.statusCode).toStrictEqual(200);
    expect(JSON.parse(res.body as string)).toStrictEqual({});
  });
});
