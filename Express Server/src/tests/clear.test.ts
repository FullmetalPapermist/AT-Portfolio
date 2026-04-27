import { requestClear, requestAuthRegister, requestQuizCreate } from '../request';

const OK = 200;

beforeEach(() => {
  requestClear();
});

describe('HTTP tests using Jest', () => {
  test('Test correct return object', () => {
    const res = requestClear();
    const bodyObj = JSON.parse(res.body as string);
    expect(res.statusCode).toStrictEqual(OK);
    expect(bodyObj).toStrictEqual({});
  });

  test('Test successful clear side effect on server', () => {
    const resAuthReg = requestAuthRegister(
      'validemail13@gmail.com',
      'StrongPassword1',
      'Marcus',
      'Ryan'
    );
    expect(resAuthReg.statusCode).toStrictEqual(OK);
    const token = JSON.parse(resAuthReg.body as string).token;
    expect(token).toStrictEqual(expect.any(String));
    const resQuiz = requestQuizCreate(token, 'quiz123', 'default quiz');
    expect(resQuiz.statusCode).toStrictEqual(OK);
    requestClear();
    const resQuiz2 = requestQuizCreate(token, 'quiz123', 'default quiz');
    expect(resQuiz2.statusCode).toStrictEqual(401);
  });
});
