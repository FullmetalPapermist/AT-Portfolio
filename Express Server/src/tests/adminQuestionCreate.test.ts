import { Colour } from '../dataStore';
import {
  requestClear,
  requestAuthRegister,
  requestQuizInfo,
  requestQuizCreate,
  requestQuestionCreate,
  standardAnswers,
  standardDuration,
  standardPoints,
  standardQuestion,
  standardThumbnailUrl,
  ERROR
} from '../request';

beforeEach(() => {
  requestClear();
});

describe('success: basic returns correct object', () => {
  test.each([
    {
      question: 'King?',
      duration: standardDuration,
      points: standardPoints,
      answers: standardAnswers,
      thumbnailUrl: standardThumbnailUrl,
      testName: '5 letter question'
    },
    {
      question: 'Lorem ipsum dolor sit amet, consectetur cras amet?',
      duration: standardDuration,
      points: standardPoints,
      answers: standardAnswers,
      thumbnailUrl: standardThumbnailUrl,
      testName: '50 word question'
    },
    {
      question: standardQuestion,
      duration: standardDuration,
      points: standardPoints,
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
      thumbnailUrl: standardThumbnailUrl,
      testName: '6 answers'
    },
    {
      question: standardQuestion,
      duration: 0,
      points: standardPoints,
      answers: standardAnswers,
      thumbnailUrl: standardThumbnailUrl,
      testName: 'duration 0'
    },
    {
      question: standardQuestion,
      duration: standardDuration,
      points: 10,
      answers: standardAnswers,
      thumbnailUrl: standardThumbnailUrl,
      testName: '10 points'
    },
    {
      question: standardQuestion,
      duration: standardDuration,
      points: 1,
      answers: standardAnswers,
      thumbnailUrl: standardThumbnailUrl,
      testName: '1 point'
    },
    {
      question: standardQuestion,
      duration: standardDuration,
      points: standardPoints,
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
      thumbnailUrl: standardThumbnailUrl,
      testName: '1 letter answer'
    },
    {
      question: standardQuestion,
      duration: standardDuration,
      points: standardPoints,
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
      thumbnailUrl: standardThumbnailUrl,
      testName: '30 letter answer'
    },
  ])('success: returns questionId $testName', ({ question, duration, points, answers, thumbnailUrl }) => {
    const resUser = requestAuthRegister('validemail13@gmail.com', 'StrongPassword1', 'Marcus', 'Ryan');
    const token = JSON.parse(resUser.body as string).token;
    const resQuiz = requestQuizCreate(token, 'quiz123', 'default quiz');
    const quizId = JSON.parse(resQuiz.body as string).quizId;
    const res = requestQuestionCreate(quizId, token, question, duration, points, answers, thumbnailUrl);
    expect(res.statusCode).toStrictEqual(200);
    expect(JSON.parse(res.body as string)).toStrictEqual({ questionId: expect.any(Number) });
  });

  test('success: returns different questionId', () => {
    const resUser = requestAuthRegister('validemail13@gmail.com', 'StrongPassword1', 'Marcus', 'Ryan');
    const token = JSON.parse(resUser.body as string).token;
    const resQuiz = requestQuizCreate(token, 'quiz123', 'default quiz');
    const quizId = JSON.parse(resQuiz.body as string).quizId;
    const res1 = requestQuestionCreate(
      quizId,
      token,
      standardQuestion,
      standardDuration,
      standardPoints,
      standardAnswers,
      standardThumbnailUrl
    );
    const quesId1 = JSON.parse(res1.body as string);
    const res2 = requestQuestionCreate(
      quizId,
      token,
      standardQuestion,
      standardDuration,
      standardPoints,
      standardAnswers,
      standardThumbnailUrl
    );
    const quesId2 = JSON.parse(res2.body as string);
    expect(quesId1).not.toStrictEqual(quesId2);
  });

  test.each([
    {
      question: 'VIP?',
      duration: standardDuration,
      points: standardPoints,
      answers: standardAnswers,
      thumbnailUrl: standardThumbnailUrl,
      testName: '4 letter question'
    },
    {
      question: 'Lorem ipsum dolor sit amet, consectetur erat curae.',
      duration: standardDuration,
      points: standardPoints,
      answers: standardAnswers,
      thumbnailUrl: standardThumbnailUrl,
      testName: 'question 51 letters'
    },
    {
      question: standardQuestion,
      duration: standardDuration,
      points: standardPoints,
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
      thumbnailUrl: standardThumbnailUrl,
      testName: '7 answers'
    },
    {
      question: standardQuestion,
      duration: standardDuration,
      points: standardPoints,
      answers: [
        {
          answer: 'Toad',
          correct: true
        },
      ],
      thumbnailUrl: standardThumbnailUrl,
      testName: '1 answers'
    },
    {
      question: standardQuestion,
      duration: -8,
      points: standardPoints,
      answers: standardAnswers,
      thumbnailUrl: standardThumbnailUrl,
      testName: 'negative duration'
    },
    {
      question: standardQuestion,
      duration: standardDuration,
      points: 11,
      answers: standardAnswers,
      thumbnailUrl: standardThumbnailUrl,
      testName: '11 points'
    },
    {
      question: standardQuestion,
      duration: standardDuration,
      points: 0,
      answers: standardAnswers,
      thumbnailUrl: standardThumbnailUrl,
      testName: '0 points'
    },
    {
      question: standardQuestion,
      duration: standardDuration,
      points: standardPoints,
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
      thumbnailUrl: standardThumbnailUrl,
      testName: '0 letter answer'
    },
    {
      question: standardQuestion,
      duration: standardDuration,
      points: standardPoints,
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
      thumbnailUrl: standardThumbnailUrl,
      testName: '31 letter answer'
    },
    {
      question: standardQuestion,
      duration: standardDuration,
      points: standardPoints,
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
      thumbnailUrl: standardThumbnailUrl,
      testName: 'duplicate answer'
    },
    {
      question: standardQuestion,
      duration: standardDuration,
      points: standardPoints,
      answers: [
        {
          answer: 'Toad',
          correct: false
        },
        {
          answer: 'Luigi',
          correct: false
        }
      ],
      thumbnailUrl: standardThumbnailUrl,
      testName: 'no correct answer'
    },
    {
      question: standardQuestion,
      duration: standardDuration,
      points: standardPoints,
      answers: standardAnswers,
      thumbnailUrl: '',
      testName: 'empty thumbnailUrl'
    },
    {
      question: standardQuestion,
      duration: standardDuration,
      points: standardPoints,
      answers: standardAnswers,
      thumbnailUrl: 'htp://google.com/some/image/path.jpg',
      testName: 'invalid url'
    },
    {
      question: standardQuestion,
      duration: standardDuration,
      points: standardPoints,
      answers: standardAnswers,
      thumbnailUrl: 'http://google.com/some/image/path.jg',
      testName: 'invalid url'
    },
  ])('success: returns error $testName', ({ question, duration, points, answers, thumbnailUrl }) => {
    const resUser = requestAuthRegister('validemail13@gmail.com', 'StrongPassword1', 'Marcus', 'Ryan');
    const token = JSON.parse(resUser.body as string).token;
    const resQuiz = requestQuizCreate(token, 'quiz123', 'default quiz');
    const quizId = JSON.parse(resQuiz.body as string).quizId;
    expect(quizId).toStrictEqual(expect.any(Number));
    const res = requestQuestionCreate(quizId, token, question, duration, points, answers, thumbnailUrl);
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
    const res = requestQuestionCreate(
      quizId,
      token,
      standardQuestion,
      181,
      standardPoints,
      standardAnswers,
      standardThumbnailUrl
    );
    expect(res.statusCode).toStrictEqual(400);
    expect(JSON.parse(res.body as string)).toStrictEqual(ERROR);
  });

  test('duration > 3min 3 question', () => {
    const resUser = requestAuthRegister('validemail13@gmail.com', 'StrongPassword1', 'Marcus', 'Ryan');
    const token = JSON.parse(resUser.body as string).token;
    const resQuiz = requestQuizCreate(token, 'quiz123', 'default quiz');
    const quizId = JSON.parse(resQuiz.body as string).quizId;
    const res1 = requestQuestionCreate(
      quizId,
      token,
      standardQuestion,
      90,
      standardPoints,
      standardAnswers,
      standardThumbnailUrl
    );
    const res2 = requestQuestionCreate(
      quizId,
      token,
      standardQuestion,
      90,
      standardPoints,
      standardAnswers,
      standardThumbnailUrl
    );
    const res3 = requestQuestionCreate(
      quizId,
      token,
      standardQuestion,
      90,
      standardPoints,
      standardAnswers,
      standardThumbnailUrl
    );
    expect(res1.statusCode).toStrictEqual(200);
    expect(res2.statusCode).toStrictEqual(200);
    expect(res3.statusCode).toStrictEqual(400);
    expect(JSON.parse(res3.body as string)).toStrictEqual(ERROR);
  });

  test('Invalid quizId', () => {
    const resUser = requestAuthRegister('validemail13@gmail.com', 'StrongPassword1', 'Marcus', 'Ryan');
    const token = JSON.parse(resUser.body as string).token;
    const resQuiz = requestQuizCreate(token, 'quiz123', 'default quiz');
    const quizId = JSON.parse(resQuiz.body as string).quizId;
    const res = requestQuestionCreate(
      quizId + 1,
      token,
      standardQuestion,
      standardDuration,
      standardPoints,
      standardAnswers,
      standardThumbnailUrl
    );
    expect(res.statusCode).toStrictEqual(400);
    expect(JSON.parse(res.body as string)).toStrictEqual(ERROR);
  });

  test.each(['token', ''])('Invalid token `%s`', (invalid) => {
    const resUser = requestAuthRegister('validemail13@gmail.com', 'StrongPassword1', 'Marcus', 'Ryan');
    const token = JSON.parse(resUser.body as string).token;
    const resQuiz = requestQuizCreate(token, 'quiz123', 'default quiz');
    const quizId = JSON.parse(resQuiz.body as string).quizId;
    const res = requestQuestionCreate(
      quizId,
      invalid,
      standardQuestion,
      standardDuration,
      standardPoints,
      standardAnswers,
      standardThumbnailUrl
    );
    expect(res.statusCode).toStrictEqual(401);
    expect(JSON.parse(res.body as string)).toStrictEqual(ERROR);
  });

  test('User is not owner', () => {
    const resUser = requestAuthRegister('validemail13@gmail.com', 'StrongPassword1', 'Marcus', 'Ryan');
    const resUser2 = requestAuthRegister('validemail12@gmail.com', 'StrongPassword1', 'Bob', 'Milo');
    const token = JSON.parse(resUser.body as string).token;
    const token2 = JSON.parse(resUser2.body as string).token;
    const resQuiz = requestQuizCreate(token, 'quiz123', 'default quiz');
    const quizId = JSON.parse(resQuiz.body as string).quizId;
    const res = requestQuestionCreate(
      quizId,
      token2,
      standardQuestion,
      standardDuration,
      standardPoints,
      standardAnswers,
      standardThumbnailUrl
    );
    expect(res.statusCode).toStrictEqual(403);
    expect(JSON.parse(res.body as string)).toStrictEqual(ERROR);
  });
});

