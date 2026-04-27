import { requestClear, requestAuthRegister, requestUserDetailsNonPass } from '../request';

const INPUT_ERROR = 400;
const UNAUTHOURIZED = 401;
const OK = 200;

beforeEach(() => {
  requestClear();
});

describe('adminUserDetailsNonPass', () => {
  test('ERROR 401: Token is empty or invalid (does not refer to valid logged in user session)', () => {
    let token: string;
    const res = requestAuthRegister('validemail1@gmail.com', 'StrongPassword1', 'Justin', 'Tran');
    const registerResponse = JSON.parse(res.body as string);
    if ('token' in registerResponse) {
      token = registerResponse.token;
    }

    const response = requestUserDetailsNonPass(token + 'INVALID', 'validemail10@gmail.com', 'Justin', 'Tran');
    const bodyObj = JSON.parse(response.body as string);
    expect(response.statusCode).toBe(UNAUTHOURIZED);
    expect(bodyObj.error).toStrictEqual(expect.any(String));
  });

  test('ERROR 400: Email is currently used by another user (excluding the current authorised user', () => {
    requestAuthRegister('validemail1@gmail.com', 'StrongPassword1', 'Justin', 'Tran');
    const responseUnparsed = requestAuthRegister('validemail2@gmail.com', 'StrongPassword2', 'Marcus', 'Ryan');
    const registerResponse = JSON.parse(responseUnparsed.body as string);
    let token: string;
    if ('token' in registerResponse) {
      token = registerResponse.token;
    }

    const response = requestUserDetailsNonPass(token, 'validemail1@gmail.com', 'Marcus', 'Ryan');
    const bodyObj = JSON.parse(response.body as string);
    expect(response.statusCode).toBe(INPUT_ERROR);
    expect(bodyObj.error).toStrictEqual(expect.any(String));
  });

  test('ERROR 400: Email does not satisy validator', () => {
    const responseUnparsed = requestAuthRegister('validemail2@gmail.com', 'StrongPassword2', 'Marcus', 'Ryan');
    const registerResponse = JSON.parse(responseUnparsed.body as string);
    let token: string;
    if ('token' in registerResponse) {
      token = registerResponse.token;
    }

    const response = requestUserDetailsNonPass(token, 'invalid', 'Justin', 'Tran');
    const bodyObj = JSON.parse(response.body as string);
    expect(response.statusCode).toBe(INPUT_ERROR);
    expect(bodyObj.error).toStrictEqual(expect.any(String));
  });

  test('ERROR 400: NameFirst contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes', () => {
    const responseUnparsed = requestAuthRegister('validemail2@gmail.com', 'StrongPassword2', 'Marcus', 'Ryan');
    const registerResponse = JSON.parse(responseUnparsed.body as string);
    let token: string;
    if ('token' in registerResponse) {
      token = registerResponse.token;
    }

    let response = requestUserDetailsNonPass(token, 'validemail1@gmail.com', 'Justin1', 'Tran');
    let bodyObj = JSON.parse(response.body as string);
    expect(response.statusCode).toBe(INPUT_ERROR);
    expect(bodyObj.error).toStrictEqual(expect.any(String));

    response = requestUserDetailsNonPass(token, 'validemail1@gmail.com', 'Justin@error', 'Tran');
    bodyObj = JSON.parse(response.body as string);
    expect(response.statusCode).toBe(INPUT_ERROR);
    expect(bodyObj.error).toStrictEqual(expect.any(String));
  });

  test('ERROR 400: NameFirst is less than 2 characters or more than 20 characters', () => {
    const responseUnparsed = requestAuthRegister('validemail2@gmail.com', 'StrongPassword2', 'Marcus', 'Ryan');
    const registerResponse = JSON.parse(responseUnparsed.body as string);
    let token: string;
    if ('token' in registerResponse) {
      token = registerResponse.token;
    }

    let response = requestUserDetailsNonPass(token, 'validemail1@gmail.com', 'J', 'Tran');
    let bodyObj = JSON.parse(response.body as string);
    expect(response.statusCode).toBe(INPUT_ERROR);
    expect(bodyObj.error).toStrictEqual(expect.any(String));

    response = requestUserDetailsNonPass(token, 'validemail1@gmail.com', 'JJJJJJJJJJJJJJJJJJJJJJJJ', 'Tran');
    bodyObj = JSON.parse(response.body as string);
    expect(response.statusCode).toBe(INPUT_ERROR);
    expect(bodyObj.error).toStrictEqual(expect.any(String));
  });

  test('ERROR 400: NameLast contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes', () => {
    const responseUnparsed = requestAuthRegister('validemail2@gmail.com', 'StrongPassword2', 'Marcus', 'Ryan');
    const registerResponse = JSON.parse(responseUnparsed.body as string);
    let token: string;
    if ('token' in registerResponse) {
      token = registerResponse.token;
    }

    let response = requestUserDetailsNonPass(token, 'validemail1@gmail.com', 'Justin', 'Tran1');
    let bodyObj = JSON.parse(response.body as string);
    expect(response.statusCode).toBe(INPUT_ERROR);
    expect(bodyObj.error).toStrictEqual(expect.any(String));

    response = requestUserDetailsNonPass(token, 'validemail1@gmail.com', 'Justin', 'Tran@error');
    bodyObj = JSON.parse(response.body as string);
    expect(response.statusCode).toBe(INPUT_ERROR);
    expect(bodyObj.error).toStrictEqual(expect.any(String));
  });

  test('ERROR 400: NameLast is less than 2 characters or more than 20 characters', () => {
    const responseUnparsed = requestAuthRegister('validemail2@gmail.com', 'StrongPassword2', 'Marcus', 'Ryan');
    const registerResponse = JSON.parse(responseUnparsed.body as string);
    let token: string;
    if ('token' in registerResponse) {
      token = registerResponse.token;
    }

    let response = requestUserDetailsNonPass(token, 'validemail1@gmail.com', 'Justin', 'T');
    let bodyObj = JSON.parse(response.body as string);
    expect(response.statusCode).toBe(INPUT_ERROR);
    expect(bodyObj.error).toStrictEqual(expect.any(String));

    response = requestUserDetailsNonPass(token, 'validemail1@gmail.com', 'Justin', 'JJJJJJJJJJJJJJJJJJJJJJJJJ');
    bodyObj = JSON.parse(response.body as string);
    expect(response.statusCode).toBe(INPUT_ERROR);
    expect(bodyObj.error).toStrictEqual(expect.any(String));
  });

  test('SUCCESS: One change)', () => {
    const responseUnparsed = requestAuthRegister('validemail2@gmail.com', 'StrongPassword2', 'Marcus', 'Ryan');
    const registerResponse = JSON.parse(responseUnparsed.body as string);
    let token: string;
    if ('token' in registerResponse) {
      token = registerResponse.token;
    }

    const response = requestUserDetailsNonPass(token, 'change1@gmail.com', 'Changed', 'Name');
    expect(response.statusCode).toBe(OK);
    expect(JSON.parse(response.getBody())).toStrictEqual({
    });
  });

  test('SUCCESS: Multi Users multi change)', () => {
    let responseUnparsed = requestAuthRegister('validemail1@gmail.com', 'StrongPassword1', 'Justin', 'Tran');
    let registerResponse = JSON.parse(responseUnparsed.body as string);
    let token1: string;
    if ('token' in registerResponse) {
      token1 = registerResponse.token;
    }

    responseUnparsed = requestAuthRegister('validemail2@gmail.com', 'StrongPassword2', 'Marcus', 'Ryan');
    registerResponse = JSON.parse(responseUnparsed.body as string);
    let token2: string;
    if ('token' in registerResponse) {
      token2 = registerResponse.token;
    }

    let response = requestUserDetailsNonPass(token1, 'emailtest2@gmail.com', 'Justin', 'Tran');
    expect(response.statusCode).toBe(OK);
    expect(JSON.parse(response.getBody())).toStrictEqual({
    });

    response = requestUserDetailsNonPass(token2, 'emailtest3@gmail.com', 'Name', 'Test');
    expect(response.statusCode).toBe(OK);
    expect(JSON.parse(response.getBody())).toStrictEqual({
    });
  });
});
