import request from 'sync-request-curl';
import { port, url } from '../config.json';

const SERVER_URL = `${url}:${port}`;
const INPUT_ERROR = 400;

function requestClear() {
  return request('DELETE', SERVER_URL + '/v1/clear', {
    timeout: 100
  }
  );
}

export function requestAuthRegister(email: string, password: string, nameFirst:string, nameLast:string) {
  return request('POST', SERVER_URL + '/v1/admin/auth/register', {
    json: {
      email: email,
      password: password,
      nameFirst: nameFirst,
      nameLast: nameLast,
    },
  });
}

beforeEach(() => {
  requestClear();
});

describe('adminAuthRegister Server Tests', () => {
  test('Error: Email address is used by another user', () => {
    let response = requestAuthRegister('validemail13@gmail.com', 'StrongPassword1', 'Marcus', 'Ryan');
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.getBody())).toStrictEqual({
      token: expect.any(String),
    });

    response = requestAuthRegister('validemail13@gmail.com', 'StrongPassword2', 'Jon', 'Doe');
    const bodyObj = JSON.parse(response.body as string);
    expect(response.statusCode).toBe(INPUT_ERROR);
    expect(bodyObj.error).toStrictEqual(expect.any(String));
  });

  test('Error: Email does not satisfy validification', () => {
    const response = requestAuthRegister('invalid', 'StrongPassword1', 'Justin', 'Tran');
    const bodyObj = JSON.parse(response.body as string);
    expect(response.statusCode).toBe(INPUT_ERROR);
    expect(bodyObj.error).toStrictEqual(expect.any(String));
  });

  test('Error: Name First does not only include letters', () => {
    const response = requestAuthRegister('validemail10@gmail.com', 'StrongPassword1', 'Justin1', 'Tran');
    expect(response.statusCode).toBe(INPUT_ERROR);
    const bodyObj = JSON.parse(response.body as string);
    expect(response.statusCode).toBe(INPUT_ERROR);
    expect(bodyObj.error).toStrictEqual(expect.any(String));
  });

  test('Error: Name First does not contain 2 - 20 characters', () => {
    const response = requestAuthRegister('validemail5@gmail.com', 'StrongPassword1', 'J', 'Tran');
    const bodyObj = JSON.parse(response.body as string);
    expect(response.statusCode).toBe(INPUT_ERROR);
    expect(bodyObj.error).toStrictEqual(expect.any(String));
  });

  test('Error: Name Last does not only include letters', () => {
    const response = requestAuthRegister('validemail10@gmail.com', 'StrongPassword1', 'Justin', 'Tran2');
    const bodyObj = JSON.parse(response.body as string);
    expect(response.statusCode).toBe(INPUT_ERROR);
    expect(bodyObj.error).toStrictEqual(expect.any(String));
  });

  test('Error: Name Last does not contain 2 - 20 characters', () => {
    const response = requestAuthRegister('validemail5@gmail.com', 'StrongPassword1', 'Justin', 'VeryLastLongNameWhichIsOverLimit');
    const bodyObj = JSON.parse(response.body as string);
    expect(response.statusCode).toBe(INPUT_ERROR);
    expect(bodyObj.error).toStrictEqual(expect.any(String));
  });

  test('Error: Password is less than 8 characters', () => {
    const response = requestAuthRegister('validemail5@gmail.com', 'weak1', 'Justin', 'Tran');
    const bodyObj = JSON.parse(response.body as string);
    expect(response.statusCode).toBe(INPUT_ERROR);
    expect(bodyObj.error).toStrictEqual(expect.any(String));
  });

  test('Error: Password does not contain at least one letter and number', () => {
    let response = requestAuthRegister('validemail5@gmail.com', 'WeakPassword', 'Justin', 'Tran');
    let bodyObj = JSON.parse(response.body as string);
    expect(response.statusCode).toBe(INPUT_ERROR);
    expect(bodyObj.error).toStrictEqual(expect.any(String));

    response = requestAuthRegister('validemail5@gmail.com', '123456789', 'Justin', 'Tran');
    bodyObj = JSON.parse(response.body as string);
    expect(response.statusCode).toBe(INPUT_ERROR);
    expect(bodyObj.error).toStrictEqual(expect.any(String));
  });

  test('Succesful case with correct status code', () => {
    const response = requestAuthRegister('validemail10@gmail.com', 'StrongPassword1', 'Justin', 'Tran');
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.getBody())).toStrictEqual({
      token: expect.any(String),
    });
  });

  test('Successful Case multiple users', () => {
    let response = requestAuthRegister('validemail11@gmail.com', 'StrongPassword1', 'Marcus', 'Ryan');
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.getBody())).toStrictEqual({
      token: expect.any(String),
    });

    response = requestAuthRegister('validemail12@gmail.com', 'StrongPassword1', 'Jayden', 'Phan');
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.getBody())).toStrictEqual({
      token: expect.any(String),
    });
  });
});
