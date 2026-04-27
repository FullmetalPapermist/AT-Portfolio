// NOTE missing two test 401 and the one with quiz has to be end

import request from 'sync-request-curl';
import { port, url } from '../config.json';

const SERVER_URL = `${url}:${port}`;
const INPUT_ERROR = 400;
const UNAUTHOURIZED = 401;
const FORBIDDEN = 403;
const OK = 200;

interface ErrorResponse {
  error: string;
}

interface RegisterResponse {
  token: string;
}

function requestClear() {
  return request('DELETE', SERVER_URL + '/v1/clear', {
    timeout: 100
  }
  );
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

function requestQuizTransfer(quizId: number, token: string, userEmail: string) {
  return request('POST', SERVER_URL + `/v2/admin/quiz/${quizId}:quizid/transfer`, {
    headers: {
      token: token,
    },
    json: {
      userEmail: userEmail,
    },
  });
}

beforeEach(() => {
  requestClear();
});

describe('adminQuizTransfer', () => {
  // TODO have to utilise logout to get an invalid token
  test('ERROR 401: Token is empty or invalid (does not refer to valid logged in user session)', () => {
    let token: string;
    const registerResponse = requestAuthRegister('validemail1@gmail.com', 'StrongPassword1', 'Justin', 'Tran');
    if ('token' in registerResponse) {
      token = registerResponse.token;
    }

    const quizResponse = requestQuizCreate(token, 'quiz123', 'default quiz');
    const quizId = JSON.parse(quizResponse.getBody()).quizId;

    const response = requestQuizTransfer(quizId, token + 'INVALID', 'newquizowner1@gmail.com');
    const bodyObj = JSON.parse(response.body as string);
    expect(response.statusCode).toBe(UNAUTHOURIZED);
    expect(bodyObj.error).toStrictEqual(expect.any(String));
  });

  test('ERROR 403: Valid token is provided, but user is not an owner of this quiz', () => {
    let token1: string;
    let registerResponse = requestAuthRegister('validemail1@gmail.com', 'StrongPassword1', 'Justin', 'Tran');
    if ('token' in registerResponse) {
      token1 = registerResponse.token;
    }

    registerResponse = requestAuthRegister('newquizowner1@gmail.com', 'StrongPassword1', 'New', 'Owner');

    let token2: string;
    registerResponse = requestAuthRegister('validemail20@gmail.com', 'StrongPassword1', 'Gary', 'Stu');
    if ('token' in registerResponse) {
      token2 = registerResponse.token;
    }

    const quizResponse = requestQuizCreate(token2, 'quiz123', 'default quiz');
    const quizId = JSON.parse(quizResponse.getBody()).quizId;

    const result = requestQuizTransfer(quizId, token1, 'newquizowner1@gmail.com');
    const bodyObj = JSON.parse(result.body as string);
    expect(result.statusCode).toBe(FORBIDDEN);
    expect(bodyObj.error).toStrictEqual(expect.any(String));
  });

  test('ERROR 400: Quiz ID does not refer to a valid quiz', () => {
    let token: string;
    let registerResponse = requestAuthRegister('validemail1@gmail.com', 'StrongPassword1', 'Justin', 'Tran');
    if ('token' in registerResponse) {
      token = registerResponse.token;
    }
    requestQuizCreate(token, 'quiz123', 'default quiz');

    const quizId = -999;

    registerResponse = requestAuthRegister('newquizowner1@gmail.com', 'StrongPassword1', 'New', 'Owner');

    const result = requestQuizTransfer(quizId, token, 'newquizowner1@gmail.com');
    const bodyObj = JSON.parse(result.body as string);
    expect(result.statusCode).toBe(INPUT_ERROR);
    expect(bodyObj.error).toStrictEqual(expect.any(String));
  });

  test('ERROR 400: userEmail is not a real user', () => {
    let token: string;
    const registerResponse = requestAuthRegister('validemail1@gmail.com', 'StrongPassword1', 'Justin', 'Tran');
    if ('token' in registerResponse) {
      token = registerResponse.token;
    }

    const quizResponse = requestQuizCreate(token, 'quiz123', 'default quiz');
    const quizId = JSON.parse(quizResponse.getBody()).quizId;

    const result = requestQuizTransfer(quizId, token, 'notrealuseremail1@gmail.com');
    const bodyObj = JSON.parse(result.body as string);
    expect(result.statusCode).toBe(INPUT_ERROR);
    expect(bodyObj.error).toStrictEqual(expect.any(String));
  });

  test('ERROR 400: userEmail is the current logged in user', () => {
    let token: string;
    const registerResponse = requestAuthRegister('validemail1@gmail.com', 'StrongPassword1', 'Justin', 'Tran');
    if ('token' in registerResponse) {
      token = registerResponse.token;
    }
    const quizResponse = requestQuizCreate(token, 'quiz123', 'default quiz');
    const quizId = JSON.parse(quizResponse.getBody()).quizId;

    const result = requestQuizTransfer(quizId, token, 'validemail1@gmail.com');
    const bodyObj = JSON.parse(result.body as string);
    expect(result.statusCode).toBe(INPUT_ERROR);
    expect(bodyObj.error).toStrictEqual(expect.any(String));
  });

  test('ERROR 400: Quiz ID refers to a quiz that has a name that is already used by the target user', () => {
    let token1: string;
    let registerResponse = requestAuthRegister('validemail1@gmail.com', 'StrongPassword1', 'Justin', 'Tran');
    if ('token' in registerResponse) {
      token1 = registerResponse.token;
    }
    let quizResponse = requestQuizCreate(token1, 'quiz123', 'default quiz');
    const quizId = JSON.parse(quizResponse.getBody()).quizId;

    let token2: string;
    registerResponse = requestAuthRegister('newquizowner1@gmail.com', 'StrongPassword1', 'New', 'Owner');
    if ('token' in registerResponse) {
      token2 = registerResponse.token;
    }
    quizResponse = requestQuizCreate(token2, 'quiz123', 'default quiz');

    const result = requestQuizTransfer(quizId, token1, 'newquizowner1@gmail.com');
    const bodyObj = JSON.parse(result.body as string);
    expect(result.statusCode).toBe(INPUT_ERROR);
    expect(bodyObj.error).toStrictEqual(expect.any(String));
  });

  // // // test.todo('ERROR 400: All sessions for this quiz must be in END state', () => {

  // // // });

  test('SUCCESS: One quiz Change', () => {
    let token: string;
    let registerResponse = requestAuthRegister('validemail1@gmail.com', 'StrongPassword1', 'Justin', 'Tran');
    if ('token' in registerResponse) {
      token = registerResponse.token;
    }
    const quizResponse = requestQuizCreate(token, 'quiz123', 'default quiz');
    const quizId = JSON.parse(quizResponse.getBody()).quizId;

    registerResponse = requestAuthRegister('newquizowner1@gmail.com', 'StrongPassword1', 'New', 'Owner');

    const result = requestQuizTransfer(quizId, token, 'newquizowner1@gmail.com');
    expect(result.statusCode).toBe(OK);
    expect(JSON.parse(result.getBody())).toStrictEqual({
    });
  });

  test('SUCCESS: Two quizs from same user transfer to one user', () => {
    let token: string;
    let registerResponse = requestAuthRegister('validemail1@gmail.com', 'StrongPassword1', 'Justin', 'Tran');
    if ('token' in registerResponse) {
      token = registerResponse.token;
    }
    let quizResponse = requestQuizCreate(token, 'quiz123', 'default quiz');
    const quizId = JSON.parse(quizResponse.getBody()).quizId;

    registerResponse = requestAuthRegister('newquizowner1@gmail.com', 'StrongPassword1', 'New', 'Owner');

    let result = requestQuizTransfer(quizId, token, 'newquizowner1@gmail.com');
    expect(result.statusCode).toBe(OK);
    expect(JSON.parse(result.getBody())).toStrictEqual({
    });

    quizResponse = requestQuizCreate(token, 'quiz1234', 'default quiz second');
    const quizId2 = JSON.parse(quizResponse.getBody()).quizId;

    result = requestQuizTransfer(quizId2, token, 'newquizowner1@gmail.com');
    expect(result.statusCode).toBe(OK);
    expect(JSON.parse(result.getBody())).toStrictEqual({
    });
  });

  test('SUCCESS: Two quizs from different users transfer to one user', () => {
    let token1: string;
    let registerResponse = requestAuthRegister('validemail1@gmail.com', 'StrongPassword1', 'Justin', 'Tran');
    if ('token' in registerResponse) {
      token1 = registerResponse.token;
    }
    let quizResponse = requestQuizCreate(token1, 'quiz123', 'default quiz');
    const quizId = JSON.parse(quizResponse.getBody()).quizId;

    registerResponse = requestAuthRegister('newquizowner1@gmail.com', 'StrongPassword1', 'New', 'Owner');

    let result = requestQuizTransfer(quizId, token1, 'newquizowner1@gmail.com');
    expect(result.statusCode).toBe(OK);
    expect(JSON.parse(result.getBody())).toStrictEqual({
    });

    let token2: string;
    registerResponse = requestAuthRegister('validemail20@gmail.com', 'StrongPassword1', 'Gary', 'Stu');
    if ('token' in registerResponse) {
      token2 = registerResponse.token;
    }
    quizResponse = requestQuizCreate(token2, 'quiz1234', 'second default quiz');
    const quizId2 = JSON.parse(quizResponse.getBody()).quizId;

    result = requestQuizTransfer(quizId2, token2, 'newquizowner1@gmail.com');
    expect(result.statusCode).toBe(OK);
    expect(JSON.parse(result.getBody())).toStrictEqual({
    });
  });

  test('SUCCESS: One quiz transfer to user, then transfer back', () => {
    let token1: string;
    let registerResponse = requestAuthRegister('validemail1@gmail.com', 'StrongPassword1', 'Justin', 'Tran');
    if ('token' in registerResponse) {
      token1 = registerResponse.token;
    }
    const quizResponse = requestQuizCreate(token1, 'quiz123', 'default quiz');
    const quizId = JSON.parse(quizResponse.getBody()).quizId;

    let token2: string;
    registerResponse = requestAuthRegister('validemail20@gmail.com', 'StrongPassword1', 'Gary', 'Stu');
    if ('token' in registerResponse) {
      token2 = registerResponse.token;
    }

    let result = requestQuizTransfer(quizId, token1, 'validemail20@gmail.com');
    expect(result.statusCode).toBe(OK);
    expect(JSON.parse(result.getBody())).toStrictEqual({
    });

    result = requestQuizTransfer(quizId, token2, 'validemail1@gmail.com');
    expect(result.statusCode).toBe(OK);
    expect(JSON.parse(result.getBody())).toStrictEqual({
    });
  });
});
