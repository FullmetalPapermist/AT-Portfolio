import { requestClear, requestAuthRegister, requestQuizCreate, requestQuestionCreate, requestSessionStart } from '../request';

const standardThumbnailUrl = 'http://google.com/some/image/path.jpg';

const standardAnswer = [
  {
    answer: '21',
    correct: true
  },
  {
    answer: '19',
    correct: false
  },
];

beforeEach(() => {
  requestClear();
});

// Successfuly returned sessionId
describe('adminQuizSessionStart', () => {
  test('Successfully returned quizSessionId', () => {
    let responseUnparsed = requestAuthRegister('myemail@email.com', 'shibainu1', 'Steph', 'Liang');
    const user = JSON.parse(responseUnparsed.body as string);
    responseUnparsed = requestQuizCreate(user.token, 'myquiz', 'very fun quiz');
    const quiz = JSON.parse(responseUnparsed.body as string);
    requestQuestionCreate(quiz.quizId, user.token, 'what is 9 + 10?', 5, 10, standardAnswer, standardThumbnailUrl);
    const session = requestSessionStart(10, quiz.quizId, user.token);
    const sessionId = JSON.parse(session.getBody());
    expect(sessionId).toStrictEqual({
      sessionId: expect.any(String),
    });
  });

  test('Error 400: autoStartNum > 50', () => {
    let responseUnparsed = requestAuthRegister('myemail@email.com', 'shibainu1', 'Ethan', 'Adia');
    const user = JSON.parse(responseUnparsed.body as string);
    responseUnparsed = requestQuizCreate(user.token, 'myquiz', 'very fun quiz');
    const quiz = JSON.parse(responseUnparsed.body as string);
    requestQuestionCreate(quiz.quizId, user.token, 'what is 9 + 10?', 5, 10, standardAnswer, standardThumbnailUrl);
    const session = requestSessionStart(51, quiz.quizId, user.token);
    expect(session.statusCode).toBe(400);
  });

  test('Error 400: 10 sessions max not in END state', () => {
    let responseUnparsed = requestAuthRegister('myemail@email.com', 'shibainu1', 'Nat', 'Chung');
    const user = JSON.parse(responseUnparsed.body as string);
    responseUnparsed = requestQuizCreate(user.token, 'myquiz', 'very fun quiz');
    const quiz = JSON.parse(responseUnparsed.body as string);
    requestQuestionCreate(quiz.quizId, user.token, 'what is 9 + 10?', 5, 10, standardAnswer, standardThumbnailUrl);
    for (let i = 0; i < 10; i++) {
      requestSessionStart(10, quiz.quizId, user.token);
    }
    const session = requestSessionStart(10, quiz.quizId, user.token);
    expect(session.statusCode).toBe(400);
  });

  test('Error 400: Quiz has no questions', () => {
    let responseUnparsed = requestAuthRegister('myemail@email.com', 'shibainu1', 'Ethan', 'Wong');
    const user = JSON.parse(responseUnparsed.body as string);
    responseUnparsed = requestQuizCreate(user.token, 'myquiz', 'very fun quiz');
    const quiz = JSON.parse(responseUnparsed.body as string);
    const session = requestSessionStart(10, quiz.quizId, user.token);
    expect(session.statusCode).toBe(400);
  });

  test('Error 401: Token invalid/empty', () => {
    let responseUnparsed = requestAuthRegister('myemail@email.com', 'shibainu1', 'Ethan', 'Wong');
    const user = JSON.parse(responseUnparsed.body as string);
    responseUnparsed = requestQuizCreate(user.token, 'myquiz', 'very fun quiz');
    const quiz = JSON.parse(responseUnparsed.body as string);
    requestQuestionCreate(quiz.quizId, user.token, 'what is 9 + 10?', 5, 10, standardAnswer, standardThumbnailUrl);
    const session = requestSessionStart(10, quiz.quizId, 'faketoken');
    expect(session.statusCode).toBe(401);
  });

  test('Error 403: User is not owner of this quiz', () => {
    let responseUnparsed = requestAuthRegister('myemail@email.com', 'shibainu1', 'Ethan', 'Wong');
    const user = JSON.parse(responseUnparsed.body as string);
    responseUnparsed = requestAuthRegister('myotheremail@email.com', 'shibainu1', 'Ethan', 'Wrong');
    const user1 = JSON.parse(responseUnparsed.body as string);
    responseUnparsed = requestQuizCreate(user.token, 'myquiz', 'very fun quiz');
    const quiz = JSON.parse(responseUnparsed.body as string);
    requestQuestionCreate(quiz.quizId, user.token, 'what is 9 + 10?', 5, 10, standardAnswer, standardThumbnailUrl);
    const session = requestSessionStart(10, quiz.quizId, user1.token);
    expect(session.statusCode).toBe(403);
  });
});
