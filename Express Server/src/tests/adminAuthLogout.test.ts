import request from 'sync-request-curl';
import { port, url } from '../config.json';

const SERVER_URL = `${url}:${port}`;

function requestLogout(token: string) {
  return request('POST', SERVER_URL + '/v2/admin/auth/logout', {
    headers: {
      token: token
    },
  });
}

function requestAuthRegister(email: string, password: string, nameFirst: string, nameLast: string) {
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

function requestClear() {
  return request('DELETE', SERVER_URL + '/v1/clear');
}

function requestAuthLogin(email: string, password: string) {
  const response = request('POST', SERVER_URL + '/v2/admin/auth/login', {
    json: {
      email: email,
      password: password,
    },
  });
  return JSON.parse(response.getBody());
}

beforeEach(() => {
  requestClear();
});

describe('/v2/admin/auth/logout tests', () => {
  // If token not valid
  test('error: token not valid or existent', () => {
    requestAuthRegister('sussy@email.com', 'password1', 'Ethan', 'Wong');
    const response = requestLogout('Preminger');
    expect(response.statusCode).toBe(401);
  });

  // Success after register
  test('Success: user logged out after register', () => {
    const user = requestAuthRegister('sussy@email.com', 'password1', 'Shiba', 'Inu');
    const response = requestLogout(user.token);
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.getBody())).toStrictEqual({});
    const checkLogout = requestLogout(user.token);
    expect(checkLogout.statusCode).toBe(401);
  });

  // Success after login
  test('Success: one session of the user logged out after login', () => {
    requestAuthRegister('sussy@email.com', 'password1', 'Shiba', 'Inu');
    const loginUser = requestAuthLogin('sussy@email.com', 'password1');
    const response = requestLogout(loginUser.token);
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.getBody())).toStrictEqual({});
    const checkLogout = requestLogout(loginUser.token);
    expect(checkLogout.statusCode).toBe(401);
  });
});
