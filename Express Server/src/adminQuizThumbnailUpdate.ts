import { findQuiz } from './other';
import { tokenUserId } from './session';
import HttpError from 'http-errors';

export function adminQuizThumbnailUpdate(token: string, quizId: number, imgUrl: string) {
  const user = tokenUserId(token);
  const quiz = findQuiz(quizId);
  if (!(quiz.ownerId === user)) {
    throw HttpError(403, 'User does not own this quiz');
  }

  if (!(imgUrl.startsWith('http://') || imgUrl.startsWith('https://'))) {
    throw HttpError(400, 'Url does not use http or https');
  }

  if (!(imgUrl.endsWith('.jpg') || imgUrl.endsWith('.png') || imgUrl.endsWith('.jpeg'))) {
    throw HttpError(400, 'Image is not a valid file type');
  }

  quiz.thumbnailUrl = imgUrl;
  return {};
}
