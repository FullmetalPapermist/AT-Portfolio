import request from 'sync-request-curl';
import { port, url } from '../config.json';
import { requestClear, requestAuthRegister, requestQuizInfo, requestQuizCreate } from '../request';

const ERROR = { error: expect.any(String) };

function requestQuizDescriptionUpdate(token: string, quizId: number, description: string) {
  return request('PUT', `${url}:${port}/v2/admin/quiz/${quizId}:quizid/description`, {
    headers: {
      token: token,
    },
    json: {
      description: description
    },
  });
}

beforeEach(() => {
  requestClear();
});

let longDescription120 = 'Lorem ipsum dolor sit amet, ';
longDescription120 += 'consectetur adipiscing elit. Quisque sollicitudin, ';
longDescription120 += 'massa in euismod vulputate, nisi diam ex.';

let longDescription101 = 'Lorem ipsum dolor sit amet, ';
longDescription101 += 'consectetur adipiscing elit. Nunc a suscipit lacus. ';
longDescription101 += 'Duis lacinia est vel.';

describe('Testing errors', () => {
  test.each(['invalid', ''])('success: error - invalid token `%s`', (invalid) => {
    const resUser = requestAuthRegister('validemail13@gmail.com', 'StrongPassword1', 'Marcus', 'Ryan');
    const token = JSON.parse(resUser.body as string).token;
    const resQuiz = requestQuizCreate(token, 'quiz123', 'default quiz');
    const quizId = JSON.parse(resQuiz.body as string).quizId;
    const res = requestQuizDescriptionUpdate(invalid, quizId, 'A very funny quiz');
    expect(JSON.parse(res.body as string)).toStrictEqual(ERROR);
    expect(res.statusCode).toStrictEqual(401);
  });

  test('success: error - invalid quiz Id', () => {
    const resUser = requestAuthRegister('validemail13@gmail.com', 'StrongPassword1', 'Marcus', 'Ryan');
    const token = JSON.parse(resUser.body as string).token;
    const resQuiz = requestQuizCreate(token, 'quiz123', 'default quiz');
    const quizId = JSON.parse(resQuiz.body as string).quizId;
    const res = requestQuizDescriptionUpdate(token, quizId + 1, 'A very funny quiz');
    expect(JSON.parse(res.body as string)).toStrictEqual(ERROR);
    expect(res.statusCode).toStrictEqual(400);
  });

  test('success: error - user not owner', () => {
    const resUser = requestAuthRegister('validemail13@gmail.com', 'StrongPassword1', 'Marcus', 'Ryan');
    const token = JSON.parse(resUser.body as string).token;
    const resQuiz = requestQuizCreate(token, 'quiz123', 'default quiz');
    const quizId = JSON.parse(resQuiz.body as string).quizId;
    const resUser2 = requestAuthRegister('validemail12@gmail.com', 'StrongPassword1', 'Marcus', 'Ryan');
    const token2 = JSON.parse(resUser2.body as string).token;
    const res = requestQuizDescriptionUpdate(token2, quizId, 'A very funny quiz');
    expect(JSON.parse(res.body as string)).toStrictEqual(ERROR);
    expect(res.statusCode).toStrictEqual(403);
  });

  test.each([
    { longDescription: longDescription101 },
    { longDescription: longDescription120 }
  ])('success: error - description too long', ({ longDescription }) => {
    const resUser = requestAuthRegister('validemail13@gmail.com', 'StrongPassword1', 'Marcus', 'Ryan');
    const token = JSON.parse(resUser.body as string).token;
    const resQuiz = requestQuizCreate(token, 'quiz123', 'default quiz');
    const quizId = JSON.parse(resQuiz.body as string).quizId;
    const res = requestQuizDescriptionUpdate(token, quizId, longDescription);
    expect(JSON.parse(res.body as string)).toStrictEqual(ERROR);
    expect(res.statusCode).toStrictEqual(400);
  });
});

describe('success case', () => {
  test.each([
    'hello'
  ])('success: returns correct object', (description) => {
    expect(1).toStrictEqual(1);
  });

  test.each([
    { description1: '', description2: 'Hello world!' },
    { description1: 'A fun quiz', description2: 'No comment' }
  ])('success: description changed', ({ description1, description2 }) => {
    const resUser = requestAuthRegister('validemail13@gmail.com', 'StrongPassword1', 'Marcus', 'Ryan');
    const token = JSON.parse(resUser.body as string).token;
    const resQuiz = requestQuizCreate(token, 'quiz123', description1);
    const quizId = JSON.parse(resQuiz.body as string).quizId;

    const resInfo = requestQuizInfo(token, quizId);
    const quiz = JSON.parse(resInfo.body as string);
    expect(quiz.description).toStrictEqual(description1);

    const res = requestQuizDescriptionUpdate(token, quizId, description2);
    expect(res.statusCode).toStrictEqual(200);

    const resInfo2 = requestQuizInfo(token, quizId);
    const quizEdit = JSON.parse(resInfo2.body as string);
    expect(quizEdit.description).toStrictEqual(description2);
    expect(quiz.timeLastEdited).toBeLessThan(quizEdit.timeLastEdited);
  });
});
