// NOTE using quizid as a field since in the example used it '/v2/admin/quiz/{quizid}/name
// however the coded responses have quizId
// currently returning authUserId not token

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

function requestQuizNameUpdate(quizId: number, token: string, name: string) {
  return request('PUT', SERVER_URL + `/v2/admin/quiz/${quizId}:quizid/name`, {
    headers: {
      token: token,
    },
    json: {
      name: name,
    },
  });
}

beforeEach(() => {
  requestClear();
});

describe('adminQuizNameUpdate Server Tests', () => {
  test('ERROR 401: Token is empty or invalid', () => {
    let token: string;
    const registerResponse = requestAuthRegister('validemail1@gmail.com', 'StrongPassword1', 'Justin', 'Tran');
    if ('token' in registerResponse) {
      token = registerResponse.token;
    }

    const quizResponse = requestQuizCreate(token, 'quiz123', 'default quiz');
    const quizId = JSON.parse(quizResponse.getBody()).quizId;

    const response = requestQuizNameUpdate(quizId, token + 'INVALID', 'new name for quiz');
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

    const quizResponse = requestQuizCreate(token1, 'quiz123', 'default quiz');
    const quizId = JSON.parse(quizResponse.getBody()).quizId;

    let token2: string;
    registerResponse = requestAuthRegister('validemail3@gmail.com', 'StrongPassword1', 'Jayden', 'Phan');
    if ('token' in registerResponse) {
      token2 = registerResponse.token;
    }

    const response = requestQuizNameUpdate(quizId, token2, 'new name for quiz');
    const bodyObj = JSON.parse(response.body as string);
    expect(response.statusCode).toBe(FORBIDDEN);
    expect(bodyObj.error).toStrictEqual(expect.any(String));
  });

  test('ERROR 400: Quiz ID does not refer to a valid quiz', () => {
    let token: string;
    const registerResponse = requestAuthRegister('validemail1@gmail.com', 'StrongPassword1', 'Justin', 'Tran');
    if ('token' in registerResponse) {
      token = registerResponse.token;
    }

    const quizId = -999;

    const response = requestQuizNameUpdate(quizId, token, 'new name for quiz');
    const bodyObj = JSON.parse(response.body as string);
    expect(response.statusCode).toBe(INPUT_ERROR);
    expect(bodyObj.error).toStrictEqual(expect.any(String));
  });

  test('ERROR 400: Name contains invalid characters. Valid characters are alphanumeric and spaces', () => {
    let token: string;
    const registerResponse = requestAuthRegister('validemail1@gmail.com', 'StrongPassword1', 'Justin', 'Tran');
    if ('token' in registerResponse) {
      token = registerResponse.token;
    }

    const quizResponse = requestQuizCreate(token, 'quiz123', 'default quiz');
    const quizId = JSON.parse(quizResponse.getBody()).quizId;

    const response = requestQuizNameUpdate(quizId, token, 'error!@#$%^&*()');
    const bodyObj = JSON.parse(response.body as string);
    expect(response.statusCode).toBe(INPUT_ERROR);
    expect(bodyObj.error).toStrictEqual(expect.any(String));
  });

  test('ERROR 400: Name is either less than 3 characters long or more than 30 characters long', () => {
    let token: string;
    const registerResponse = requestAuthRegister('validemail1@gmail.com', 'StrongPassword1', 'Justin', 'Tran');
    if ('token' in registerResponse) {
      token = registerResponse.token;
    }

    const quizResponse = requestQuizCreate(token, 'quiz123', 'default quiz');
    const quizId = JSON.parse(quizResponse.getBody()).quizId;

    let response = requestQuizNameUpdate(quizId, token, 'xx');
    let bodyObj = JSON.parse(response.body as string);
    expect(response.statusCode).toBe(INPUT_ERROR);
    expect(bodyObj.error).toStrictEqual(expect.any(String));

    response = requestQuizNameUpdate(quizId, token, 'this is a very long name over thirty characters long');
    bodyObj = JSON.parse(response.body as string);
    expect(response.statusCode).toBe(INPUT_ERROR);
    expect(bodyObj.error).toStrictEqual(expect.any(String));
  });

  test('ERROR400 : Name is already used by the current logged in user for another quiz', () => {
    let token: string;
    const registerResponse = requestAuthRegister('validemail1@gmail.com', 'StrongPassword1', 'Justin', 'Tran');
    if ('token' in registerResponse) {
      token = registerResponse.token;
    }

    requestQuizCreate(token, 'Duplicate', 'default quiz');

    const quizResponse2 = requestQuizCreate(token, 'First Quiz', 'Working second quiz');
    const quizId = JSON.parse(quizResponse2.getBody()).quizId;

    const response = requestQuizNameUpdate(quizId, token, 'Duplicate');
    const bodyObj = JSON.parse(response.body as string);
    expect(response.statusCode).toBe(INPUT_ERROR);
    expect(bodyObj.error).toStrictEqual(expect.any(String));
  });

  test('Successful: one change with correct status code', () => {
    let token: string;
    const registerResponse = requestAuthRegister('validemail1@gmail.com', 'StrongPassword1', 'Justin', 'Tran');
    if ('token' in registerResponse) {
      token = registerResponse.token;
    }

    const quizResponse = requestQuizCreate(token, 'quiz123', 'default quiz');
    const quizId = JSON.parse(quizResponse.getBody()).quizId;

    const response = requestQuizNameUpdate(quizId, token, 'first change');
    expect(response.statusCode).toBe(OK);
    expect(JSON.parse(response.getBody())).toStrictEqual({
    });
  });

  test('Successful: multiple changes with correct status code', () => {
    let token: string;
    const registerResponse = requestAuthRegister('validemail1@gmail.com', 'StrongPassword1', 'Justin', 'Tran');
    if ('token' in registerResponse) {
      token = registerResponse.token;
    }

    const quizResponse = requestQuizCreate(token, 'quiz123', 'default quiz');
    const quizId = JSON.parse(quizResponse.getBody()).quizId;

    let response = requestQuizNameUpdate(quizId, token, 'first change');
    expect(response.statusCode).toBe(OK);
    expect(JSON.parse(response.getBody())).toStrictEqual({
    });

    response = requestQuizNameUpdate(quizId, token, 'second');
    expect(response.statusCode).toBe(OK);
    expect(JSON.parse(response.getBody())).toStrictEqual({
    });

    response = requestQuizNameUpdate(quizId, token, '12345');
    expect(response.statusCode).toBe(OK);
    expect(JSON.parse(response.getBody())).toStrictEqual({
    });
  });
});
