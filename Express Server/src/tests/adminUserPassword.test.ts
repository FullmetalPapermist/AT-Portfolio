import request from 'sync-request-curl';
import { port, url } from '../config.json';

const SERVER_URL = `${url}:${port}`;
const INPUT_ERROR = 400;
const UNAUTHOURIZED = 401;

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

function requestUserPassword(token: string, oldPassword: string, newPassword:string) {
  return request('PUT', SERVER_URL + '/v2/admin/user/password', {
    headers: {
      token: token,
    },
    json: {
      oldPassword: oldPassword,
      newPassword: newPassword,
    },
  });
}

beforeEach(() => {
  requestClear();
});

describe('adminUserPassword', () => {
  // this test is waiting for adminLogOut

  test('ERROR 401: Token is empty or invalid', () => {
    let token: string;
    const registerResponse = requestAuthRegister('validemail1@gmail.com', 'StrongPassword1', 'Justin', 'Tran');
    if ('token' in registerResponse) {
      token = registerResponse.token;
    }

    const response = requestUserPassword(token + 'INVALID', 'StrongPassword1', 'NewValidPass2');
    const bodyObj = JSON.parse(response.body as string);
    expect(response.statusCode).toBe(UNAUTHOURIZED);
    expect(bodyObj.error).toStrictEqual(expect.any(String));
  });

  test('Old Password is not the correct old password', () => {
    const registerResponse = requestAuthRegister('validemail20@gmail.com', 'StrongPassword1', 'Gary', 'Stu');
    let token: string;
    if ('token' in registerResponse) {
      token = registerResponse.token;
    }

    const response = requestUserPassword(token, 'NotOldPass2', 'NewValidPass2');
    const bodyObj = JSON.parse(response.body as string);
    expect(response.statusCode).toBe(INPUT_ERROR);
    expect(bodyObj.error).toStrictEqual(expect.any(String));
  });

  test('Old Password and New Password match exactly', () => {
    let token: string;
    const registerResponse = requestAuthRegister('validemail1@gmail.com', 'OldPassword1', 'Justin', 'Tran');
    if ('token' in registerResponse) {
      token = registerResponse.token;
    }

    const response = requestUserPassword(token, 'OldPassword1', 'OldPassword1');
    const bodyObj = JSON.parse(response.body as string);
    expect(response.statusCode).toBe(INPUT_ERROR);
    expect(bodyObj.error).toStrictEqual(expect.any(String));
  });

  test('New Password has already been used before by this user', () => {
    let token: string;
    const registerResponse = requestAuthRegister('validemail1@gmail.com', 'OldPassword1', 'Justin', 'Tran');
    if ('token' in registerResponse) {
      token = registerResponse.token;
    }

    let response = requestUserPassword(token, 'OldPassword1', 'ValidChangePass2');
    expect(response.statusCode).toBe(OK);
    expect(JSON.parse(response.getBody())).toStrictEqual({
    });

    response = requestUserPassword(token, 'ValidChangePass2', 'OldPassword1');
    const bodyObj = JSON.parse(response.body as string);
    expect(response.statusCode).toBe(INPUT_ERROR);
    expect(bodyObj.error).toStrictEqual(expect.any(String));
  });

  test('New Password is less than 8 characters', () => {
    let token: string;
    const registerResponse = requestAuthRegister('validemail1@gmail.com', 'OldPassword1', 'Justin', 'Tran');
    if ('token' in registerResponse) {
      token = registerResponse.token;
    }

    const response = requestUserPassword(token, 'OldPassword1', 'Short1');
    const bodyObj = JSON.parse(response.body as string);
    expect(response.statusCode).toBe(INPUT_ERROR);
    expect(bodyObj.error).toStrictEqual(expect.any(String));
  });

  test('New Password does not contain at least one number and at least one letter', () => {
    let token: string;
    const registerResponse = requestAuthRegister('validemail1@gmail.com', 'OldPassword1', 'Justin', 'Tran');
    if ('token' in registerResponse) {
      token = registerResponse.token;
    }

    let response = requestUserPassword(token, 'OldPassword1', '1234567890');
    let bodyObj = JSON.parse(response.body as string);
    expect(response.statusCode).toBe(INPUT_ERROR);
    expect(bodyObj.error).toStrictEqual(expect.any(String));

    response = requestUserPassword(token, 'OldPassword1', 'Invalid Password No Number');
    bodyObj = JSON.parse(response.body as string);
    expect(response.statusCode).toBe(INPUT_ERROR);
    expect(bodyObj.error).toStrictEqual(expect.any(String));
  });

  test('SUCCESS: One User, multiple changes', () => {
    let token: string;
    const registerResponse = requestAuthRegister('validemail1@gmail.com', 'OldPassword1', 'Justin', 'Tran');
    if ('token' in registerResponse) {
      token = registerResponse.token;
    }

    let response = requestUserPassword(token, 'OldPassword1', 'Valid Password Change 3');
    expect(response.statusCode).toBe(OK);
    expect(JSON.parse(response.getBody())).toStrictEqual({
    });

    response = requestUserPassword(token, 'Valid Password Change 3', 'Second Valid Change 23');
    expect(response.statusCode).toBe(OK);
    expect(JSON.parse(response.getBody())).toStrictEqual({
    });
  });

  test('SUCCESS: Multi User, multiple changes', () => {
    let token1: string;
    let registerResponse = requestAuthRegister('validemail1@gmail.com', 'OldPassword1', 'Justin', 'Tran');
    if ('token' in registerResponse) {
      token1 = registerResponse.token;
    }

    let token2: string;
    registerResponse = requestAuthRegister('validemail2@gmail.com', 'OldPassword2', 'Marcus', 'Ryan');
    if ('token' in registerResponse) {
      token2 = registerResponse.token;
    }

    let response = requestUserPassword(token1, 'OldPassword1', 'New Password 1');
    expect(response.statusCode).toBe(OK);
    expect(JSON.parse(response.getBody())).toStrictEqual({
    });

    response = requestUserPassword(token2, 'OldPassword2', 'New Password 2');
    expect(response.statusCode).toBe(OK);
    expect(JSON.parse(response.getBody())).toStrictEqual({
    });

    response = requestUserPassword(token1, 'New Password 1', 'New Password 2');
    expect(response.statusCode).toBe(OK);
    expect(JSON.parse(response.getBody())).toStrictEqual({
    });

    response = requestUserPassword(token2, 'New Password 2', 'New Password 1');
    expect(response.statusCode).toBe(OK);
    expect(JSON.parse(response.getBody())).toStrictEqual({
    });
  });
});
