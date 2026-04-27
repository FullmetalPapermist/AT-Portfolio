import { requestClear, requestAuthRegister, requestAuthLogin } from '../request';
beforeEach(() => {
  requestClear();
});

describe('/v2/admin/auth/login tests', () => {
  test('Successful login - status code and return object', () => {
    requestAuthRegister('validemail@email.com', 'password1', 'firstName', 'lastName');
    const response = requestAuthLogin('validemail@email.com', 'password1');
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body as string)).toEqual({
      token: expect.any(String)
    });
  });

  test('Successful login - successive logins, unique sessionIds', () => {
    requestAuthRegister('crazy@email.com', 'password1', 'firstName', 'lastName');
    const response1 = requestAuthLogin('crazy@email.com', 'password1');
    const response2 = requestAuthLogin('crazy@email.com', 'password1');
    const sessionId1 = JSON.parse(response1.getBody()).token;
    const sessionId2 = JSON.parse(response2.getBody()).token;
    expect(sessionId1).not.toBe(sessionId2);
  });

  test('Successful login - multiple users, successive unique sessionIds', () => {
    requestAuthRegister('slay@email.com', 'password1', 'firstName', 'lastName');
    requestAuthRegister('shibe@email.com', 'password2', 'Shiba', 'Inu');
    const response1 = requestAuthLogin('slay@email.com', 'password1');
    const response2 = requestAuthLogin('shibe@email.com', 'password2');
    const sessionId1 = JSON.parse(response1.getBody()).token;
    const sessionId2 = JSON.parse(response2.getBody()).token;
    expect(sessionId1).not.toBe(sessionId2);
  });

  test('Error: Incorrect password', () => {
    requestAuthRegister('crazy@email.com', 'password1', 'firstName', 'lastName');
    const response = requestAuthLogin('crazy@email.com', 'immah4ckyou');
    expect(response.statusCode).toBe(400);
    // Use res.body as string for errors to bypass the throw from 400 status code
    expect(JSON.parse(response.body as string)).toStrictEqual({
      error: expect.any(String)
    });
  });

  test('Error: Invalid email', () => {
    requestAuthRegister('crazy@email.com', 'password1', 'firstName', 'lastName');
    const response = requestAuthLogin('fake@email.com', 'password1');
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body as string)).toStrictEqual({
      error: expect.any(String)
    });
  });
});
