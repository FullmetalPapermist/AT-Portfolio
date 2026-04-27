import request from 'sync-request-curl';
import { port, url } from '../config.json';
import { requestAdminQuizList } from './adminQuizList.test';
import { requestQuizInfo } from './adminQuizInfo.test';

const SERVER_URL = `${url}:${port}`;

interface ErrorResponse {
  error: string;
}

interface RegisterResponse {
  token: string;
}

function requestClear() {
  return request('DELETE', `${url}:${port}/v1/clear`, {
    timeout: 100
  }
  );
}

function requestTrashView(token: string) {
  return request('GET', SERVER_URL + '/v2/admin/quiz/trash', {
    headers: {
      token: token
    },
  });
}

function requestTrashRestore(token: string, quizId: number) {
  return request('POST', SERVER_URL + '/v2/admin/quiz/' + quizId + '/restore', {
    headers: {
      token: token,
    },
  });
}

function requestTrashEmpty(token: string, quizIds: string) {
  return request('DELETE', SERVER_URL + '/v2/admin/quiz/trash/empty', {
    headers: {
      token: token,
    },
    qs: {
      quizIds: quizIds
    },
  });
}

function requestQuizRemove(token: string, quizId: number) {
  return request('DELETE', SERVER_URL + '/v2/admin/quiz/' + quizId, {
    headers: {
      token: token
    },
  });
}

function requestQuizCreate(token: string, name: string, description: string) {
  return request('POST', SERVER_URL + '/v2/admin/quiz', {
    json: {
      name: name,
      description: description
    },
    headers: {
      token: token,
    },
  });
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

beforeEach(() => {
  requestClear();
});

describe('trashView server tests', () => {
  test('Check quiz is in trash', () => {
    const response = requestAuthRegister('validemail20@gmail.com', 'StrongPassword1', 'Gary', 'Stu');
    let token: string;
    if ('token' in response) {
      token = response.token;
    }
    const res = requestQuizCreate(token, 'quiz123', 'default quiz');
    expect(res.statusCode).toBe(200);
    const quiz = JSON.parse(res.body.toString());
    const res2 = requestQuizRemove(token, quiz.quizId);
    expect(res2.statusCode).toBe(200);
    // Assumption: trash is an array of quizzes in dataStore
    const res3 = requestTrashView(token);
    expect(res3.statusCode).toBe(200);
    expect(JSON.parse(res3.getBody())).toStrictEqual({ quizzes: [{ quizId: quiz.quizId, name: 'quiz123' }] });
    expect(JSON.parse(res3.getBody()).quizzes).toHaveLength(1);
    // Add 2nd quiz to trash
    const res4 = requestQuizCreate(token, 'quiz1234', 'default quiz');
    expect(res4.statusCode).toBe(200);
    const quiz2 = JSON.parse(res4.body.toString());
    const res6 = requestQuizRemove(token, quiz2.quizId);
    expect(res6.statusCode).toBe(200);
    const res5 = requestTrashView(token);
    expect(res5.statusCode).toBe(200);
    expect(JSON.parse(res5.getBody())).toStrictEqual({ quizzes: [{ quizId: quiz.quizId, name: 'quiz123' }, { quizId: quiz2.quizId, name: 'quiz1234' }] });
    expect(JSON.parse(res5.getBody()).quizzes).toHaveLength(2);
  });

  test('check empty trash', () => {
    const response = requestAuthRegister('validemail20@gmail.com', 'StrongPassword1', 'Gary', 'Stu');
    let token: string;
    if ('token' in response) {
      token = response.token;
    }
    const res = requestTrashView(token);
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.getBody())).toStrictEqual({ quizzes: [] });
    expect(JSON.parse(res.getBody()).quizzes).toHaveLength(0);
  });

  test('check trash with error', () => {
    const response = requestAuthRegister('validemail20@gmail.com', 'StrongPassword1', 'Gary', 'Stu');
    let token: string;
    if ('token' in response) {
      token = response.token;
    }
    const res = requestTrashView(token + 'bad');
    expect(res.statusCode).toBe(401);
    expect(JSON.parse(res.body as string)).toStrictEqual({ error: expect.any(String) });
  });

  test('check other users trash', () => {
    const response = requestAuthRegister('validemail20@gmail.com', 'StrongPassword1', 'Gary', 'Stu');
    const response2 = requestAuthRegister('validemail202@gmail.com', 'StrongPassword12', 'Gareth', 'Stuward');
    let token: string;
    if ('token' in response) {
      token = response.token;
    }
    let token2: string;
    if ('token' in response2) {
      token2 = response2.token;
    }
    const res = requestQuizCreate(token, 'quiz123', 'default quiz');
    const quiz = JSON.parse(res.body.toString());
    requestQuizRemove(token, quiz.quizId);
    const res4 = requestQuizCreate(token2, 'quiz1234', 'default quiz');
    const quiz2 = JSON.parse(res4.body.toString());
    requestQuizRemove(token2, quiz2.quizId);
    const res5 = requestTrashView(token);
    expect(res5.statusCode).toBe(200);
    expect(JSON.parse(res5.getBody())).toStrictEqual({ quizzes: [{ quizId: quiz.quizId, name: 'quiz123' }] });
    expect(JSON.parse(res5.getBody()).quizzes).toHaveLength(1);
  });
});

