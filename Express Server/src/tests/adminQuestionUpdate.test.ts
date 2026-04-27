import request from 'sync-request-curl';
import { port, url } from '../config.json';
import { Answer, Colour } from '../dataStore';
import { requestClear, requestAuthRegister, requestQuizInfo, requestQuizCreate, requestQuestionCreate } from '../request';

const ERROR = { error: expect.any(String) };

function requestQuestionUpdate(
  quizId: number,
  questionId: number,
  token: string,
  question: string,
  duration: number,
  points: number,
  answers: Answer[],
  thumbnailUrl: string) {
  return request('PUT', `${url}:${port}/v2/admin/quiz/${quizId}:quizid/question/${questionId}`, {
    headers: {
      token: token
    },
    json: {
      questionBody: {
        question: question,
        duration: duration,
        points: points,
        answers: answers,
        thumbnailUrl: thumbnailUrl
      }
    },
  });
}

beforeEach(() => {
  requestClear();
});

describe('success: basic returns correct object', () => {
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
    {
      question: 'Who is the king of the Mushrooms?',
      duration: 0,
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
      ],
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
      testName: 'duration 0'
    },
    {
      question: 'Who is the king of the Mushrooms?',
      duration: 0,
      points: 10,
      answers: [
        {
          answer: 'Toad',
          correct: true
        },
        {
          answer: 'Luigi',
          correct: false
        },
      ],
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
      testName: '10 points'
    },
    {
      question: 'Who is the king of the Mushrooms?',
      duration: 0,
      points: 1,
      answers: [
        {
          answer: 'Toad',
          correct: true
        },
        {
          answer: 'Luigi',
          correct: false
        },
      ],
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
      testName: '1 point'
    },
    {
      question: 'Who is the king of the Mushrooms?',
      duration: 1,
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
          answer: 'T',
          correct: true
        },
      ],
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
      testName: '1 letter answer'
    },
    {
      question: 'Who is the king of the Mushrooms?',
      duration: 1,
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
          answer: 'Lorem ipsum dolor sit gravida.',
          correct: false
        },
      ],
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
      testName: '30 letter answer'
    },
  ])('success: returns empty object $testName', ({ question, duration, points, answers, thumbnailUrl }) => {
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
    const res = requestQuestionUpdate(quizId, quesId, token, question, duration, points, answers, thumbnailUrl);
    expect(res.statusCode).toStrictEqual(200);
    expect(JSON.parse(res.body as string)).toStrictEqual({});
  });

  test.each([
    {
      question: 'VIP?',
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
      testName: '4 letter question'
    },
    {
      question: 'Lorem ipsum dolor sit amet, consectetur erat curae.',
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
      testName: 'question 51 letters'
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
        {
          answer: 'Waluigi',
          correct: false
        },
      ],
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
      testName: '7 answers'
    },
    {
      question: 'Who is the king of the Mushrooms?',
      duration: 1,
      points: 9,
      answers: [
        {
          answer: 'Toad',
          correct: true
        },
      ],
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
      testName: '1 answers'
    },
    {
      question: 'Who is the minister of the Mushroom Kingdom?',
      duration: -8,
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
      testName: 'negative duration'
    },
    {
      question: 'Who is the minister of the Mushroom Kingdom?',
      duration: 8,
      points: 11,
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
      testName: '11 points'
    },
    {
      question: 'Who is the minister of the Mushroom Kingdom?',
      duration: 8,
      points: 0,
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
      testName: '0 points'
    },
    {
      question: 'Who is the king of the Mushrooms?',
      duration: 1,
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
          answer: '',
          correct: false
        },
      ],
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
      testName: '0 letter answer'
    },
    {
      question: 'Who is the king of the Mushrooms?',
      duration: 1,
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
          answer: 'Lorem ipsum dolor sit gravida!!',
          correct: false
        },
      ],
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
      testName: '31 letter answer'
    },
    {
      question: 'Who is the king of the Mushrooms?',
      duration: 1,
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
          answer: 'Toad',
          correct: false
        },
      ],
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
      testName: 'duplicate answer'
    },
    {
      question: 'Who is the king of the Mushrooms?',
      duration: 1,
      points: 9,
      answers: [
        {
          answer: 'Toad',
          correct: false
        },
        {
          answer: 'Luigi',
          correct: false
        },
      ],
      thumbnailUrl: 'http://google.com/some/image/path.jpg',
      testName: 'no correct answer'
    },
  ])('success: returns error $testName', ({ question, duration, points, answers, thumbnailUrl }) => {
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
    const res = requestQuestionUpdate(quizId, quesId, token, question, duration, points, answers, thumbnailUrl);
    expect(JSON.parse(res.body as string)).toStrictEqual(ERROR);
    expect(res.statusCode).toStrictEqual(400);
  });
});

