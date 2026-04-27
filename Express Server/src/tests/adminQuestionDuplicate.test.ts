import request from 'sync-request-curl';
import { port, url } from '../config.json';

import { requestClear, requestAuthRegister, requestQuizInfo, requestQuizCreate, requestQuestionCreate } from '../request';

const ERROR = { error: expect.any(String) };

function requestQuestionDuplicate(
  quizId: number,
  questionId: number,
  token: string) {
  return request('POST', `${url}:${port}/v2/admin/quiz/${quizId}:quizid/question/${questionId}/duplicate`, {
    json: {
      token: token
    },
  });
}

beforeEach(() => {
  requestClear();
});

describe('Error Handling', () => {
  test('success: returns error Invalid questionId', () => {
    const resUser = requestAuthRegister('validemail13@gmail.com', 'StrongPassword1', 'Marcus', 'Ryan');
    const token = JSON.parse(resUser.body as string).token;
    const resQuiz = requestQuizCreate(token, 'quiz123', 'default quiz');
    const quizId = JSON.parse(resQuiz.body as string).quizId;
    const resQues = requestQuestionCreate(
      quizId,
      token,
      'Question',
      5,
      5,
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
    const quesId = JSON.parse(resQues.body as string).questionId;
    const res = requestQuestionDuplicate(quizId, quesId + 1, token);
    expect(res.statusCode).toStrictEqual(400);
    expect(JSON.parse(res.body as string)).toStrictEqual(ERROR);
  });

  test('success: returns error Invalid quizId', () => {
    const resUser = requestAuthRegister('validemail13@gmail.com', 'StrongPassword1', 'Marcus', 'Ryan');
    const token = JSON.parse(resUser.body as string).token;
    const resQuiz = requestQuizCreate(token, 'quiz123', 'default quiz');
    const quizId = JSON.parse(resQuiz.body as string).quizId;
    const resQues = requestQuestionCreate(
      quizId,
      token,
      'Question',
      5,
      5,
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
    const quesId = JSON.parse(resQues.body as string).questionId;
    const res = requestQuestionDuplicate(quizId + 1, quesId, token);
    expect(res.statusCode).toStrictEqual(400);
    expect(JSON.parse(res.body as string)).toStrictEqual(ERROR);
  });

  test.each(['token', ''])('success: returns error Invalid token `%s`', (invalid) => {
    const resUser = requestAuthRegister('validemail13@gmail.com', 'StrongPassword1', 'Marcus', 'Ryan');
    const token = JSON.parse(resUser.body as string).token;
    const resQuiz = requestQuizCreate(token, 'quiz123', 'default quiz');
    const quizId = JSON.parse(resQuiz.body as string).quizId;
    const resQues = requestQuestionCreate(
      quizId,
      token,
      'Question',
      5,
      5,
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
    const quesId = JSON.parse(resQues.body as string).questionId;
    const res = requestQuestionDuplicate(quizId, quesId, invalid);
    expect(res.statusCode).toStrictEqual(401);
    expect(JSON.parse(res.body as string)).toStrictEqual(ERROR);
  });

  test('success: returns error unauthorised token', () => {
    const resUser = requestAuthRegister('validemail13@gmail.com', 'StrongPassword1', 'Marcus', 'Ryan');
    const token = JSON.parse(resUser.body as string).token;
    const resQuiz = requestQuizCreate(token, 'quiz123', 'default quiz');
    const quizId = JSON.parse(resQuiz.body as string).quizId;
    const resQues = requestQuestionCreate(
      quizId,
      token,
      'Question',
      5,
      5,
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
    const quesId = JSON.parse(resQues.body as string).questionId;
    const resUser2 = requestAuthRegister('validemail12@gmail.com', 'StrongPassword1', 'Marcus', 'Ryan');
    const token2 = JSON.parse(resUser2.body as string).token;

    const res = requestQuestionDuplicate(quizId, quesId, token2);
    expect(res.statusCode).toStrictEqual(403);
    expect(JSON.parse(res.body as string)).toStrictEqual(ERROR);
  });
});

describe('Return object', () => {
  test.each([
    {
      question: 'King?',
      duration: 8,
      points: 9,
      answers: [
        {
          answer: 'Toad',
          correct: true
        },
        {
          answer: 'Luigi',
          correct: false
        }
      ],
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
      testName: '5 letter question'
    },
    {
      question: 'Lorem ipsum dolor sit amet, consectetur cras amet?',
      duration: 8,
      points: 9,
      answers: [
        {
          answer: 'Toad',
          correct: true
        },
        {
          answer: 'Luigi',
          correct: false
        }
      ],
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
      testName: '50 word question'
    },
    {
      question: 'Who is the king of the Mushrooms?',
      duration: 8,
      points: 9,
      answers: [
        {
          answer: 'Toad',
          correct: true
        },
        {
          answer: 'Luigi',
          correct: false
        },
        {
          answer: 'Mario',
          correct: false
        },
        {
          answer: 'Peach',
          correct: false
        },
        {
          answer: 'Bowser',
          correct: false
        },
        {
          answer: 'Wario',
          correct: false
        },
      ],
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
      testName: '6 answers'
    },
  ])('success: returns correct object $testName', ({ question, duration, points, answers, thumbnailUrl }) => {
    const resUser = requestAuthRegister('validemail13@gmail.com', 'StrongPassword1', 'Marcus', 'Ryan');
    const token = JSON.parse(resUser.body as string).token;
    const resQuiz = requestQuizCreate(token, 'quiz123', 'default quiz');
    const quizId = JSON.parse(resQuiz.body as string).quizId;
    const resQues = requestQuestionCreate(quizId, token, question, duration, points, answers, thumbnailUrl);
    const quesId = JSON.parse(resQues.body as string).questionId;
    const res = requestQuestionDuplicate(quizId, quesId, token);
    expect(res.statusCode).toStrictEqual(200);
    expect(JSON.parse(res.body as string)).toStrictEqual({ newQuestionId: expect.any(Number) });
  });

  test.each([
    {
      question: 'King?',
      duration: 8,
      points: 9,
      answers: [
        {
          answer: 'Toad',
          correct: true
        },
        {
          answer: 'Luigi',
          correct: false
        }
      ],
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
      testName: '5 letter question'
    },
    {
      question: 'Lorem ipsum dolor sit amet, consectetur cras amet?',
      duration: 8,
      points: 9,
      answers: [
        {
          answer: 'Toad',
          correct: true
        },
        {
          answer: 'Luigi',
          correct: false
        }
      ],
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
      testName: '50 word question'
    },
    {
      question: 'Who is the king of the Mushrooms?',
      duration: 8,
      points: 9,
      answers: [
        {
          answer: 'Toad',
          correct: true
        },
        {
          answer: 'Luigi',
          correct: false
        },
        {
          answer: 'Mario',
          correct: false
        },
        {
          answer: 'Peach',
          correct: false
        },
        {
          answer: 'Bowser',
          correct: false
        },
        {
          answer: 'Wario',
          correct: false
        },
      ],
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
      testName: '6 answers'
    },
  ])('success: returns different question Ids $testName', ({ question, duration, points, answers, thumbnailUrl }) => {
    const resUser = requestAuthRegister('validemail13@gmail.com', 'StrongPassword1', 'Marcus', 'Ryan');
    const token = JSON.parse(resUser.body as string).token;
    const resQuiz = requestQuizCreate(token, 'quiz123', 'default quiz');
    const quizId = JSON.parse(resQuiz.body as string).quizId;
    const resQues = requestQuestionCreate(quizId, token, question, duration, points, answers, thumbnailUrl);
    const quesId = JSON.parse(resQues.body as string).questionId;
    const res = requestQuestionDuplicate(quizId, quesId, token);
    expect(res.statusCode).toStrictEqual(200);
    const newQuesId = JSON.parse(res.body as string).newQuestionId;
    expect(newQuesId).not.toStrictEqual(quesId);
  });
});

describe('Side effect', () => {
  test.each([
    {
      question: 'King?',
      duration: 8,
      points: 9,
      answers: [
        {
          answer: 'Toad',
          correct: true
        },
        {
          answer: 'Luigi',
          correct: false
        }
      ],
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
      testName: '5 letter question'
    },
    {
      question: 'Lorem ipsum dolor sit amet, consectetur cras amet?',
      duration: 8,
      points: 9,
      answers: [
        {
          answer: 'Toad',
          correct: true
        },
        {
          answer: 'Luigi',
          correct: false
        }
      ],
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
      testName: '50 word question'
    },
    {
      question: 'Who is the king of the Mushrooms?',
      duration: 8,
      points: 9,
      answers: [
        {
          answer: 'Toad',
          correct: true
        },
        {
          answer: 'Luigi',
          correct: false
        },
        {
          answer: 'Mario',
          correct: false
        },
        {
          answer: 'Peach',
          correct: false
        },
        {
          answer: 'Bowser',
          correct: false
        },
        {
          answer: 'Wario',
          correct: false
        },
      ],
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
      testName: '6 answers'
    },
  ])('success: correct side effect $testName', ({ question, duration, points, answers, thumbnailUrl }) => {
    const resUser = requestAuthRegister('validemail13@gmail.com', 'StrongPassword1', 'Marcus', 'Ryan');
    const token = JSON.parse(resUser.body as string).token;
    const resQuiz = requestQuizCreate(token, 'quiz123', 'default quiz');
    const quizId = JSON.parse(resQuiz.body as string).quizId;
    const resQues = requestQuestionCreate(quizId, token, question, duration, points, answers, thumbnailUrl);
    const quesId = JSON.parse(resQues.body as string).questionId;
    const timeCreated = JSON.parse(requestQuizInfo(token, quizId).body as string).timeLastEdited;
    const res = requestQuestionDuplicate(quizId, quesId, token);
    expect(res.statusCode).toStrictEqual(200);
    const resInfo = requestQuizInfo(token, quizId);
    const info = JSON.parse(resInfo.body as string);

    const timeLastEdited = JSON.parse(resInfo.body as string).timeLastEdited;

    expect(info.duration).toStrictEqual(2 * duration);
    expect(info.questions.length).toStrictEqual(2);
    const quest1 = info.questions[0];
    const quest2 = info.questions[1];
    expect(quest1.question).toStrictEqual(quest2.question);
    expect(quest1.duration).toStrictEqual(quest2.duration);
    expect(quest1.points).toStrictEqual(quest2.points);
    expect(quest1.answers).toStrictEqual(quest2.answers);
    expect(timeCreated).toBeLessThan(timeLastEdited);
  });
});
