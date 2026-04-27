import request from 'sync-request-curl';
import { port, url } from './config.json';
import { Answer } from './dataStore';

export const standardQuestion = 'Who is the king of the Mushrooms?';
export const standardDuration = 5;
export const standardPoints = 5;
export const standardAnswers = [
  {
    answer: 'Toad',
    correct: true
  },
  {
    answer: 'Luigi',
    correct: false
  }
];

export const standardName = 'Harry Styles';

export const standardThumbnailUrl = 'http://google.com/some/image/path.jpg';

export const standardAutoStartNum = 10;

export const ERROR = { error: expect.any(String) };

const SERVER_URL = `${url}:${port}`;

export function requestClear() {
  return request('DELETE', SERVER_URL + '/v1/clear', {
    timeout: 100
  }
  );
}

export function requestAuthRegister(email: string, password: string, nameFirst:string, nameLast:string) {
  return request('POST', SERVER_URL + '/v1/admin/auth/register', {
    json: {
      email: email,
      password: password,
      nameFirst: nameFirst,
      nameLast: nameLast,
    },
  });
}

export function requestUserDetailsNonPass(token: string, email: string, nameFirst:string, nameLast:string) {
  return request('PUT', SERVER_URL + '/v2/admin/user/details', {
    headers: {
      token: token,
    },
    json: {
      email: email,
      nameFirst: nameFirst,
      nameLast: nameLast,
    },
  });
}

export function requestAuthLogin(email: string, password: string) {
  return request('POST', SERVER_URL + '/v2/admin/auth/login', {
    json: {
      email: email,
      password: password,
    },
  });
}

export function requestLogout(token: string) {
  return request('POST', SERVER_URL + '/v2/admin/auth/logout', {
    json: {
      token: token
    },
  });
}

export function requestQuizCreate(token: string, name: string, description: string) {
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

export function requestQuizInfo(token: string, quizId: number) {
  return request('GET', SERVER_URL + '/v2/admin/quiz/' + quizId, {
    headers: { token: token }
  });
}

export function requestQuestionCreate(
  quizId: number,
  token: string,
  question: string,
  duration: number,
  points: number,
  answers: Answer[],
  thumbnailUrl: string) {
  return request('POST', `${url}:${port}/v2/admin/quiz/${quizId}:quizid/question`, {
    headers: { token: token },
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

export function requestSessionStart(autoStartNum: number, quizid: number, token: string) {
  return request('POST', `${url}:${port}/v1/admin/quiz/${quizid}/session/start`, {
    headers: {
      token: token,
    },
    json: {
      autoStartNum: autoStartNum,
    }
  });
}

export function requestSessionUpdate(quizid: number, sessionid: string, token: string, action: string) {
  return request('PUT', `${url}:${port}/v1/admin/quiz/${quizid}/session/${sessionid}`, {
    headers: {
      token: token,
    },
    json: {
      action: action,
    }
  });
}

export function requestSessionGet(quizid: number, sessionid: string, token: string) {
  return request('GET', `${url}:${port}/v1/admin/quiz/${quizid}/session/${sessionid}`, {
    headers: {
      token: token,
    }
  });
}

export function requestChatSend(playerId: number, messageBody: string) {
  return request('POST', `${url}:${port}/v1/player/${playerId}/chat`, {
    json: {
      messageBody: messageBody,
    }
  });
}

export function requestChatView(playerId: number) {
  return request('GET', `${url}:${port}/v1/player/${playerId}/chat`);
}

export function createStandardQuizSession() {
  const resUser = requestAuthRegister('validemail13@gmail.com', 'StrongPassword1', 'Marcus', 'Ryan');
  const token = JSON.parse(resUser.body as string).token;
  const resQuiz = requestQuizCreate(token, 'quiz123', 'default quiz');
  const quizId = JSON.parse(resQuiz.body as string).quizId;
  const resQuestionId1 = requestQuestionCreate(quizId, token, standardQuestion, standardDuration, standardPoints, standardAnswers, standardThumbnailUrl);
  const questionId1 = JSON.parse(resQuestionId1.body as string).questionId;
  const resQuestionId2 = requestQuestionCreate(quizId, token, standardQuestion, standardDuration, standardPoints, standardAnswers, standardThumbnailUrl);
  const questionId2 = JSON.parse(resQuestionId2.body as string).questionId;
  const resSession = requestSessionStart(standardAutoStartNum, quizId, token);
  const sessionId = JSON.parse(resSession.body as string).sessionId;
  return {
    sessionId: sessionId,
    token: token,
    quizId: quizId,
    questionId1: questionId1,
    questionId2: questionId2
  };
}

export function requestSessionList(token: string, quizid: number) {
  return request('GET', `${url}:${port}/v1/admin/quiz/${quizid}/sessions`, {
    headers: {
      token: token,
    }
  });
}

export function requestPlayerJoin(sessionId: string, name: string) {
  return request('POST', `${url}:${port}/v1/player/join`, {
    json: {
      sessionId: sessionId,
      name: name,
    }
  }
  );
}

export function requestPlayerQuestionInfo(playerId: number, questionPosition: number) {
  return request('GET', `${url}:${port}/v1/player/${playerId}/question/${questionPosition}`);
}

export function requestPlayerQuestionSubmit(playerId: number, questionPosition: number, answerIds: number[]) {
  return request('PUT', `${url}:${port}/v1/player/${playerId}/question/${questionPosition}/answer`, {
    json: {
      answerIds: answerIds
    }
  });
}

export function requestQuizThumbnailUpdate(token: string, quizId: number, imgUrl: string) {
  return request('PUT', `${url}:${port}/v1/admin/quiz/${quizId}/thumbnail`, {
    headers: {
      token: token,
    },
    json: {
      imgUrl: imgUrl
    }
  });
}