describe('trashRestore server tests', () => {
  test('Try restore quiz from trash', () => {
    const response = requestAuthRegister('validemail20@gmail.com', 'StrongPassword1', 'Gary', 'Stu');
    let token: string;
    if ('token' in response) {
      token = response.token;
    }
    const res = requestQuizCreate(token, 'quiz123', 'default quiz');
    expect(res.statusCode).toBe(200);
    const quiz = JSON.parse(res.body.toString());
    const res2 = requestQuizRemove(token, quiz.quizId);
    expect(res2.statusCode).toBe(200);
    const res3 = requestTrashView(token);
    expect(res3.statusCode).toBe(200);
    expect(JSON.parse(res3.getBody())).toStrictEqual({ quizzes: [{ quizId: quiz.quizId, name: 'quiz123' }] });
    // Restore quiz from trash
    const res4 = requestTrashRestore(token, quiz.quizId);
    expect(res4.statusCode).toBe(200);
    const res5 = requestTrashView(token);
    expect(res5.statusCode).toBe(200);
    expect(JSON.parse(res5.getBody())).toStrictEqual({ quizzes: [] });
    const time = Math.floor(Date.now() / 100);
    const res6 = requestQuizInfo(token, quiz.quizId);
    expect(Math.abs(Math.floor(JSON.parse(res6.getBody()).timeLastEdited / 100) - time) <= 1).toStrictEqual(true);
  });

  test('restore with bad token', () => {
    const response = requestAuthRegister('validemail20@gmail.com', 'StrongPassword1', 'Gary', 'Stu');
    let token: string;
    if ('token' in response) {
      token = response.token;
    }
    const res = requestQuizCreate(token, 'quiz123', 'default quiz');
    expect(res.statusCode).toBe(200);
    const quiz = JSON.parse(res.body.toString());
    const res2 = requestQuizRemove(token, quiz.quizId);
    expect(res2.statusCode).toBe(200);
    const res3 = requestTrashRestore(token + 'bad', quiz.quizId);
    expect(res3.statusCode).toBe(401);
    expect(JSON.parse(res3.body as string)).toStrictEqual({ error: expect.any(String) });
  });

  test('restore with bad ID', () => {
    const response = requestAuthRegister('validemail20@gmail.com', 'StrongPassword1', 'Gary', 'Stu');
    let token: string;
    if ('token' in response) {
      token = response.token;
    }
    const res = requestQuizCreate(token, 'quiz123', 'default quiz');
    expect(res.statusCode).toBe(200);
    const quiz = JSON.parse(res.body.toString());
    const res2 = requestQuizRemove(token, quiz.quizId);
    expect(res2.statusCode).toBe(200);
    const res3 = requestTrashRestore(token, quiz.quizId + 1);
    expect(res3.statusCode).toBe(403);
    expect(JSON.parse(res3.body as string)).toStrictEqual({ error: expect.any(String) });
  });

  test('restore with quizname already belonging to quiz in database', () => {
    const response = requestAuthRegister('validemail20@gmail.com', 'StrongPassword1', 'Gary', 'Stu');
    let token: string;
    if ('token' in response) {
      token = response.token;
    }
    const res = requestQuizCreate(token, 'quiz123', 'default quiz');
    expect(res.statusCode).toBe(200);
    const quiz = JSON.parse(res.body.toString());
    const res2 = requestQuizRemove(token, quiz.quizId);
    expect(res2.statusCode).toBe(200);
    const res3 = requestQuizCreate(token, 'quiz123', 'default quiz');
    expect(res3.statusCode).toBe(200);
    const res4 = requestTrashRestore(token, quiz.quizId);
    expect(res4.statusCode).toBe(400);
    expect(JSON.parse(res4.body as string)).toStrictEqual({ error: expect.any(String) });
  });

  test('restore while not owner', () => {
    const response = requestAuthRegister('validemail20@gmail.com', 'StrongPassword1', 'Gary', 'Stu');
    let token: string;
    if ('token' in response) {
      token = response.token;
    }
    const response2 = requestAuthRegister('validemail21@gmail.com', 'StrongPassword1', 'Gary', 'Stu');
    let token2: string;
    if ('token' in response2) {
      token2 = response2.token;
    }
    const res = requestQuizCreate(token, 'quiz123', 'default quiz');
    expect(res.statusCode).toBe(200);
    const quiz = JSON.parse(res.body.toString());
    const res2 = requestQuizRemove(token, quiz.quizId);
    expect(res2.statusCode).toBe(200);
    const res3 = requestTrashRestore(token2, quiz.quizId);
    expect(res3.statusCode).toBe(403);
    expect(JSON.parse(res3.body as string)).toStrictEqual({ error: expect.any(String) });
  });
});

