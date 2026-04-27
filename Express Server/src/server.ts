import express, { json, Request, Response } from 'express';
import { echo } from './newecho';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import errorHandler from 'middleware-http-errors';
import YAML from 'yaml';
import sui from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import process from 'process';
import { clear } from './other';

import { adminAuthRegister } from './adminAuthRegister';
import { adminQuizNameUpdate } from './adminQuizNameUpdate';
import { adminQuizDescriptionUpdate } from './adminQuizDescriptionUpdate';
import { adminUserDetailsNonPass } from './adminUserDetailsNonPass';
import { adminUserPassword } from './adminUserPassword';
import { adminQuestionCreate } from './adminQuestionCreate';
import { adminQuestionUpdate } from './adminQuestionUpdate';
import { adminQuestionDelete } from './adminQuestionDelete';
import { adminQuestionMove } from './adminQuestionMove';
import { adminAuthLogin } from './adminAuthLogin';
import { adminQuizCreate } from './adminQuizCreate';
import { adminQuizRemove } from './adminQuizRemove';
import { adminQuizTransfer } from './adminQuizTransfer';
// These will be in quiz
import { adminQuizTrashDetails, adminQuizTrashRestore, adminQuizTrashEmpty } from './trash';
import { adminQuizInfo } from './adminQuizInfo';
import { DataStore, getData, setData, createDataStore } from './dataStore';
import { adminUserDetails } from './adminUserDetails';
import { adminQuizList } from './adminQuizList';
import { adminAuthLogout } from './adminAuthLogout';
import { adminQuestionDuplicate } from './adminQuestionDuplicate';
import { adminQuizSessionStart } from './adminQuizSessionStart';
import { adminQuizSessionUpdate } from './adminQuizSessionUpdate';
import { adminQuizSessionGet } from './adminQuizSessionGet';
import { adminQuizThumbnailUpdate } from './adminQuizThumbnailUpdate';
import { playerJoin } from './playerJoin';
import { playerQuestionInfo } from './playerQuestionInfo';
import { playerQuestionSubmit } from './playerQuestionSubmit';
import { playerQuestionResults } from './playerQuestionResults';
import { quizSessionList } from './quizSessionList';
import { chatSend, chatView } from './chat';
// import { stringify } from 'querystring';

// Set up web app
const app = express();
// Use middleware that allows us to access the JSON body of requests
app.use(json());
// Use middleware that allows for access from other domains
app.use(cors());
// for logging errors (print to terminal)
app.use(morgan('dev'));
// for producing the docs that define the API
const file = fs.readFileSync(path.join(process.cwd(), 'swagger.yaml'), 'utf8');
app.get('/', (req: Request, res: Response) => res.redirect('/docs'));
app.use('/docs', sui.serve, sui.setup(YAML.parse(file), { swaggerOptions: { docExpansion: config.expandDocs ? 'full' : 'list' } }));

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || 'localhost';

// ====================================================================
//  ================= WORK IS DONE BELOW THIS LINE ===================
// ====================================================================

let data: DataStore = createDataStore();

try {
  const jsonstr = fs.readFileSync('database.json');
  data = JSON.parse(String(jsonstr));
  setData(data);
} catch (error) {
  fs.writeFileSync('database.json', JSON.stringify(getData()));
}

// Example get request
app.get('/echo', (req: Request, res: Response) => {
  const data = req.query.echo as string;
  return res.json(echo(data));
});

app.post('/v1/admin/auth/register', (req: Request, res: Response) => {
  const result = adminAuthRegister(req.body.email, req.body.password,
    req.body.nameFirst, req.body.nameLast);
  return res.json(result);
});

app.post('/v2/admin/auth/login', (req: Request, res: Response) => {
  const result = adminAuthLogin(req.body.email, req.body.password);
  if ('error' in result) {
    return res.status(400).json(result);
  }
  return res.json(result);
});

app.get('/v2/admin/user/details', (req: Request, res: Response) => {
  const result = adminUserDetails(
    String(req.query.token)
  );
  if ('error' in result) {
    return res.status(401).json(result);
  }
  return res.json(result);
});

