import { describe, it, expect, beforeEach } from 'vitest';
import { ProceduralQuestionEngine } from '../../data/database/ProceduralQuestionEngine';
import { QuestionValidationService } from '../../data/database/QuestionValidationService';
import { QuestionRepository } from '../../data/repositories/QuestionRepository';
import { ChallengeConfig } from '../../data/models/ChallengeModels';
import { ChallengeEngine } from '../challenge/ChallengeEngine';
import { Question } from '../../data/models/Question';

describe('ProceduralQuestionEngine & QuestionValidationService', () => {
  it('generates well-formed procedural questions across indices', () => {
    for (let i = 0; i < 50; i++) {
      const q = ProceduralQuestionEngine.generate(i);
      expect(q).toBeDefined();
      expect(q.questionId).toBeTruthy();
      expect(q.question.length).toBeGreaterThan(10);
      expect(q.options.length).toBe(4);
      expect(q.options).toContain(q.correctAnswer);
      expect(q.book).toBeTruthy();
      expect(q.chapter).toBeGreaterThan(0);
      expect(q.verse).toBeGreaterThan(0);
      expect(q.explanation.length).toBeGreaterThan(10);
    }
  });

  it('generates deterministic questions for the same index', () => {
    const q1 = ProceduralQuestionEngine.generate(123);
    const q2 = ProceduralQuestionEngine.generate(123);
    expect(q1.questionId).toBe(q2.questionId);
    expect(q1.question).toBe(q2.question);
    expect(q1.correctAnswer).toBe(q2.correctAnswer);
  });

  it('validates good questions successfully and catches corrupted ones', () => {
    const validQ = ProceduralQuestionEngine.generate(1);
    const validation = QuestionValidationService.validateQuestion(validQ);
    expect(validation.isValid).toBe(true);
    expect(validation.errors.length).toBe(0);

    // Corrupted: correctAnswer not in options
    const invalidQ: Question = {
      ...validQ,
      correctAnswer: 'Non-existent answer',
    };
    const invalidValidation = QuestionValidationService.validateQuestion(invalidQ);
    expect(invalidValidation.isValid).toBe(false);
    expect(invalidValidation.errors.some((e) => e.message.includes('options'))).toBe(true);
  });
});

describe('QuestionRepository Uniqueness & Streaming', () => {
  let repo: QuestionRepository;

  beforeEach(() => {
    repo = QuestionRepository.getInstance();
  });

  it('provides a deterministic sequence for identical challenge seeds', async () => {
    const configA: ChallengeConfig = {
      challengeId: 'TEST_SEED_1',
      seed: 'BIBLE_CHALLENGE_A',
      timeLimitSeconds: 60,
      difficulty: 'MIXED',
      isOnline: true,
      totalQuestions: 15,
    };

    const configB: ChallengeConfig = {
      challengeId: 'TEST_SEED_2',
      seed: 'BIBLE_CHALLENGE_A', // Same seed
      timeLimitSeconds: 60,
      difficulty: 'MIXED',
      isOnline: true,
      totalQuestions: 15,
    };

    const questionsA = await repo.getQuestionsForChallenge(configA);
    const questionsB = await repo.getQuestionsForChallenge(configB);

    expect(questionsA.length).toBe(15);
    expect(questionsB.length).toBe(15);

    for (let i = 0; i < 15; i++) {
      expect(questionsA[i].questionId).toBe(questionsB[i].questionId);
      expect(questionsA[i].question).toBe(questionsB[i].question);
    }
  });

  it('never has duplicate question IDs within a generated challenge', async () => {
    const config: ChallengeConfig = {
      challengeId: 'TEST_UNIQUE',
      seed: 'UNIQUE_TEST_SEED_99',
      timeLimitSeconds: 180,
      difficulty: 'MIXED',
      isOnline: false,
      totalQuestions: 40,
    };

    const questions = await repo.getQuestionsForChallenge(config);
    expect(questions.length).toBe(40);

    const seenIds = new Set<string>();
    for (const q of questions) {
      expect(seenIds.has(q.questionId)).toBe(false);
      seenIds.add(q.questionId);
    }
  });

  it('getStreamQuestion generates subsequent unique questions without repeating used IDs', () => {
    const used = new Set<string>();
    const trackedIds = new Set<string>();
    const config: ChallengeConfig = {
      challengeId: 'STREAM_TEST',
      seed: 'STREAM_SEED_123',
      timeLimitSeconds: 180,
      difficulty: 'MIXED',
      isOnline: true,
      totalQuestions: 0,
    };

    const streamedQuestions: Question[] = [];
    for (let i = 1; i <= 30; i++) {
      const q = repo.getStreamQuestion(i, config, used);
      // Verify question was never returned previously
      expect(trackedIds.has(q.questionId)).toBe(false);
      trackedIds.add(q.questionId);
      streamedQuestions.push(q);
    }

    expect(streamedQuestions.length).toBe(30);
    expect(new Set(streamedQuestions.map((q) => q.questionId)).size).toBe(30);
  });
});

describe('ChallengeEngine Dynamic Question Streaming', () => {
  it('streams questions dynamically when reaching the end of the initial batch', () => {
    const repo = QuestionRepository.getInstance();
    const config: ChallengeConfig = {
      challengeId: 'ENGINE_STREAM_TEST',
      seed: 'ENGINE_SEED_456',
      timeLimitSeconds: 60,
      difficulty: 'MIXED',
      isOnline: true,
      totalQuestions: 2,
    };

    const usedIds = new Set<string>();
    const q1 = repo.getStreamQuestion(1, config, usedIds);
    usedIds.add(q1.questionId);
    const q2 = repo.getStreamQuestion(2, config, usedIds);
    usedIds.add(q2.questionId);

    const initialQuestions = [q1, q2];

    const receivedQuestions: Question[] = [];
    let completedResult: any = null;

    const engine = new ChallengeEngine(
      config,
      initialQuestions,
      'TestPlayer',
      {
        onQuestionChanged: (q) => {
          receivedQuestions.push(q);
        },
        onTimerTick: () => {},
        onAnswerFeedback: () => {},
        onChallengeComplete: (res) => {
          completedResult = res;
        },
      },
      (idx) => {
        const nextQ = repo.getStreamQuestion(idx, config, usedIds);
        usedIds.add(nextQ.questionId);
        return nextQ;
      }
    );

    engine.start();

    // First question presented
    expect(receivedQuestions.length).toBe(1);
    expect(receivedQuestions[0].questionId).toBe(q1.questionId);

    // Answer Q1
    const res1 = engine.submitAnswer(q1.correctAnswer);
    expect(res1?.isCorrect).toBe(true);

    // Answer Q2
    const res2 = engine.submitAnswer(q2.correctAnswer);
    expect(res2?.isCorrect).toBe(true);

    engine.cancel();
  });
});
