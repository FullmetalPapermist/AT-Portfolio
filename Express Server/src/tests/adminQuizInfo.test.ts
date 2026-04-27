import request from 'sync-request-curl';
import { port, url } from '../config.json';

const SERVER_URL = `${url}:${port}`;

function requestAuthRegister(email: string, password: string, nameFirst:string, nameLast:string) {
  const response = request('POST', SERVER_URL + '/v1/admin/auth/register', {
    json: {
      email: email,
      password: password,
      nameFirst: nameFirst,
      nameLast: nameLast,
    },
  });
  return JSON.parse(response.getBody());
}

function requestQuizCreate(token: string, name: string, description: string) {
  const response = request('POST', SERVER_URL + '/v2/admin/quiz', {
    headers: {
      token: token,
    },
    json: {
      name: name,
      description: description
    },
  });
  return JSON.parse(response.getBody());
}

export function requestQuizInfo(token: string, quizId: number) {
  return request('GET', SERVER_URL + '/v2/admin/quiz/' + quizId, {
    headers: { token: token }
  });
}

function requestClear() {
  return request('DELETE', SERVER_URL + '/v1/clear');
}

beforeEach(() => {
  requestClear();
});

describe('adminQuizInfo', () => {
  const email1 = 'youremail@email.com';
  const password1 = 'password1';
  const firstName1 = 'firstName';
  const lastName1 = 'lastName';
  const quizName1 = 'quizName';
  const quizDesc = 'example quiz';

  // AuthUserId is not a valid user
  test('error: not a valid AuthUserId', () => {
    const user = requestAuthRegister(email1, password1, firstName1, lastName1);
    const quiz = requestQuizCreate(user.token, quizName1, quizDesc);
    const response = requestQuizInfo('faketoken', quiz.quizId);
    expect(response.statusCode).toBe(401);
    expect(JSON.parse(response.body as string)).toStrictEqual({
      error: expect.any(String)
    });
  });

  // Quiz ID does not refer to a quiz that this user owns
  test("error: user doesn't own this quiz", () => {
    const user = requestAuthRegister(email1, password1, firstName1, lastName1);
    const quiz = requestQuizCreate(user.token, quizName1, quizDesc);
    const invalidUser = requestAuthRegister('email@email.com', 'password1', 'firstName', 'lastName');
    const response = requestQuizInfo(invalidUser.token, quiz.quizId);
    expect(response.statusCode).toBe(403);
    expect(JSON.parse(response.body as string)).toStrictEqual({
      error: expect.any(String)
    });
  });

  test('success: returned the quiz details', () => {
    const user = requestAuthRegister(email1, password1, firstName1, lastName1);
    const quiz = requestQuizCreate(user.token, quizName1, quizDesc);
    const response = requestQuizInfo(user.token, quiz.quizId);
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.getBody())).toStrictEqual({
      quizId: quiz.quizId,
      name: quizName1,
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: quizDesc,
      questions: expect.any(Array),
      duration: expect.any(Number),
    });
  });

  test('complex success: returned the quiz details', () => {
    const user = requestAuthRegister(email1, password1, firstName1, lastName1);
    const user2 = requestAuthRegister('email2@email.com', password1, firstName1, lastName1);
    const quiz = requestQuizCreate(user.token, quizName1, quizDesc);
    const quiz2 = requestQuizCreate(user2.token, 'quiz2', 'quiz description');
    const response = requestQuizInfo(user.token, quiz.quizId);
    expect(JSON.parse(response.getBody())).toStrictEqual({
      quizId: quiz.quizId,
      name: quizName1,
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: quizDesc,
      questions: expect.any(Array),
      duration: expect.any(Number),
    });
    const response2 = requestQuizInfo(user2.token, quiz2.quizId);
    expect(JSON.parse(response2.getBody())).toStrictEqual({
      quizId: quiz2.quizId,
      name: 'quiz2',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: 'quiz description',
      questions: expect.any(Array),
      duration: expect.any(Number),
    });
  });
});