app.get('/v2/admin/quiz/list', (req: Request, res: Response) => {
  const result = adminQuizList(
    String(req.query.token)
  );
  if ('error' in result) {
    return res.status(401).json(result);
  }
  return res.json(result);
});

app.post('/v2/admin/quiz', (req: Request, res: Response) => {
  const token = req.header('token');
  const result = adminQuizCreate(
    token,
    req.body.name,
    req.body.description
  );
  return res.json(result);
});

app.delete('/v2/admin/quiz/:quizid', (req: Request, res: Response) => {
  const token = req.header('token');
  const result = adminQuizRemove(
    token,
    parseInt(req.params.quizid)
  );
  return res.json(result);
});

app.put('/v2/admin/quiz/:quizid/name', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const token = req.header('token');

  const result = adminQuizNameUpdate(quizId, token, req.body.name);

  return res.json(result);
});

app.put('/v2/admin/quiz/:quizid/description', (req: Request, res: Response) => {
  return res.json(adminQuizDescriptionUpdate(
    req.header('token'),
    parseInt(req.params.quizid),
    req.body.description
  ));
});

app.delete('/v1/clear', (req: Request, res: Response) => {
  const result = clear();
  return res.json(result);
});

app.put('/v2/admin/user/details', (req: Request, res: Response) => {
  const token = req.header('token');
  const result = adminUserDetailsNonPass(token, req.body.email,
    req.body.nameFirst, req.body.nameLast);

  return res.json(result);
});

app.put('/v2/admin/user/password', (req: Request, res: Response) => {
  const token = req.header('token');
  const result = adminUserPassword(token, req.body.oldPassword,
    req.body.newPassword);

  return res.json(result);
});

app.get('/v2/admin/quiz/trash', (req: Request, res: Response) => {
  const token = req.header('token');
  const result = adminQuizTrashDetails(token);
  return res.json(result);
});

app.post('/v2/admin/quiz/:quizid/restore', (req: Request, res: Response) => {
  const token = req.header('token');
  const result = adminQuizTrashRestore(token, parseInt(req.params.quizid));
  return res.json(result);
});

app.delete('/v2/admin/quiz/trash/empty', (req: Request, res: Response) => {
  const token = req.header('token');
  const result = adminQuizTrashEmpty(token, String(req.query.quizIds));
  return res.json(result);
});

app.post('/v2/admin/quiz/:quizid/transfer', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const token = req.header('token');
  const result = adminQuizTransfer(
    quizId,
    token,
    req.body.userEmail
  );

  return res.json(result);
});

app.post('/v2/admin/quiz/:quizid/question', (req: Request, res: Response) => {
  return res.json(adminQuestionCreate(
    parseInt(req.params.quizid),
    req.header('token'),
    req.body.questionBody.question,
    req.body.questionBody.duration,
    req.body.questionBody.points,
    req.body.questionBody.answers,
    req.body.questionBody.thumbnailUrl
  ));
});

app.put('/v2/admin/quiz/:quizid/question/:questionid', (req: Request, res: Response) => {
  return res.json(adminQuestionUpdate(
    parseInt(req.params.quizid),
    parseInt(req.params.questionid),
    req.header('token'),
    req.body.questionBody.question,
    req.body.questionBody.duration,
    req.body.questionBody.points,
    req.body.questionBody.answers,
    req.body.questionBody.thumbnailUrl
  ));
});

app.delete('/v2/admin/quiz/:quizid/question/:questionid', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  const result = adminQuestionDelete(
    String(req.query.token),
    quizId,
    questionId
  );

  if ('error' in result) {
    if (result.error.includes('token')) {
      return res.status(401).json(result);
    } else if (result.error.includes('owner')) {
      return res.status(403).json(result);
    } else {
      return res.status(400).json(result);
    }
  }

  return res.json(result);
});

app.put('/v2/admin/quiz/:quizid/question/:questionid/move', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  const newPosition = req.body.newPosition;
  const result = adminQuestionMove(
    req.body.token,
    quizId,
    questionId,
    newPosition
  );
  if ('error' in result) {
    if (result.error.includes('token')) {
      return res.status(401).json(result);
    } else if (result.error.includes('owner')) {
      return res.status(403).json(result);
    } else {
      return res.status(400).json(result);
    }
  }

  return res.json(result);
});

