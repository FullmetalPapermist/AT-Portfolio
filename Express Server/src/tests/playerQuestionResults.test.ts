import request from 'sync-request-curl';
import { port, url } from '../config.json';
import { requestClear } from '../request';

beforeEach(() => {
  requestClear();
});

export function requestPlayerQuestionResults(playerId: number, questionPosition: number) {
  return request('GET', `${url}:${port}//v1/player/${playerId}/question/${questionPosition}/results`);
}

test('dummmy test', () => {
  expect(1 + 1).toStrictEqual(2);
});
