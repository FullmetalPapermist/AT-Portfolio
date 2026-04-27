import {
  requestAuthRegister, createStandardQuizSession, requestSessionUpdate,
  requestSessionGet, requestClear, standardQuestion, standardDuration, standardPoints,
  standardThumbnailUrl
} from '../request';
import { ACTION } from '../dataStore';

const INPUT_ERROR = 400;
const UNAUTHOURIZED = 401;
const FORBIDDEN = 403;
const OK = 200;

const standardAnswers = [
  {
    answerId: 0,
    answer: 'Toad',
    colour: expect.any(String),
    correct: true
  },
  {
    answerId: 1,
    answer: 'Luigi',
    colour: expect.any(String),
    correct: false
  }
];

const standardAnswers2 = [
  {
    answerId: 2,
    answer: 'Toad',
    colour: expect.any(String),
    correct: true
  },
  {
    answerId: 3,
    answer: 'Luigi',
    colour: expect.any(String),
    correct: false
  }
];

beforeEach(() => {
  requestClear();
});

describe('Session Get', () => {
  test('Succesful LOBBY', () => {
    const obj = createStandardQuizSession();
    const token = obj.token;
    const quizId = obj.quizId;
    const sessionId = obj.sessionId;

    requestSessionUpdate(quizId, sessionId, token, ACTION.END);
    const res = requestSessionGet(quizId, sessionId, token);
    const bodyObj = JSON.parse(res.body as string);
    expect(res.statusCode).toStrictEqual(OK);
    expect(bodyObj).toStrictEqual({
      state: 'end',
      atQuestion: 0,
      players: [],
      metadata: {
        quizId: quizId,
        name: 'quiz123',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'default quiz',
        numQuestions: 2,
        questions: [
          {
            questionId: obj.questionId1,
            question: standardQuestion,
            duration: standardDuration,
            thumbnailUrl: standardThumbnailUrl,
            points: standardPoints,
            answers: standardAnswers,
          },
          {
            questionId: obj.questionId2,
            question: standardQuestion,
            duration: standardDuration,
            thumbnailUrl: standardThumbnailUrl,
            points: standardPoints,
            answers: standardAnswers2,
          }
        ],
        duration: expect.any(Number),
        thumbnailUrl: '',
      }
    });
  });

  test('ERROR 400: Session Id does not refer to a valid session within this quiz', () => {
    const obj = createStandardQuizSession();
    const token = obj.token;
    const quizId = obj.quizId;
    const sessionId = obj.sessionId;
    const res = requestSessionGet(quizId, sessionId + 'INVALID', token);
    expect(res.statusCode).toStrictEqual(INPUT_ERROR);
  });

  test('ERROR 401: Token is empty or invalid', () => {
    const obj = createStandardQuizSession();
    const token = obj.token;
    const quizId = obj.quizId;
    const sessionId = obj.sessionId;
    const res = requestSessionGet(quizId, sessionId, token + 'INVALID');
    expect(res.statusCode).toStrictEqual(UNAUTHOURIZED);
  });

  test('ERROR 403: Valid token is provided, but user is not an owner of this quiz', () => {
    const obj = createStandardQuizSession();
    const responseUnparsed = requestAuthRegister('myotheremail@email.com', 'shibainu1', 'Ethan', 'Wrong');
    const user1 = JSON.parse(responseUnparsed.body as string); const quizId = obj.quizId;
    const sessionId = obj.sessionId;
    const res = requestSessionGet(quizId, sessionId, user1.token);
    expect(res.statusCode).toStrictEqual(FORBIDDEN);
  });
});
