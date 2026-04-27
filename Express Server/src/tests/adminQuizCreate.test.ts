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

export function requestQuizCreate(token: string, name: string, description: string) {
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

describe('adminQuizCreate Server Tests', () => {
  test('Check successful quiz creation', () => {
    const response = requestAuthRegister('validemail20@gmail.com', 'StrongPassword1', 'Gary', 'Stu');
    let token: string;
    if ('token' in response) {
      token = response.token;
    }
    const res = requestQuizCreate(token, 'quiz123', 'default quiz');
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.getBody())).toStrictEqual({ quizId: expect.any(Number) });
  });

  test('Quiz name with invalid characters is rejected', () => {
    const response = requestAuthRegister('validemail20@gmail.com', 'StrongPassword1', 'Gary', 'Stu');
    let token: string;
    if ('token' in response) {
      token = response.token;
    }
    const res = requestQuizCreate(token, 'TE$T', 'default quiz');
    expect(res.statusCode).toBe(400);
    const bodyObj = JSON.parse(res.body as string);
    expect(bodyObj.error).toStrictEqual(expect.any(String));
  });

  test('Create quiz with empty name', () => {
    const response = requestAuthRegister('validemail20@gmail.com', 'StrongPassword1', 'Gary', 'Stu');
    let token: string;
    if ('token' in response) {
      token = response.token;
    }
    const res = requestQuizCreate(token, '', 'default quiz');
    expect(res.statusCode).toBe(400);
    const bodyObj = JSON.parse(res.body as string);
    expect(bodyObj.error).toStrictEqual(expect.any(String));
  });

  test('Create quiz with short name', () => {
    const response = requestAuthRegister('validemail20@gmail.com', 'StrongPassword1', 'Gary', 'Stu');
    let token: string;
    if ('token' in response) {
      token = response.token;
    }
    const res = requestQuizCreate(token, 'qz', 'default quiz');
    expect(res.statusCode).toBe(400);
    const bodyObj = JSON.parse(res.body as string);
    expect(bodyObj.error).toStrictEqual(expect.any(String));
  });

  test('Create quiz with long name', () => {
    const response = requestAuthRegister('validemail20@gmail.com', 'StrongPassword1', 'Gary', 'Stu');
    let token: string;
    if ('token' in response) {
      token = response.token;
    }
    const res = requestQuizCreate(token, 'QuizQuizQuizQuizQuizQuizQuizQui', 'default quiz');
    expect(res.statusCode).toBe(400);
    const bodyObj = JSON.parse(res.body as string);
    expect(bodyObj.error).toStrictEqual(expect.any(String));
  });

  test('Create quiz with long description', () => {
    const response = requestAuthRegister('validemail20@gmail.com', 'StrongPassword1', 'Gary', 'Stu');
    let token: string;
    if ('token' in response) {
      token = response.token;
    }
    const res = requestQuizCreate(token, 'Quiz', 'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
    expect(res.statusCode).toBe(400);
    const bodyObj = JSON.parse(res.body as string);
    expect(bodyObj.error).toStrictEqual(expect.any(String));
  });

  test('Create quiz with invalid token', () => {
    const response = requestAuthRegister('validemail20@gmail.com', 'StrongPassword1', 'Gary', 'Stu');
    let token: string;
    if ('token' in response) {
      token = response.token;
    }
    const res = requestQuizCreate(token + 'bad', 'quiz', 'default quiz');
    expect(res.statusCode).toBe(401);
    const bodyObj = JSON.parse(res.body as string);
    expect(bodyObj.error).toStrictEqual(expect.any(String));
  });

  test('Create quiz with duplicate name to another quiz which user already owns', () => {
    const response = requestAuthRegister('validemail20@gmail.com', 'StrongPassword1', 'Gary', 'Stu');
    let token: string;
    if ('token' in response) {
      token = response.token;
    }
    const res = requestQuizCreate(token, 'quiz123', 'default quiz');
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.getBody())).toStrictEqual({ quizId: expect.any(Number) });
    const res2 = requestQuizCreate(token, 'quiz123', 'default2 quiz');
    expect(res2.statusCode).toBe(400);
    const bodyObj = JSON.parse(res2.body as string);
    expect(bodyObj.error).toStrictEqual(expect.any(String));
  });
});