describe('trashEmpty server tests', () => {
  test('Try empty trash', () => {
    const response = requestAuthRegister('validemail20@gmail.com', 'StrongPassword1', 'Gary', 'Stu');
    let token: string;
    if ('token' in response) {
      token = response.token;
    }
    const res = requestQuizCreate(token, 'quiz123', 'default quiz');
    const quiz = JSON.parse(res.body.toString());
    requestQuizRemove(token, quiz.quizId);
    const res3 = requestTrashView(token);
    expect(JSON.parse(res3.getBody())).toStrictEqual({ quizzes: expect.any(Array) });
    expect(JSON.parse(res3.getBody()).quizzes).toHaveLength(1);
    // Empty the trash
    const res4 = requestTrashEmpty(token, JSON.stringify([quiz.quizId]));
    expect(res4.statusCode).toBe(200);
    const res5 = requestTrashView(token);
    expect(res5.statusCode).toBe(200);
    expect(JSON.parse(res5.getBody())).toStrictEqual({ quizzes: [] });
    const res6 = requestAdminQuizList(token);
    expect(res6).toStrictEqual({ quizzes: [] });
  });

  test('Empty 2 out of 3 in trash, Empty invalid index', () => {
    const response = requestAuthRegister('validemail20@gmail.com', 'StrongPassword1', 'Gary', 'Stu');
    let token: string;
    if ('token' in response) {
      token = response.token;
    }
    const res = requestQuizCreate(token, 'quiz123', 'default quiz');
    const quiz = JSON.parse(res.body.toString());
    requestQuizRemove(token, quiz.quizId);
    const res3 = requestQuizCreate(token, 'quiz1234', 'default quiz');
    const quiz2 = JSON.parse(res3.body.toString());
    requestQuizRemove(token, quiz2.quizId);
    const res5 = requestQuizCreate(token, 'quiz1235', 'default quiz');
    const quiz3 = JSON.parse(res5.body.toString());
    requestQuizRemove(token, quiz3.quizId);
    // Empty the trash
    const res7 = requestTrashEmpty(token, JSON.stringify([quiz.quizId, quiz3.quizId]));
    expect(res7.statusCode).toBe(200);
    const res8 = requestTrashView(token);
    expect(res8.statusCode).toBe(200);
    expect(JSON.parse(res8.getBody())).toStrictEqual({ quizzes: expect.any(Array) });
    expect(JSON.parse(res8.getBody()).quizzes).toHaveLength(1);
    const res9 = requestTrashEmpty(token, JSON.stringify([quiz.quizId]));
    expect(res9.statusCode).toBe(400);
    expect(JSON.parse(res9.body as string)).toStrictEqual({ error: expect.any(String) });
    requestTrashRestore(token, quiz2.quizId);
    const res10 = requestAdminQuizList(token);
    expect(res10).toStrictEqual({ quizzes: [{ quizId: quiz2.quizId, name: 'quiz1234' }] });
  });

  test('Empty with bad token', () => {
    const response = requestAuthRegister('validemail20@gmail.com', 'StrongPassword1', 'Gary', 'Stu');
    let token: string;
    if ('token' in response) {
      token = response.token;
    }
    const res = requestQuizCreate(token, 'quiz123', 'default quiz');
    expect(res.statusCode).toBe(200);
    const quiz = JSON.parse(res.body.toString());
    const res2 = requestQuizRemove(token, quiz.quizId);
    expect(res2.statusCode).toBe(200);
    const res3 = requestTrashEmpty(token + 'bad', JSON.stringify([quiz.quizId]));
    expect(res3.statusCode).toBe(401);
    expect(JSON.parse(res3.body as string)).toStrictEqual({ error: expect.any(String) });
  });

  test('Empty while not owner', () => {
    const response = requestAuthRegister('validemail20@gmail.com', 'StrongPassword1', 'Gary', 'Stu');
    let token: string;
    if ('token' in response) {
      token = response.token;
    }
    const response2 = requestAuthRegister('validemail21@gmail.com', 'StrongPassword1', 'Gary', 'Stu');
    let token2: string;
    if ('token' in response2) {
      token2 = response2.token;
    }
    const res = requestQuizCreate(token, 'quiz123', 'default quiz');
    const quiz = JSON.parse(res.body.toString());
    requestQuizRemove(token, quiz.quizId);
    const res3 = requestQuizCreate(token2, 'quiz1234', 'default quiz');
    const quiz2 = JSON.parse(res3.body.toString());
    requestQuizRemove(token2, quiz2.quizId);
    const res5 = requestTrashEmpty(token, JSON.stringify([quiz.quizId, quiz2.quizId]));
    expect(res5.statusCode).toBe(403);
    expect(JSON.parse(res5.body as string)).toStrictEqual({ error: expect.any(String) });
  });

  test('Empty already empty trash', () => {
    const response = requestAuthRegister('validemail20@gmail.com', 'StrongPassword1', 'Gary', 'Stu');
    let token: string;
    if ('token' in response) {
      token = response.token;
    }
    const res = requestQuizCreate(token, 'quiz123', 'default quiz');
    const quiz = JSON.parse(res.body.toString());
    const res2 = requestTrashEmpty(token, JSON.stringify([quiz.quizId]));
    expect(res2.statusCode).toBe(400);
    expect(JSON.parse(res2.body as string)).toStrictEqual({ error: expect.any(String) });
  });
});
