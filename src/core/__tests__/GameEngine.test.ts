import { describe, it, expect } from 'vitest';
import { ScoringEngine } from '../scoring/ScoringEngine';
import { ProgressiveDifficultyEngine } from '../difficulty/ProgressiveDifficultyEngine';
import { SeedPrng } from '../challenge/SeedPrng';
import { ServerScoringValidator } from '../challenge/ServerScoringValidator';
import { Question } from '../../data/models/Question';
import { AnswerSubmissionEvent } from '../../data/models/ChallengeModels';

describe('Shared Game Engine: ScoringEngine', () => {
  it('awards 10 base points for correct answers', () => {
    const result = ScoringEngine.scoreAnswer(true, 5.5, 0, 0, 180);
    expect(result.isCorrect).toBe(true);
    expect(result.baseScore).toBe(10.0);
    expect(result.rawSpeedBonus).toBe(0.0);
    expect(result.totalQuestionScore).toBe(10.0);
    expect(result.currentCombo).toBe(0); // reset after 5s
  });

  it('calculates speed bonus within 5.0s window', () => {
    // 0.8s on 30s mode (max speed bonus 5.0)
    const result30 = ScoringEngine.scoreAnswer(true, 0.8, 0, 0, 30);
    expect(result30.rawSpeedBonus).toBe(5.0);
    expect(result30.totalQuestionScore).toBe(15.0);
    expect(result30.currentCombo).toBe(1);

    // 0.8s on 180s mode (max speed bonus 10.0)
    const result180 = ScoringEngine.scoreAnswer(true, 0.8, 0, 0, 180);
    expect(result180.rawSpeedBonus).toBe(10.0);
    expect(result180.totalQuestionScore).toBe(20.0);
  });

  it('applies combo multiplier only to speed bonus', () => {
    // With 5 combo (1.1x multiplier)
    const result = ScoringEngine.scoreAnswer(true, 0.8, 4, 4, 30);
    expect(result.currentCombo).toBe(5);
    expect(result.comboMultiplier).toBe(1.1);
    expect(result.adjustedSpeedBonus).toBe(5.5); // 5.0 * 1.1 = 5.5
    expect(result.totalQuestionScore).toBe(15.5); // 10 + 5.5 = 15.5
  });

  it('resets combo and awards 0 points on incorrect answer', () => {
    const result = ScoringEngine.scoreAnswer(false, 0.5, 8, 8, 180);
    expect(result.isCorrect).toBe(false);
    expect(result.totalQuestionScore).toBe(0.0);
    expect(result.currentCombo).toBe(0);
    expect(result.bestCombo).toBe(8);
  });
});

describe('Shared Game Engine: ProgressiveDifficultyEngine', () => {
  it('correctly maps 1-based question number to difficulty stages', () => {
    expect(ProgressiveDifficultyEngine.calculateDifficulty(1)).toBe('EASY');
    expect(ProgressiveDifficultyEngine.calculateDifficulty(5)).toBe('EASY');
    expect(ProgressiveDifficultyEngine.calculateDifficulty(6)).toBe('EASY_MEDIUM');
    expect(ProgressiveDifficultyEngine.calculateDifficulty(10)).toBe('EASY_MEDIUM');
    expect(ProgressiveDifficultyEngine.calculateDifficulty(11)).toBe('MEDIUM');
    expect(ProgressiveDifficultyEngine.calculateDifficulty(16)).toBe('MEDIUM_HARD');
    expect(ProgressiveDifficultyEngine.calculateDifficulty(21)).toBe('HARD');
    expect(ProgressiveDifficultyEngine.calculateDifficulty(26)).toBe('HARD_EXPERT');
    expect(ProgressiveDifficultyEngine.calculateDifficulty(31)).toBe('EXPERT');
    expect(ProgressiveDifficultyEngine.calculateDifficulty(50)).toBe('EXPERT');
  });
});

describe('Shared Game Engine: SeedPrng Cross-Platform Determinism', () => {
  it('generates identical sequences for identical seeds across runs', () => {
    const prngA = new SeedPrng('ABC123');
    const prngB = new SeedPrng('ABC123');

    for (let i = 0; i < 20; i++) {
      expect(prngA.next()).toBe(prngB.next());
      expect(prngA.nextInt(1, 100)).toBe(prngB.nextInt(1, 100));
    }

    const items = ['Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy'];
    expect(prngA.shuffle(items)).toEqual(prngB.shuffle(items));
  });
});

describe('Shared Game Engine: ServerScoringValidator Anti-Cheat', () => {
  const dummyQuestions: Question[] = [
    {
      questionId: 'Q1',
      question: 'Test Q1',
      options: ['A', 'B'],
      correctAnswer: 'A',
      book: 'Gen',
      chapter: 1,
      verse: 1,
      category: 'Test',
      difficulty: 'EASY',
      explanation: 'None',
      questionType: 'TEXT',
    },
  ];

  it('rejects impossible reflex time (< 50ms)', () => {
    const validator = new ServerScoringValidator(
      'CH1',
      Date.now(),
      Date.now() + 60000,
      dummyQuestions
    );

    const event: AnswerSubmissionEvent = {
      eventId: 'evt1',
      challengeId: 'CH1',
      questionId: 'Q1',
      sequencePosition: 0,
      selectedAnswer: 'A',
      responseTimeMs: 20, // Impossible < 50ms
      clientTimestamp: Date.now(),
    };

    const result = validator.validateAndScore(event);
    expect(result.status).toBe('REJECTED');
    if (result.status === 'REJECTED') {
      expect(result.reason).toBe('IMPOSSIBLE_RESPONSE_TIME');
    }
  });

  it('rejects duplicate question submissions and replay attacks', () => {
    const validator = new ServerScoringValidator(
      'CH1',
      Date.now(),
      Date.now() + 60000,
      dummyQuestions
    );

    const event1: AnswerSubmissionEvent = {
      eventId: 'evt1',
      challengeId: 'CH1',
      questionId: 'Q1',
      sequencePosition: 0,
      selectedAnswer: 'A',
      responseTimeMs: 1200,
      clientTimestamp: Date.now(),
    };

    const result1 = validator.validateAndScore(event1);
    expect(result1.status).toBe('VALID');

    // Replay attack with same eventId
    const result2 = validator.validateAndScore(event1);
    expect(result2.status).toBe('REJECTED');
    if (result2.status === 'REJECTED') {
      expect(result2.reason).toBe('REPLAY_DETECTED');
    }
  });
});
