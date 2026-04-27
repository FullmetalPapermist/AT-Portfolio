import { getData, Answer, Error } from './dataStore';
import { tokenUserId } from './session';
import { findQuiz, checkValidUser, shuffleList, getDuration } from './other';
import HTTPError from 'http-errors';
import { Quiz, Colour, ColouredAnswer } from './dataStore';
import isUrlHttp from 'is-url-http';

interface QuestionId {
  questionId: number;
}

// Creates a question in a given quiz

export function questionChecks(
  quizToUpdate: Quiz,
  duration: number,
  points: number,
  question: string,
  answers: Answer[],
  thumbnailUrl: string
) {
  if (duration < 0) {
    throw HTTPError(400, 'duration must be a positive number');
  }

  if (points > 10 || points < 1) {
    throw HTTPError(400, 'points must be between 1 and 10 letters');
  }

  if (question.length > 50 || question.length < 5) {
    throw HTTPError(400, 'question must be between 5 and 50 letters');
  }

  if (answers.length < 2 || answers.length > 6) {
    throw HTTPError(400, 'question must have between 2 and 6 answers');
  }

  const correct = answers.find((answer) => answer.correct === true);
  if (correct === undefined) {
    throw HTTPError(400, 'question must have correct answer');
  }

  for (const answer of answers) {
    if (answer.answer.length < 1 || answer.answer.length > 30) {
      throw HTTPError(400, 'answers must be between 1 to 30 letters');
    }
  }

  const answerCopy = [];
  for (const answer of answers) {
    answerCopy.push(answer);
  }
  answerCopy.sort((a, b) => a.answer.localeCompare(b.answer));
  for (let i = 1; i < answerCopy.length; i++) {
    if (answerCopy[i - 1].answer === answerCopy[i].answer) {
      throw HTTPError(400, 'cannot be duplicate answers');
    }
  }
  let totalDuration = duration;
  for (const ques of quizToUpdate.questions) {
    totalDuration += ques.duration;
  }

  if (totalDuration > 180) {
    throw HTTPError(400, 'Quiz cannot be longer than 3 minutes');
  }

  if (thumbnailUrl === '') {
    throw HTTPError(400, 'thumbnailUrl cannot be empty');
  }

  // Not sure if this is good enough to determine if the url is valid
  if (!isUrlHttp(thumbnailUrl)) {
    throw HTTPError(400, 'thumbnailUrl is invalid');
  }

  if ((!thumbnailUrl.endsWith('jpg')) && !(thumbnailUrl.endsWith('png'))) {
    throw HTTPError(400, 'thumbnailUrl must be a jpg or png file');
  }
}

export function colourAnswers(answers: Answer[]): ColouredAnswer[] {
  const colours = Object.values(Colour);
  shuffleList(colours);
  const colouredAnswers = [];
  for (const answer of answers) {
    const colouredAnswer = {
      answer: answer.answer,
      correct: answer.correct,
      colour: colours.shift(),
      answerId: getData().nextAnswerId
    };
    getData().nextAnswerId++;
    colouredAnswers.push(colouredAnswer);
  }
  return colouredAnswers;
}

export function adminQuestionCreate(
  quizId: number,
  token: string,
  question: string,
  duration: number,
  points: number,
  answers: Answer[],
  thumbnailUrl: string
): QuestionId | Error {
  const userId = tokenUserId(token);

  const quizToUpdate = findQuiz(quizId);

  const data = getData();

  checkValidUser(quizToUpdate, userId);

  questionChecks(quizToUpdate, duration, points, question, answers, thumbnailUrl);

  const newQuesId = data.nextQuestionId;
  data.nextQuestionId++;

  const newQuestion = {
    question: question,
    duration: duration,
    points: points,
    answers: colourAnswers(answers),
    questionId: newQuesId,
    thumbnailUrl: thumbnailUrl,
  };

  quizToUpdate.questions.push(newQuestion);
  quizToUpdate.timeLastEdited = Date.now();
  quizToUpdate.duration = getDuration(quizToUpdate.questions);

  return {
    questionId: newQuesId
  };
}

// ADD DURATION!!
