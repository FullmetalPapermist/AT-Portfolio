import { requestClear, requestSessionUpdate, requestQuizCreate, requestSessionStart, requestAuthRegister, requestQuestionCreate, requestSessionList } from '../request';

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

describe('adminSessionList', () => {
  test('Successfully returned list of active and inactive sessions', () => {
    const user = JSON.parse(requestAuthRegister('myemail@email.com', 'shibainu1', 'Nat', 'Chung').getBody());
    const quiz = JSON.parse(requestQuizCreate(user.token, 'myquiz', 'very fun quiz').getBody());
    requestQuestionCreate(quiz.quizId, user.token, 'what is 9 + 10?', 5, 10, standardAnswer, standardThumbnailUrl);
    const activeSessionIds = [];
    const inactiveSessionIds = [];

    for (let i = 0; i < 5; i++) {
      const session = requestSessionStart(10, quiz.quizId, user.token);
      activeSessionIds.push(JSON.parse(session.getBody()).sessionId);
    }

    for (let i = 0; i < 5; i++) {
      const session = requestSessionStart(10, quiz.quizId, user.token);
      const sessionId = JSON.parse(session.getBody()).sessionId;
      requestSessionUpdate(quiz.quizId, sessionId, user.token, 'END');
      inactiveSessionIds.push(sessionId);
    }

    const result = requestSessionList(user.token, quiz.quizId);
    const resultBody = JSON.parse(result.getBody());
    expect(resultBody.activeSessions).toEqual(activeSessionIds);
    expect(resultBody.inactiveSessions).toEqual(inactiveSessionIds);
    expect(result.statusCode).toBe(200);
  });

  test('Error: Token is empty or invalid', () => {
    const user = JSON.parse(requestAuthRegister('myemail@email.com', 'shibainu1', 'Ethan', 'Wong').getBody());
    const quiz = JSON.parse(requestQuizCreate(user.token, 'myquiz', 'very fun quiz').getBody());
    requestQuestionCreate(quiz.quizId, user.token, 'what is 9 + 10?', 5, 10, standardAnswer, standardThumbnailUrl);
    requestSessionStart(10, quiz.quizId, user.token);
    const result = requestSessionList('fake token', quiz.quizId);
    expect(result.statusCode).toBe(401);
  });

  test('Error: User does not own this quiz', () => {
    const user = JSON.parse(requestAuthRegister('myemail@email.com', 'shibainu1', 'Ethan', 'Wong').getBody());
    const user1 = JSON.parse(requestAuthRegister('myotheremail@email.com', 'shibainu1', 'Ethan', 'Wrong').getBody());
    const quiz = JSON.parse(requestQuizCreate(user.token, 'myquiz', 'very fun quiz').getBody());
    requestQuestionCreate(quiz.quizId, user.token, 'what is 9 + 10?', 5, 10, standardAnswer, standardThumbnailUrl);
    requestSessionStart(10, quiz.quizId, user.token);
    const result = requestSessionList(user1.token, quiz.quizId);
    expect(result.statusCode).toEqual(403);
  });
});
