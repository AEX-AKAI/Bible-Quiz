import { Question } from '../../data/models/Question';
import { AnswerSubmissionEvent } from '../../data/models/ChallengeModels';
import { QuestionScoreResult } from '../types';
import { ScoringEngine } from '../scoring/ScoringEngine';

export type AntiCheatViolation = 
  | 'CHALLENGE_EXPIRED'
  | 'DUPLICATE_QUESTION_SUBMISSION'
  | 'SEQUENCE_MISMATCH'
  | 'INVALID_QUESTION_ID'
  | 'IMPOSSIBLE_RESPONSE_TIME'
  | 'REPLAY_DETECTED';

export type AnswerValidationResult = 
  | { status: 'VALID'; scoreResult: QuestionScoreResult }
  | { status: 'REJECTED'; reason: AntiCheatViolation };

export class ServerScoringValidator {
  public readonly challengeId: string;
  public readonly startTimeMillis: number;
  public readonly endTimeMillis: number;
  private readonly officialSequence: Question[];

  private answeredQuestionIds: Set<string> = new Set();
  private processedEventIds: Set<string> = new Set();
  private responseTimes: number[] = [];

  public verifiedScore: number = 0.0;
  public currentCombo: number = 0;
  public bestCombo: number = 0;
  public totalAnswered: number = 0;
  public correctCount: number = 0;
  public fastAnswersCount: number = 0;

  constructor(
    challengeId: string,
    startTimeMillis: number,
    endTimeMillis: number,
    officialSequence: Question[]
  ) {
    this.challengeId = challengeId;
    this.startTimeMillis = startTimeMillis;
    this.endTimeMillis = endTimeMillis;
    this.officialSequence = officialSequence;
  }

  public validateAndScore(
    event: AnswerSubmissionEvent,
    serverTimestamp: number = Date.now()
  ): AnswerValidationResult {
    // 1. Replay attack check
    if (this.processedEventIds.has(event.eventId)) {
      return { status: 'REJECTED', reason: 'REPLAY_DETECTED' };
    }
    this.processedEventIds.add(event.eventId);

    // 2. Challenge expiration check
    if (serverTimestamp > this.endTimeMillis + 2000) { // 2s grace for network transit
      return { status: 'REJECTED', reason: 'CHALLENGE_EXPIRED' };
    }

    // 3. Duplicate question check
    if (this.answeredQuestionIds.has(event.questionId)) {
      return { status: 'REJECTED', reason: 'DUPLICATE_QUESTION_SUBMISSION' };
    }

    // 4. Sequence mismatch check
    if (event.sequencePosition < 0 || event.sequencePosition >= this.officialSequence.length) {
      return { status: 'REJECTED', reason: 'SEQUENCE_MISMATCH' };
    }
    const expected = this.officialSequence[event.sequencePosition];
    if (expected.questionId !== event.questionId) {
      return { status: 'REJECTED', reason: 'SEQUENCE_MISMATCH' };
    }

    // 5. Impossible reflex time (< 50ms)
    if (event.responseTimeMs < 50) {
      return { status: 'REJECTED', reason: 'IMPOSSIBLE_RESPONSE_TIME' };
    }

    this.answeredQuestionIds.add(event.questionId);
    this.totalAnswered += 1;

    const responseSeconds = event.responseTimeMs / 1000.0;
    this.responseTimes.push(responseSeconds);

    const isCorrect = event.selectedAnswer === expected.correctAnswer;
    const scoreResult = ScoringEngine.scoreAnswer(
      isCorrect,
      responseSeconds,
      this.currentCombo,
      this.bestCombo
    );

    this.verifiedScore = ScoringEngine.roundToOneDecimal(this.verifiedScore + scoreResult.totalQuestionScore);
    this.currentCombo = scoreResult.currentCombo;
    this.bestCombo = scoreResult.bestCombo;

    if (isCorrect) {
      this.correctCount += 1;
      if (responseSeconds <= ScoringEngine.SPEED_WINDOW_SECONDS) {
        this.fastAnswersCount += 1;
      }
    }

    return { status: 'VALID', scoreResult };
  }

  public get averageResponseTimeSeconds(): number {
    if (this.responseTimes.length === 0) return 0.0;
    const sum = this.responseTimes.reduce((a, b) => a + b, 0);
    return ScoringEngine.roundToOneDecimal(sum / this.responseTimes.length);
  }

  public get accuracyPercentage(): number {
    if (this.totalAnswered === 0) return 0.0;
    return ScoringEngine.roundToOneDecimal((this.correctCount / this.totalAnswered) * 100.0);
  }
}
