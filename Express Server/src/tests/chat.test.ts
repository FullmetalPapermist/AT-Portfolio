import { requestClear, requestPlayerJoin, requestChatSend, requestChatView, createStandardQuizSession } from '../request';

beforeEach(() => {
  requestClear();
});

describe('chatSend and chatView tests', () => {
  test('Successful chat send and chat view', () => {
    const obj = createStandardQuizSession();
    const sessionId = obj.sessionId;
    const player1 = JSON.parse(requestPlayerJoin(sessionId, 'Gary').body as string).playerId;
    const player2 = JSON.parse(requestPlayerJoin(sessionId, 'Robert').body as string).playerId;
    const message1 = JSON.parse(requestChatSend(player1, 'Test Message').body as string);
    expect(message1).toStrictEqual({});
    requestChatSend(player2, 'Testing');
    const messages = JSON.parse(requestChatView(player1).body as string);
    expect(messages).toStrictEqual({
      messages: [{
        messageBody: 'Test Message',
        playerId: player1,
        playerName: 'Gary',
        timeSent: expect.any(Number)
      },
      {
        messageBody: 'Testing',
        playerId: player2,
        playerName: 'Robert',
        timeSent: expect.any(Number)
      }]
    });
    const time = Math.floor(Date.now() / 100);
    expect(Math.abs(Math.floor(messages.messages[0].timeSent / 100) - time) <= 1).toStrictEqual(true);
  });

  test('Test chat message with bad playerId', () => {
    const obj = createStandardQuizSession();
    const sessionId = obj.sessionId;
    const player1 = JSON.parse(requestPlayerJoin(sessionId, 'Gary').body as string).playerId;
    const message1 = requestChatSend(player1 + 1, 'Test Message');
    expect(message1.statusCode).toBe(400);
  });

  test('Test chat message with low and high character counts', () => {
    const obj = createStandardQuizSession();
    const sessionId = obj.sessionId;
    const player1 = JSON.parse(requestPlayerJoin(sessionId, 'Gary').body as string).playerId;
    const message1 = requestChatSend(player1, '');
    expect(message1.statusCode).toBe(400);
    const message2 = requestChatSend(player1, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    expect(message2.statusCode).toBe(400);
  });

  test('Test view messages with bad playerId', () => {
    const obj = createStandardQuizSession();
    const sessionId = obj.sessionId;
    const player1 = JSON.parse(requestPlayerJoin(sessionId, 'Gary').body as string).playerId;
    requestChatSend(player1, 'Test Message');
    const messages = requestChatView(player1 + 1);
    expect(messages.statusCode).toBe(400);
  });

  test('Test empty viewmessages', () => {
    const obj = createStandardQuizSession();
    const sessionId = obj.sessionId;
    const player1 = JSON.parse(requestPlayerJoin(sessionId, 'Gary').body as string).playerId;
    const messages = JSON.parse(requestChatView(player1).body as string);
    expect(messages).toStrictEqual({
      messages: []
    });
  });
});
