import request from 'sync-request-curl';
import { port, url } from '../config.json';

const SERVER_URL = `${url}:${port}`;

interface ErrorResponse {
  error: string;
}

interface RegisterResponse {
  token: string;
}

function requestClear() {
  return request('DELETE', `${url}:${port}/v1/clear`, {
    timeout: 100
  }
  );
}

function requestQuizRemove(token: string, quizId: number) {
  return request('DELETE', SERVER_URL + '/v2/admin/quiz/' + quizId, {
    headers: {
      token: token
    },
  });
}

function requestQuizCreate(token: string, name: string, description: string) {
  return request('POST', SERVER_URL + '/v2/admin/quiz', {
    headers: {
      token: token,
    },
    json: {
      name: name,
      description: description
    },
  });
}

function requestAuthRegister(email: string, password: string, nameFirst:string, nameLast:string): RegisterResponse | ErrorResponse {
  return JSON.parse(request('POST', SERVER_URL + '/v1/admin/auth/register', {
    json: {
      email: email,
      password: password,
      nameFirst: nameFirst,
      nameLast: nameLast,
    },
  }).getBody());
}

beforeEach(() => {
  requestClear();
});

describe('adminQuizRemove Server Tests', () => {
  test('Check successful quiz removal', () => {
    const response = requestAuthRegister('validemail20@gmail.com', 'StrongPassword1', 'Gary', 'Stu');
    let token: string;
    if ('token' in response) {
      token = response.token;
    }
    const res = requestQuizCreate(token, 'quiz123', 'default quiz');
    expect(res.statusCode).toBe(200);
    const quiz = JSON.parse(res.body.toString());
    const res2 = requestQuizRemove(token, quiz.quizId);
    expect(res2.statusCode).toBe(200);
    // check new quiz with same name does not cause an error
    const res3 = requestQuizCreate(token, 'quiz123', 'default quiz');
    expect(JSON.parse(res3.getBody())).toStrictEqual({ quizId: expect.any(Number) });
  });

  test('token is invalid', () => {
    const response = requestAuthRegister('validemail20@gmail.com', 'StrongPassword1', 'Gary', 'Stu');
    let token: string;
    if ('token' in response) {
      token = response.token;
    }
    const res = requestQuizCreate(token, 'quiz123', 'default quiz');
    expect(res.statusCode).toBe(200);
    const quiz = JSON.parse(res.body.toString());
    const res2 = requestQuizRemove(token + 'bad', quiz.quizId);
    expect(res2.statusCode).toBe(401);
  });

  test('user is not an owner of the quiz', () => {
    const response = requestAuthRegister('validemail20@gmail.com', 'StrongPassword1', 'Gary', 'Stu');
    let token: string;
    if ('token' in response) {
      token = response.token;
    }
    const response2 = requestAuthRegister('avalidemail20@gmail.com', 'aStrongPassword1', 'aGary', 'aStu');
    let token2: string;
    if ('token' in response2) {
      token2 = response2.token;
    }
    const res = requestQuizCreate(token, 'quiz123', 'default quiz');
    expect(res.statusCode).toBe(200);
    const quiz = JSON.parse(res.body.toString());
    const res2 = requestQuizRemove(token2, quiz.quizId);
    expect(res2.statusCode).toBe(403);
  });

  test('two quizzes create, one deleted', () => {
    const response = requestAuthRegister('validemail20@gmail.com', 'StrongPassword1', 'Gary', 'Stu');
    let token: string;
    if ('token' in response) {
      token = response.token;
    }
    const res = requestQuizCreate(token, 'quiz123', 'default quiz');
    expect(res.statusCode).toBe(200);
    const res2 = requestQuizCreate(token, 'quiza123', 'default quiz');
    expect(res2.statusCode).toBe(200);
    const quiz = JSON.parse(res.body.toString());
    const res3 = requestQuizRemove(token, quiz.quizId);
    expect(res3.statusCode).toBe(200);
  });
});
