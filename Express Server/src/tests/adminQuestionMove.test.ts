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

function requestAdminUserDetails(token: string) {
  const response = request('GET', SERVER_URL + '/v2/admin/user/details', {
    qs: { token }
  });

  return response;
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

function requestQuestionMove(
  token: string,
  quizId: number,
  questionIdToMove: number,
  newPositiion: number
) {
  return request('PUT', `${url}:${port}/v2/admin/quiz/${quizId}/question/${questionIdToMove}/move`, {
    json: {
      token,
      newPosition: newPositiion
    }
  });
}

beforeEach(() => {
  requestClear();
});

describe('requestQuestionMove', () => {
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

    expect(result.statusCode).toBe(401);
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
    // Try deleting the question in the quiz as the non-owner
    const result = requestQuestionMove(nonOwnerToken, quizId, quesId, 5);
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
    const result = requestQuestionMove(ownerToken, quizId, invalidQuestionId, 5);
    expect(result.statusCode).toBe(400);
  });

  test('error: invalid NewPosition for the question move', () => {
    let ownerToken: string;

    // Register owner and get token
    const ownerRegisterResponse = requestAuthRegister(email, password, firstName, lastName);
    if ('token' in ownerRegisterResponse) {
      ownerToken = ownerRegisterResponse.token;
    }

    // Create a quiz as the owner and get quizId
    const quizResponse = requestQuizCreate(ownerToken, 'Sample Quiz', 'This is a sample quiz.');
    const quizId = JSON.parse(quizResponse.body as string).quizId;

    // Create the first valid question within the quiz
    const question1Response = requestQuestionCreate(
      quizId,
      ownerToken,
      'What is the capital of France?',
      60,
      10,
      [{
        answer: 'true',
        correct: true
      },
      {
        answer: 'false',
        correct: false
      }
      ],
      'http://google.com/some/image/path.jpg'
    );
    const quesId1 = JSON.parse(question1Response.body as string).questionId;

    // Create the second valid question within the quiz
    const question2Response = requestQuestionCreate(
      quizId,
      ownerToken,
      'What color is the sky?',
      30,
      10,
      [{
        answer: 'blue',
        correct: true
      },
      {
        answer: 'green',
        correct: false
      }
      ],
      'http://google.com/some/image/path.jpg'
    );
    const quesId2 = JSON.parse(question2Response.body as string).questionId;

    let result = requestQuestionMove(ownerToken, quizId, quesId1, 0);
    expect(result.statusCode).toBe(400);

    result = requestQuestionMove(ownerToken, quizId, quesId2, 1);
    expect(result.statusCode).toBe(400);

    result = requestQuestionMove(ownerToken, quizId, quesId1, -1);
    expect(result.statusCode).toBe(400);

    result = requestQuestionMove(ownerToken, quizId, quesId1, 2);
    expect(result.statusCode).toBe(400);
  });

  test('successful repositioning of questions within a quiz', () => {
    let ownerToken: string;

    const ownerRegisterResponse = requestAuthRegister(email, password, firstName, lastName);
    if ('token' in ownerRegisterResponse) {
      ownerToken = ownerRegisterResponse.token;
    }

    const quizResponse = requestQuizCreate(ownerToken, 'Another Sample Quiz', 'This is another sample quiz.');
    const quizId = JSON.parse(quizResponse.body as string).quizId;

    const question1Response = requestQuestionCreate(
      quizId,
      ownerToken,
      'What is 2 + 2?',
      60,
      10,
      [{
        answer: '4',
        correct: true
      },
      {
        answer: '5',
        correct: false
      },
      ],
      'http://google.com/some/image/path.jpg'
    );
    const quesId1 = JSON.parse(question1Response.body as string).questionId;

    const question2Response = requestQuestionCreate(
      quizId,
      ownerToken,
      'Which planet is known as the red planet?',
      50,
      10,
      [{
        answer: 'Mars',
        correct: true
      },
      {
        answer: 'Venus',
        correct: false
      }],
      'http://google.com/some/image/path.jpg'
    );
    const quesId2 = JSON.parse(question2Response.body as string).questionId;

    const question3Response = requestQuestionCreate(
      quizId,
      ownerToken,
      'Who wrote Romeo and Juliet?',
      40,
      10,
      [{
        answer: 'William Shakespeare',
        correct: true
      },
      {
        answer: 'Charles Dickens',
        correct: false
      }],
      'http://google.com/some/image/path.jpg'
    );
    const quesId3 = JSON.parse(question3Response.body as string).questionId;

    let result = requestQuestionMove(ownerToken, quizId, quesId1, 1);
    expect(result.statusCode).toBe(200);

    result = requestQuestionMove(ownerToken, quizId, quesId3, 0);
    expect(result.statusCode).toBe(200);

    result = requestQuestionMove(ownerToken, quizId, quesId2, 2);
    expect(result.statusCode).toBe(200);
  });
});
