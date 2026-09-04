import { ChallengeConfig, ChallengeResult, AnswerReviewItem, AnswerSubmissionEvent } from '../../data/models/ChallengeModels';
import { Question } from '../../data/models/Question';
import { CrossPlatformTimer, TimerState } from '../timer/CrossPlatformTimer';
import { ScoringEngine } from '../scoring/ScoringEngine';
import { QuestionScoreResult } from '../types';
import { ServerScoringValidator } from './ServerScoringValidator';

export interface ChallengeEngineEvents {
  onQuestionChanged: (question: Question, index: number, total: number) => void;
  onTimerTick: (state: TimerState) => void;
  onAnswerFeedback: (result: QuestionScoreResult, isSpeedBonus: boolean) => void;
  onChallengeComplete: (result: ChallengeResult) => void;
}

export class ChallengeEngine {
  public readonly config: ChallengeConfig;
  private readonly questions: Question[];
  private readonly timer: CrossPlatformTimer;
  private readonly validator: ServerScoringValidator;
  private readonly events: ChallengeEngineEvents;
  private readonly playerName: string;

  private currentIndex: number = 0;
  private questionStartTime: number = 0;
  private answerReviews: AnswerReviewItem[] = [];
  private isFinished: boolean = false;

  constructor(
    config: ChallengeConfig,
    questions: Question[],
    playerName: string,
    events: ChallengeEngineEvents
  ) {
    this.config = config;
    this.questions = questions;
    this.playerName = playerName;
    this.events = events;

    const now = Date.now();
    const end = now + config.timeLimitSeconds * 1000;
    this.validator = new ServerScoringValidator(config.challengeId, now, end, questions);
    this.timer = new CrossPlatformTimer(config.timeLimitSeconds);
  }

  public start() {
    this.currentIndex = 0;
    this.answerReviews = [];
    this.isFinished = false;

    this.timer.start(
      (timerState) => {
        this.events.onTimerTick(timerState);
      },
      () => {
        this.finishChallenge();
      }
    );

    this.presentCurrentQuestion();
  }

  private presentCurrentQuestion() {
    if (this.currentIndex >= this.questions.length) {
      this.finishChallenge();
      return;
    }

    this.questionStartTime = performance.now();
    const currentQ = this.questions[this.currentIndex];
    this.events.onQuestionChanged(currentQ, this.currentIndex, this.questions.length);
  }

  public submitAnswer(selectedOption: string): QuestionScoreResult | null {
    if (this.isFinished || this.currentIndex >= this.questions.length) return null;

    const currentQ = this.questions[this.currentIndex];
    const now = performance.now();
    const responseTimeMs = Math.max(50, Math.round(now - this.questionStartTime));
    const responseSeconds = responseTimeMs / 1000.0;

    const event: AnswerSubmissionEvent = {
      eventId: `${this.config.challengeId}-${this.currentIndex}-${Date.now()}`,
      challengeId: this.config.challengeId,
      questionId: currentQ.questionId,
      sequencePosition: this.currentIndex,
      selectedAnswer: selectedOption,
      responseTimeMs,
      clientTimestamp: Date.now(),
    };

    const validation = this.validator.validateAndScore(event);
    let scoreResult: QuestionScoreResult;

    if (validation.status === 'VALID') {
      scoreResult = validation.scoreResult;
    } else {
      scoreResult = {
        isCorrect: false,
        baseScore: 0,
        rawSpeedBonus: 0,
        comboMultiplier: 1.0,
        adjustedSpeedBonus: 0,
        totalQuestionScore: 0,
        currentCombo: 0,
        bestCombo: this.validator.bestCombo,
        feedbackType: 'COMBO_BREAK',
        message: 'INVALID',
      };
    }

    const review: AnswerReviewItem = {
      questionNumber: this.currentIndex + 1,
      questionText: currentQ.question,
      options: currentQ.options,
      selectedAnswer: selectedOption,
      correctAnswer: currentQ.correctAnswer,
      isCorrect: Boolean(scoreResult.isCorrect),
      responseTimeSeconds: responseSeconds,
      pointsEarned: scoreResult.totalQuestionScore,
      scriptureReference: `${currentQ.book} ${currentQ.chapter}:${currentQ.verse}`,
      explanation: currentQ.explanation,
      isVisual: Boolean(currentQ.imageUrl || currentQ.questionType === 'IMAGE'),
      imageUrl: currentQ.imageUrl,
    };
    this.answerReviews.push(review);

    const isSpeedBonus = scoreResult.adjustedSpeedBonus > 0;
    this.events.onAnswerFeedback(scoreResult, isSpeedBonus);

    this.currentIndex += 1;
    // Advance to next question
    if (this.currentIndex < this.questions.length) {
      setTimeout(() => {
        if (!this.isFinished) {
          this.presentCurrentQuestion();
        }
      }, 350);
    } else {
      setTimeout(() => {
        this.finishChallenge();
      }, 350);
    }

    return scoreResult;
  }

  public finishChallenge() {
    if (this.isFinished) return;
    this.isFinished = true;
    this.timer.stop();

    const result: ChallengeResult = {
      resultId: `res-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      challengeId: this.config.challengeId,
      seed: this.config.seed,
      playerName: this.playerName,
      finalScore: this.validator.verifiedScore,
      questionsAnswered: this.validator.totalAnswered,
      correctAnswers: this.validator.correctCount,
      incorrectAnswers: this.validator.totalAnswered - this.validator.correctCount,
      accuracyPercentage: this.validator.accuracyPercentage,
      fastAnswersCount: this.validator.fastAnswersCount,
      bestCombo: this.validator.bestCombo,
      averageResponseTimeSeconds: this.validator.averageResponseTimeSeconds,
      durationSeconds: this.config.timeLimitSeconds,
      difficulty: this.config.difficulty,
      timestamp: Date.now(),
      isOnline: this.config.isOnline,
      answerReviews: this.answerReviews,
    };

    this.events.onChallengeComplete(result);
  }

  public cancel() {
    this.isFinished = true;
    this.timer.stop();
  }
}