app.post('/v2/admin/quiz/:quizid/question/:questionid/duplicate', (req: Request, res: Response) => {
  return res.json(
    adminQuestionDuplicate(
      parseInt(req.params.quizid),
      parseInt(req.params.questionid),
      req.body.token
    ));
});

app.get('/v2/admin/quiz/:quizid', (req: Request, res: Response) => {
  const token = req.header('token');
  const result = adminQuizInfo(token, parseInt(req.params.quizid));
  return res.json(result);
});

app.post('/v2/admin/auth/logout', (req: Request, res: Response) => {
  const token = req.header('token');
  const result = adminAuthLogout(token);
  return res.json(result);
});

app.post('/v1/admin/quiz/:quizid/session/start', (req: Request, res: Response) => {
  // Extract the token, autoStartNum, quizId
  const token = req.header('token');
  const result = adminQuizSessionStart(token, req.body.autoStartNum, parseInt(req.params.quizid));
  return res.json(result);
});

app.post('/v1/player/:playerId/chat', (req: Request, res: Response) => {
  const result = chatSend(parseInt(req.params.playerId), req.body.messageBody);
  return res.json(result);
});

app.get('/v1/player/:playerId/chat', (req: Request, res: Response) => {
  const result = chatView(parseInt(req.params.playerId));
  return res.json(result);
});

app.put('/v1/admin/quiz/:quizid/session/:sessionid', (req: Request, res: Response) => {
  return res.json(adminQuizSessionUpdate(
    parseInt(req.params.quizid),
    req.params.sessionid,
    req.header('token'),
    req.body.action
  ));
});

app.get('/v1/admin/quiz/:quizid/session/:sessionid', (req: Request, res: Response) => {
  return res.json(adminQuizSessionGet(
    parseInt(req.params.quizid),
    req.params.sessionid,
    req.header('token')
  ));
});

app.post('/v1/player/join', (req: Request, res: Response) => {
  return res.json(playerJoin(req.body.sessionId, req.body.name));
});

app.get('/v1/player/:playerid/question/:questionposition', (req: Request, res: Response) => {
  return res.json(playerQuestionInfo(
    parseInt(req.params.playerid),
    parseInt(req.params.questionposition)
  ));
});

app.put('/v1/player/:playerid/question/:questionposition/answer', (req: Request, res: Response) => {
  return res.json(playerQuestionSubmit(
    parseInt(req.params.playerid),
    parseInt(req.params.questionposition),
    req.body.answerIds
  ));
});

app.get('/v1/player/:playerid/question/:questionposition/results', (req: Request, res: Response) => {
  return res.json(playerQuestionResults(
    parseInt(req.params.playerid),
    parseInt(req.params.questionposition)
  ));
});

app.get('/v1/admin/quiz/:quizid/sessions', (req: Request, res: Response) => {
  const token = req.header('token');
  return res.json(quizSessionList(token, parseInt(req.params.quizid)));
});

app.put('/v1/admin/quiz/:quizid/thumbnail', (req: Request, res: Response) => {
  const token = req.header('token');
  return res.json(adminQuizThumbnailUpdate(token, parseInt(req.params.quizid), req.body.imgUrl));
});

// ====================================================================
//  ================= WORK IS DONE ABOVE THIS LINE ===================
// ====================================================================

fs.writeFileSync('database.json', JSON.stringify(getData()));

app.use((req: Request, res: Response) => {
  const error = `
    404 Not found - This could be because:
      0. You have defined routes below (not above) this middleware in server.ts
      1. You have not implemented the route ${req.method} ${req.path}
      2. There is a typo in either your test or server, e.g. /posts/list in one
         and, incorrectly, /post/list in the other
      3. You are using ts-node (instead of ts-node-dev) to start your server and
         have forgotten to manually restart to load the new changes
      4. You've forgotten a leading slash (/), e.g. you have posts/list instead
         of /posts/list in your server.ts or test file
  `;
  res.status(404).json({ error });
});

// For handling errors
app.use(errorHandler());

// start server
const server = app.listen(PORT, HOST, () => {
  // DO NOT CHANGE THIS LINE
  console.log(`⚡️ Server started on port ${PORT} at ${HOST}`);
});

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});
