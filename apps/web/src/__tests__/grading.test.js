import { gradeAttempt } from '../../../../../apps/server/src/services/grading.js';

describe('gradeAttempt', () => {
  it('grades MCQ correctly', async () => {
    const quiz = { questions: [{ type: 'MCQ', answer: 'A' }] };
    const responses = ['A'];
    const { scorePct } = await gradeAttempt(quiz, responses);
    expect(scorePct).toBe(100);
  });
});
