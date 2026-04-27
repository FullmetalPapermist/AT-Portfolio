import request from 'sync-request-curl';
import { port, url } from '../config.json';

const SERVER_URL = `${url}:${port}`;

interface ErrorResponse {
  error: string;
}

interface RegisterResponse {
  token: string;
}

interface Quiz {
  quizId: number;
  name: string;
}

// Causes lint issues!
// interface QuizListResponse {
//   quizzes: Quiz[];
// }

interface UserDetailsResponse {
  userId: number;
  name: string;
  email: string;
  numSuccessfulLogins: number;
  numFailedPasswordsSinceLastLogin: number;
}

function requestClear() {
  request('DELETE', SERVER_URL + '/v1/clear', {
    timeout: 100
  });
}

function requestAdminUserDetails(token: string): {user: UserDetailsResponse} | ErrorResponse {
  const response = request('GET', SERVER_URL + '/v2/admin/user/details', {
    qs: { token }
  });

  return JSON.parse(response.body.toString());
}

function requestAuthRegister(email: string, password: string, nameFirst:string, nameLast:string): RegisterResponse | ErrorResponse {
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

export function requestAdminQuizList(token: string): { quizzes: Quiz[] } | ErrorResponse {
  const response = request('GET', `${url}:${port}/v2/admin/quiz/list`, {
    qs: { token }
  });

  return JSON.parse(response.body.toString());
}

function requestAdminQuizCreate(token: string, name: string, description: string) {
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

beforeEach(() => {
  requestClear();
});

describe('readminAdminQuizList', () => {
  const email1 = 'youremail11@email11.com';
  const password1 = 'passsword1';
  const firstName1 = 'Sam';
  const lastName1 = 'Wang';

  const email2 = 'user2@email.com';
  const password2 = 'password2';
  const firstName2 = 'Bob';
  const lastName2 = 'White';

  // Test for invalid AuthUserId
  test('error: invalid AuthUserId', () => {
    let token: string;

    const registerResponse = requestAuthRegister(
      email1,
      password1,
      firstName1,
      lastName1
    );

    if ('token' in registerResponse) {
      token = registerResponse.token;
    }

    const result = requestAdminUserDetails(token + 'INVALID');

    expect(result).toEqual({
      error: expect.any(String)
    });
  });

  // Test for a valid user with no quizzes created
  test('valid user with no quizzes created', () => {
    let token: string;

    const registerResponse = requestAuthRegister(
      email1,
      password1,
      firstName1,
      lastName1
    );

    if ('token' in registerResponse) {
      token = registerResponse.token;
    }

    const quizListResult = requestAdminQuizList(token);

    expect(quizListResult).toEqual({
      quizzes: []
    });
  });

  // Test for creating a user and creating 2 quizzes under the user
  test('create user and 2 quizzes under the user', () => {
    const registerResponse = requestAuthRegister(
      email1,
      password1,
      firstName1,
      lastName1
    );

    let token: string;

    if ('token' in registerResponse) {
      token = registerResponse.token;
    }

    const res1 = requestAdminQuizCreate(token, 'Quiz 1', '');
    const res2 = requestAdminQuizCreate(token, 'Quiz 2', '');

    const quizListResult = requestAdminQuizList(token);

    const quiz1 = JSON.parse(res1.getBody());
    const quiz2 = JSON.parse(res2.getBody());

    expect(quizListResult).toEqual({
      quizzes: [
        {
          quizId: quiz1.quizId,
          name: 'Quiz 1'
        },
        {
          quizId: quiz2.quizId,
          name: 'Quiz 2'
        }
      ]
    });
  });

  test('create two users and verify quizzes for each', () => {
    const registerResponse1 = requestAuthRegister(
      email1,
      password1,
      firstName1,
      lastName1
    );

    let token1: string;
    if ('token' in registerResponse1) {
      token1 = registerResponse1.token;
    }

    const registerResponse2 = requestAuthRegister(
      email2,
      password2,
      firstName2,
      lastName2
    );

    let token2: string;
    if ('token' in registerResponse2) {
      token2 = registerResponse2.token;
    }

    const res1User1 = requestAdminQuizCreate(token1, 'Quiz 1 for User 1', '');
    const res2User1 = requestAdminQuizCreate(token1, 'Quiz 2 for User 1', '');

    const res1User2 = requestAdminQuizCreate(token2, 'Quiz 1 for User 2', '');
    const res2User2 = requestAdminQuizCreate(token2, 'Quiz 2 for User 2', '');

    const quizListResult1 = requestAdminQuizList(token1);
    const quizListResult2 = requestAdminQuizList(token2);

    const quiz1User1 = JSON.parse(res1User1.getBody());
    const quiz2User1 = JSON.parse(res2User1.getBody());

    expect(quizListResult1).toEqual({
      quizzes: [
        {
          quizId: quiz1User1.quizId,
          name: 'Quiz 1 for User 1',
        },
        {
          quizId: quiz2User1.quizId,
          name: 'Quiz 2 for User 1',
        },
      ],
    });

    const quiz1User2 = JSON.parse(res1User2.getBody());
    const quiz2User2 = JSON.parse(res2User2.getBody());

    expect(quizListResult2).toEqual({
      quizzes: [
        {
          quizId: quiz1User2.quizId,
          name: 'Quiz 1 for User 2',
        },
        {
          quizId: quiz2User2.quizId,
          name: 'Quiz 2 for User 2',
        },
      ],
    });
  });
});
