import request from 'sync-request-curl';
import { port, url } from '../config.json';
import { requestQuestionCreate } from '../request';

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
  return request('DELETE', `${url}:${port}/v1/clear`, {
    timeout: 100
  }
  );
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

function requestQuestionDelete(
  quizId: number,
  token: string,
  questionIdToDelete: number
) {
  return request('DELETE', `${url}:${port}/v2/admin/quiz/${quizId}:quizid/question/${questionIdToDelete}?token=${token}`, {
    json: {
      quizId: quizId,
      questionIdToDelete: questionIdToDelete,
    }
  });
}

beforeEach(() => {
  requestClear();
});

// TODO: create a test where Question Id does not refer to a valid question within this quiz return error

describe('requestQuestionDelete', () => {
  const email = 'youremail@email.com';
  const password = 'passsword1';
  const firstName = 'firstName';
  const lastName = 'lastName';

  // Test for invalid AuthUserId
  test('error: invalid AuthUserId', () => {
    let token: string;

    const registerResponse = requestAuthRegister(
      email,
      password,
      firstName,
      lastName
    );

    if ('token' in registerResponse) {
      token = registerResponse.token;
    }

    const result = requestAdminUserDetails(token + 'INVALID');

    expect(result).toEqual({
      error: expect.any(String)
    });
  });

  // Test for a valid user who isn't the owner of the quiz
  test('error: user is not the owner of the quiz', () => {
    let ownerToken: string;
    let nonOwnerToken: string;

    // Register owner and get token
    const ownerRegisterResponse = requestAuthRegister(email, password, firstName, lastName);
    if ('token' in ownerRegisterResponse) {
      ownerToken = ownerRegisterResponse.token;
    }

    // Create a quiz as the owner and get quizId
    const quizResponse = requestQuizCreate(ownerToken, 'Sample Quiz', 'This is a sample quiz.');
    const quizId = JSON.parse(quizResponse.body as string).quizId;

    // Create a question within the quiz as the owner
    const questionResponse = requestQuestionCreate(
      quizId,
      ownerToken,
      'Sample Question?',
      60,
      10,
      [{ answer: 'Answer 1', correct: true }, { answer: 'Answer 2', correct: false }],
      'http://google.com/some/image/path.jpg'
    );

    const quesId = JSON.parse(questionResponse.body as string).questionId;

    // Register another user (non-owner)
    const nonOwnerRegisterResponse = requestAuthRegister('nonOwner@email.com', 'password2', 'NonOwnerFirst', 'NonOwnerLast');
    if ('token' in nonOwnerRegisterResponse) {
      nonOwnerToken = nonOwnerRegisterResponse.token;
    }
    // expect(nonOwnerToken).toEqual("")
    // Try deleting the question in the quiz as the non-owner
    const result = requestQuestionDelete(quizId, nonOwnerToken, quesId);
    // expect(JSON.parse(result.body as string)).toEqual({})
    expect(result.statusCode).toBe(403);
  });

  // Test for invalid question id within the quiz
  test('error: invalid QuestionId within the Quiz', () => {
    let ownerToken: string;
    const invalidQuestionId = 99999;

    // Register owner and get token
    const ownerRegisterResponse = requestAuthRegister(email, password, firstName, lastName);
    if ('token' in ownerRegisterResponse) {
      ownerToken = ownerRegisterResponse.token;
    }

    // Create a quiz as the owner and get quizId
    const quizResponse = requestQuizCreate(ownerToken, 'Sample Quiz', 'This is a sample quiz.');
    const quizId = JSON.parse(quizResponse.body as string).quizId;

    // Try deleting a non-existent question in the quiz
    const result = requestQuestionDelete(quizId, ownerToken, invalidQuestionId);
    expect(result.statusCode).toBe(400);
  });

  // Test for creating a quiz, adding 3 questions, then deleting each one by one
  test('create quiz, add 3 questions, and delete each one by one', () => {
    let ownerToken: string;

    // Register owner and get token
    const ownerRegisterResponse = requestAuthRegister(email, password, firstName, lastName);
    if ('token' in ownerRegisterResponse) {
      ownerToken = ownerRegisterResponse.token;
    }

    // Create a quiz as the owner and get quizId
    const quizResponse = requestQuizCreate(ownerToken, 'Test Quiz', 'This is a test quiz.');
    const quizId = JSON.parse(quizResponse.body as string).quizId;

    // Create first question within the quiz
    const questionResponse1 = requestQuestionCreate(
      quizId,
      ownerToken,
      'Question 1?',
      60,
      10,
      [{
        answer: 'Answer A',
        correct: true
      },
      {
        answer: 'Answer B',
        correct: false
      }],
      'http://google.com/some/image/path.jpg');
    const questionId1 = JSON.parse(questionResponse1.body as string).questionId;

    // Create second question within the quiz
    const questionResponse2 = requestQuestionCreate(
      quizId,
      ownerToken,
      'Question 2?',
      60,
      10,
      [{
        answer: 'Answer X',
        correct: true
      },
      {
        answer: 'Answer Y',
        correct: false
      }],
      'http://google.com/some/image/path.jpg');
    const questionId2 = JSON.parse(questionResponse2.body as string).questionId;

    // Create third question within the quiz
    const questionResponse3 = requestQuestionCreate(
      quizId,
      ownerToken,
      'Question 3?',
      60,
      10,
      [{
        answer: 'Answer M',
        correct: true
      },
      {
        answer: 'Answer N',
        correct: false
      }],
      'http://google.com/some/image/path.jpg');
    const questionId3 = JSON.parse(questionResponse3.body as string).questionId;

    // Delete first question
    const deleteResponse1 = requestQuestionDelete(quizId, ownerToken, questionId1);
    expect(deleteResponse1.statusCode).toBe(200);

    // Delete second question
    const deleteResponse2 = requestQuestionDelete(quizId, ownerToken, questionId2);
    expect(deleteResponse2.statusCode).toBe(200);

    // Delete third question
    const deleteResponse3 = requestQuestionDelete(quizId, ownerToken, questionId3);
    expect(deleteResponse3.statusCode).toBe(200);
  });
});

// Please test for side effects!! (including checking if the quiz duration changes)!