describe('success: returns error advanced', () => {
  test('duration > 3min 1 question', () => {
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
    const res = requestQuestionUpdate(
      quizId,
      quesId,
      token,
      'Who is the king of the Mushrooms?',
      181,
      9,
      [
        {
          answer: 'Toad',
          correct: true
        },
        {
          answer: 'Luigi',
          correct: false
        },
      ],
      'http://google.com/some/image/path.jpg'
    );
    expect(res.statusCode).toStrictEqual(400);
    expect(JSON.parse(res.body as string)).toStrictEqual(ERROR);
  });

  test('duration > 3min 3 question', () => {
    const resUser = requestAuthRegister('validemail13@gmail.com', 'StrongPassword1', 'Marcus', 'Ryan');
    const token = JSON.parse(resUser.body as string).token;
    const resQuiz = requestQuizCreate(token, 'quiz123', 'default quiz');
    const quizId = JSON.parse(resQuiz.body as string).quizId;
    const resQues = requestQuestionCreate(
      quizId,
      token,
      'Question',
      60,
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
    requestQuestionCreate(
      quizId,
      token,
      'Question',
      60,
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
    requestQuestionCreate(
      quizId,
      token,
      'Question',
      60,
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
    const res = requestQuestionUpdate(
      quizId,
      quesId,
      token,
      'Who is the king of the Mushrooms?',
      90,
      9,
      [
        {
          answer: 'Toad',
          correct: true
        },
        {
          answer: 'Luigi',
          correct: false
        },
      ],
      'http://google.com/some/image/path.jpg'
    );
    expect(res.statusCode).toStrictEqual(400);
    expect(JSON.parse(res.body as string)).toStrictEqual(ERROR);
  });

  test('invalid question ID', () => {
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
    const res = requestQuestionUpdate(
      quizId,
      quesId + 1,
      token,
      'Who is the king of the Mushrooms?',
      10,
      9,
      [
        {
          answer: 'Toad',
          correct: true
        },
        {
          answer: 'Luigi',
          correct: false
        },
      ],
      'http://google.com/some/image/path.jpg'
    );
    expect(res.statusCode).toStrictEqual(400);
    expect(JSON.parse(res.body as string)).toStrictEqual(ERROR);
  });

  test('invalid quiz ID', () => {
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
    const res = requestQuestionUpdate(
      quizId + 1,
      quesId,
      token,
      'Who is the king of the Mushrooms?',
      10,
      9,
      [
        {
          answer: 'Toad',
          correct: true
        },
        {
          answer: 'Luigi',
          correct: false
        },
      ],
      'http://google.com/some/image/path.jpg'
    );
    expect(res.statusCode).toStrictEqual(400);
    expect(JSON.parse(res.body as string)).toStrictEqual(ERROR);
  });

  test.each(['invalid', ''])('invalid token', (invalid) => {
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
    const res = requestQuestionUpdate(
      quizId,
      quesId,
      invalid,
      'Who is the king of the Mushrooms?',
      10,
      9,
      [
        {
          answer: 'Toad',
          correct: true
        },
        {
          answer: 'Luigi',
          correct: false
        },
      ],
      'http://google.com/some/image/path.jpg'
    );
    expect(res.statusCode).toStrictEqual(401);
    expect(JSON.parse(res.body as string)).toStrictEqual(ERROR);
  });

  test('invalid question ID', () => {
    const resUser = requestAuthRegister('validemail13@gmail.com', 'StrongPassword1', 'Marcus', 'Ryan');
    const token = JSON.parse(resUser.body as string).token;
    const resUser2 = requestAuthRegister('validemail12@gmail.com', 'StrongPassword1', 'Marcus', 'Ryan');
    const token2 = JSON.parse(resUser2.body as string).token;
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
    const res = requestQuestionUpdate(
      quizId,
      quesId,
      token2,
      'Who is the king of the Mushrooms?',
      10,
      9,
      [
        {
          answer: 'Toad',
          correct: true
        },
        {
          answer: 'Luigi',
          correct: false
        },
      ],
      'http://google.com/some/image/path.jpg'
    );
    expect(res.statusCode).toStrictEqual(403);
    expect(JSON.parse(res.body as string)).toStrictEqual(ERROR);
  });
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
  {
    question: 'Who is the king of the Mushrooms?',
    duration: 0,
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
    ],
    thumbnailUrl: 'http://google.com/some/image/path.jpg',
    testName: 'duration 0'
  },
  {
    question: 'Who is the king of the Mushrooms?',
    duration: 0,
    points: 10,
    answers: [
      {
        answer: 'Toad',
        correct: true
      },
      {
        answer: 'Luigi',
        correct: false
      },
    ],
    thumbnailUrl: 'http://google.com/some/image/path.jpg',
    testName: '10 points'
  },
  {
    question: 'Who is the king of the Mushrooms?',
    duration: 0,
    points: 1,
    answers: [
      {
        answer: 'Toad',
        correct: true
      },
      {
        answer: 'Luigi',
        correct: false
      },
    ],
    thumbnailUrl: 'http://google.com/some/image/path.jpg',
    testName: '1 point'
  },
  {
    question: 'Who is the king of the Mushrooms?',
    duration: 1,
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
        answer: 'T',
        correct: true
      },
    ],
    thumbnailUrl: 'http://google.com/some/image/path.jpg',
    testName: '1 letter answer'
  },
  {
    question: 'Who is the king of the Mushrooms?',
    duration: 1,
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
        answer: 'Lorem ipsum dolor sit gravida.',
        correct: false
      },
    ],
    thumbnailUrl: 'http://google.com/some/image/path.jpg',
    testName: '30 letter answer'
  },
])('success: correct side effect $testName', ({ question, duration, points, answers, thumbnailUrl }) => {
  const resUser = requestAuthRegister('validemail13@gmail.com', 'StrongPassword1', 'Marcus', 'Ryan');
  const token = JSON.parse(resUser.body as string).token;
  const resQuiz = requestQuizCreate(token, 'quiz123', 'default quiz');
  const quizId = JSON.parse(resQuiz.body as string).quizId;
  const resInfoBefore = requestQuizInfo(token, quizId);
  const timeCreated = JSON.parse(resInfoBefore.body as string).timeLastEdited;

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

  const res = requestQuestionUpdate(quizId, quesId, token, question, duration, points, answers, thumbnailUrl);
  expect(res.statusCode).toStrictEqual(200);

  const resInfo = requestQuizInfo(token, quizId);
  const info = JSON.parse(resInfo.body as string);

  expect(info.duration).toStrictEqual(duration);

  const quest = info.questions[0];
  const timeLastEdited = JSON.parse(resInfo.body as string).timeLastEdited;
  expect(quest.question).toStrictEqual(question);
  expect(quest.duration).toStrictEqual(duration);
  expect(quest.points).toStrictEqual(points);

  const ansColours = new Set([]);
  const validColours = Object.values(Colour);

  for (const answer of quest.answers) {
    expect(answer.answer).toStrictEqual(expect.any(String));
    expect(answer.correct).toStrictEqual(expect.any(Boolean));
    expect(validColours.includes(answer.colour));
    ansColours.add(answer.colour);
  }
  expect(ansColours.size).toStrictEqual(quest.answers.length);

  expect(timeCreated).toBeLessThan(timeLastEdited);
});
