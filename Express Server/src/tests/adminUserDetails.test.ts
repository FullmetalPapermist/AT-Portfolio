import request from 'sync-request-curl';
import { port, url } from '../config.json';

const SERVER_URL = `${url}:${port}`;

interface ErrorResponse {
    error: string;
}

interface RegisterResponse {
    token: string;
}

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

function requestAdminUserDetails(token: string): {user: UserDetailsResponse} | ErrorResponse {
  const response = request('GET', SERVER_URL + '/v2/admin/user/details', {
    qs: { token }
  });

  return JSON.parse(response.body.toString());
}

beforeEach(() => {
  requestClear();
});

describe('requestAdminUserDetails', () => {
  const email = 'youremail@email.com';
  const password = 'passsword1';
  const firstName = 'firstName';
  const lastName = 'lastName';

  // test for invalid Authid
  test('error: invalid AuthUserId', () => {
    let token: string;
    const registerResponse = requestAuthRegister(email, password, firstName, lastName);
    if ('token' in registerResponse) {
      token = registerResponse.token;
    }

    const result = requestAdminUserDetails(token + 'INVALID');
    expect(result).toEqual({
      error: expect.any(String)
    });
  });

  test('valid AuthUserId', () => {
    let token: string;
    const registerResponse = requestAuthRegister(email, password, firstName, lastName);
    if ('token' in registerResponse) {
      token = registerResponse.token;
    }

    const expectedNumSuccessfulLogins = 1;
    const expectedNumFailedPasswordsSinceLastLogin = 0;

    const result = requestAdminUserDetails(token);
    const fullName = `${firstName} ${lastName}`;

    // Adjust the expected result to only include the "user" object
    expect(result).toEqual({
      user: {
        authUserId: expect.any(Number),
        name: fullName,
        email: email,
        numSuccessfulLogins: expectedNumSuccessfulLogins,
        numFailedPasswordsSinceLastLogin: expectedNumFailedPasswordsSinceLastLogin,
      }
    });
  });
});