describe('success: correct side effect', () => {
  test.each([
    {
      question: 'King?',
      duration: standardDuration,
      points: standardPoints,
      answers: standardAnswers,
      thumbnailUrl: standardThumbnailUrl,
      testName: '5 letter question'
    },
    {
      question: 'Lorem ipsum dolor sit amet, consectetur cras amet?',
      duration: standardDuration,
      points: standardPoints,
      answers: standardAnswers,
      thumbnailUrl: standardThumbnailUrl,
      testName: '50 word question'
    },
    {
      question: standardQuestion,
      duration: standardDuration,
      points: standardPoints,
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
      thumbnailUrl: standardThumbnailUrl,
      testName: '6 answers'
    },
    {
      question: standardQuestion,
      duration: 0,
      points: standardPoints,
      answers: standardAnswers,
      thumbnailUrl: standardThumbnailUrl,
      testName: 'duration 0'
    },
    {
      question: standardQuestion,
      duration: standardDuration,
      points: standardPoints,
      answers: standardAnswers,
      thumbnailUrl: standardThumbnailUrl,
      testName: '10 points'
    },
    {
      question: standardQuestion,
      duration: standardDuration,
      points: 1,
      answers: standardAnswers,
      thumbnailUrl: standardThumbnailUrl,
      testName: '1 point'
    },
    {
      question: standardQuestion,
      duration: standardDuration,
      points: standardPoints,
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
      thumbnailUrl: standardThumbnailUrl,
      testName: '1 letter answer'
    },
    {
      question: standardQuestion,
      duration: standardDuration,
      points: standardPoints,
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
      thumbnailUrl: standardThumbnailUrl,
      testName: '30 letter answer'
    },
  ])('success: add single question', ({ question, duration, points, answers, thumbnailUrl }) => {
    const resUser = requestAuthRegister('validemail13@gmail.com', 'StrongPassword1', 'Marcus', 'Ryan');
    const token = JSON.parse(resUser.body as string).token;
    const resQuiz = requestQuizCreate(token, 'quiz123', 'default quiz');
    const quizId = JSON.parse(resQuiz.body as string).quizId;

    const resInfo = requestQuizInfo(token, quizId);
    const quiz = JSON.parse(resInfo.body as string);
    expect(quiz.questions).toStrictEqual([]);
    const timeCreated = quiz.timeLastEdited;

    const res = requestQuestionCreate(quizId, token, question, duration, points, answers, thumbnailUrl);
    expect(res.statusCode).toStrictEqual(200);

    const resInfo2 = requestQuizInfo(token, quizId);
    const timeLastEdited = JSON.parse(resInfo2.body as string).timeLastEdited;
    const quizInfo = JSON.parse(resInfo2.body as string);
    expect(quizInfo.questions.length).toStrictEqual(1);
    expect(quizInfo.duration).toStrictEqual(duration);

    const questObj = quizInfo.questions[0];

    const validColours = Object.values(Colour);

    expect(questObj.question).toStrictEqual(question);
    expect(questObj.duration).toStrictEqual(duration);
    expect(questObj.points).toStrictEqual(points);
    expect(questObj.answers.length).toStrictEqual(answers.length);
    expect(questObj.questionId).toStrictEqual(expect.any(Number));
    const ansColours = new Set([]);
    const ansId = new Set([]);
    for (const answer of questObj.answers) {
      expect(answer.answer).toStrictEqual(expect.any(String));
      expect(answer.correct).toStrictEqual(expect.any(Boolean));
      expect(validColours.includes(answer.colour));
      ansId.add(answer.answerId);
      ansColours.add(answer.colour);
    }
    expect(ansColours.size).toStrictEqual(questObj.answers.length);
    expect(ansId.size).toStrictEqual(questObj.answers.length);

    expect(timeCreated).toBeLessThan(timeLastEdited);
  });

  test('success: add multiple questions', () => {
    const resUser = requestAuthRegister('validemail13@gmail.com', 'StrongPassword1', 'Marcus', 'Ryan');
    const token = JSON.parse(resUser.body as string).token;
    const resQuiz = requestQuizCreate(token, 'quiz123', 'default quiz');
    const quizId = JSON.parse(resQuiz.body as string).quizId;

    const resInfo = requestQuizInfo(token, quizId);
    const quiz = JSON.parse(resInfo.body as string);
    expect(quiz.questions).toStrictEqual([]);
    expect(quiz.duration).toStrictEqual(0);

    requestQuestionCreate(
      quizId,
      token,
      standardQuestion,
      standardDuration,
      standardPoints,
      standardAnswers,
      standardThumbnailUrl
    );
    requestQuestionCreate(
      quizId,
      token,
      standardQuestion,
      standardDuration,
      standardPoints,
      standardAnswers,
      standardThumbnailUrl
    );
    const resInfo2 = requestQuizInfo(token, quizId);
    const quizInfo = JSON.parse(resInfo2.body as string);
    expect(quizInfo.questions.length).toStrictEqual(2);
    expect(quizInfo.duration).toStrictEqual(standardDuration + standardDuration);
  });
});
