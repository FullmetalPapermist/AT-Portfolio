// YOU SHOULD MODIFY THIS OBJECT BELOW

export interface Message {
  messageBody: string;
  playerId: number;
  playerName: string;
  timeSent: number;
}

export interface Session {
  token: string;
  userId: number;
}

export enum ACTION {
  NEXT_QUESTION = 'NEXT_QUESTION',
  SKIP_COUNTDOWN = 'SKIP_COUNTDOWN',
  GO_TO_ANSWER = 'GO_TO_ANSWER',
  GO_TO_FINAL_RESULTS = 'GO_TO_FINAL_RESULTS',
  END = 'END',
}

export enum Colour {
  red = 'red',
  blue = 'blue',
  green = 'green',
  yellow = 'yellow',
  purple = 'purple',
  brown = 'brown',
  orange = 'orange',
}

export enum STATE {
  LOBBY = 'lobby',
  QUESTION_COUNTDOWN = 'question_countdown',
  QUESTION_OPEN = 'question_open',
  QUESTION_CLOSE = 'question_close',
  ANSWER_SHOWER = 'answer_show',
  FINAL_RESULTS = 'final_results',
  END = 'end',
}

// Need to confirm if this is valid type script for an array of strings
export interface User {
  userId: number;
  password: string;
  prevPasswords: string[];
  email: string;
  firstName: string;
  lastName: string;
  timeCreated: number;
  numFailedPasswordsSinceLastLogin: number;
  numSuccessfulLogins: number;
}

export interface Answer {
  answer: string;
  correct: boolean;
}

export interface ColouredAnswer {
  answer: string;
  correct: boolean;
  colour: Colour;
  answerId: number;
}

export interface Player {
  playerId: number;
  playerName: string;
  playerPoints: number;
  quizSessionId: string;
  currentAnswers: Answer[];
  answerTime: number;
}

export interface Question {
  question: string;
  duration: number;
  points: number;
  answers: ColouredAnswer[];
  questionId: number;
  thumbnailUrl: string;
}

export interface QuestionResult {
  questionId: number;
  playersCorrectList: Player[];
  averageAnswerTime: number;
  percentCorrect: number;
}

export interface QuizSession {
  sessionId: string;
  questionPosition: number;
  state: STATE;
  autoStartNum: number;
  players: Player[];
  ownerId: number;
  metadata: Quiz;
  questionResults: QuestionResult[];
  questionStart: number;
  messages: Message[];
}

export interface Quiz {
  quizId: number;
  quizTitle: string;
  quizDescription: string;
  questions: Question[];
  timeCreated: number;
  timeLastEdited: number;
  ownerId: number;
  thumbnailUrl: string;
  duration: number;
}

export interface DataStore {
  users: User[];
  nextUserId: number;
  quizzes: Quiz[];
  trash: Quiz[];
  sessions: Session[];
  quizSessions: QuizSession[];
  nextQuizId: number;
  nextQuestionId: number;
  nextQuizSession: number;
  nextPlayerId: 0;
  nextAnswerId: 0;
}

export function createDataStore(): DataStore {
  return {
    users: [],
    nextUserId: 0,
    quizzes: [],
    trash: [],
    sessions: [],
    quizSessions: [],
    nextQuizId: 0,
    nextQuestionId: 0,
    nextQuizSession: 0,
    nextPlayerId: 0,
    nextAnswerId: 0,
  };
}

let data = createDataStore();

// YOU SHOULDNT NEED TO MODIFY THE FUNCTIONS BELOW IN ITERATION 1

/*
Example usage
    let store = getData()
    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Rando'] }

    names = store.names

    names.pop()
    names.push('Jake')

    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Jake'] }
    setData(store)
*/

export interface Error {
  error: string;
}

// Use get() to access the data
export function getData(): DataStore {
  return data;
}

// Use set(newData) to pass in the entire data object, with modifications made
export function setData(newData: DataStore) {
  data = newData;
}
