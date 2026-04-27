import { requestClear, createStandardQuizSession, requestQuizThumbnailUpdate, requestAuthRegister } from '../request';

beforeEach(() => {
  requestClear();
});

describe('adminQuizThumbnailUpdate', () => {
  test.each(['.jpg', '.jpeg', '.png'])('Successfully updatedThumbnail', (fileType) => {
    const quiz = createStandardQuizSession();
    const result = requestQuizThumbnailUpdate(quiz.token, quiz.quizId, `http://google.com/some/meme${fileType}`);
    expect(result.statusCode).toBe(200);
  });

  test('Successful on a HTTPS site', () => {
    const quiz = createStandardQuizSession();
    const result = requestQuizThumbnailUpdate(quiz.token, quiz.quizId, 'https://google.com/some/meme.jpg');
    expect(result.statusCode).toBe(200);
  });

  test('Error: Url is not a valid file type', () => {
    const quiz = createStandardQuizSession();
    const result = requestQuizThumbnailUpdate(quiz.token, quiz.quizId, 'http://google.com/some/meme.exe');
    expect(result.statusCode).toBe(400);
  });

  test('Error: Url is not a valid http protocol', () => {
    const quiz = createStandardQuizSession();
    const result = requestQuizThumbnailUpdate(quiz.token, quiz.quizId, 'htt://google.com/some/meme.jpg');
    expect(result.statusCode).toBe(400);
  });

  test('Error: Token is invalid', () => {
    const quiz = createStandardQuizSession();
    const result = requestQuizThumbnailUpdate('fake token', quiz.quizId, 'htt://google.com/some/meme.jpg');
    expect(result.statusCode).toBe(401);
  });

  test('Error: User does not own this quiz', () => {
    const quiz = createStandardQuizSession();
    const user2 = JSON.parse(requestAuthRegister('myemail@email.com', 'password1', 'Phillip', 'Gattwick').getBody());
    const result = requestQuizThumbnailUpdate(user2.token, quiz.quizId, 'htt://google.com/some/meme.jpg');
    expect(result.statusCode).toBe(403);
  });
});
