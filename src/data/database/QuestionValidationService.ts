import { Question } from '../models/Question';
import { QuestionDifficultyStage, ReadingComplexity } from '../../core/types';

export interface QuestionValidationError {
  field: string;
  message: string;
}

export interface QuestionValidationResult {
  isValid: boolean;
  errors: QuestionValidationError[];
}

export interface DuplicateDetectionResult {
  isDuplicate: boolean;
  duplicateType?: 'EXACT_ID' | 'EXACT_TEXT' | 'NORMALIZED_TEXT' | 'NEAR_DUPLICATE';
  matchedQuestionId?: string;
  matchedQuestionText?: string;
  similarityScore?: number;
}

const VALID_DIFFICULTIES: Set<QuestionDifficultyStage> = new Set([
  'EASY',
  'EASY_MEDIUM',
  'MEDIUM',
  'MEDIUM_HARD',
  'HARD',
  'HARD_EXPERT',
  'EXPERT',
]);

const VALID_COMPLEXITIES: Set<ReadingComplexity> = new Set([
  'VERY_SHORT',
  'SHORT',
  'NORMAL',
  'LONG',
  'ADVANCED',
]);

export class QuestionValidationService {
  /**
   * Normalizes question text for duplicate detection:
   * lowercases, removes all punctuation, strips extra whitespace.
   */
  public static normalizeQuestionText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // remove punctuation
      .replace(/\s+/g, ' ') // collapse multi-spaces
      .trim();
  }

  /**
   * Computes word-level Jaccard similarity coefficient between two strings (0.0 to 1.0).
   */
  public static calculateTextSimilarity(textA: string, textB: string): number {
    const normA = this.normalizeQuestionText(textA);
    const normB = this.normalizeQuestionText(textB);
    if (normA === normB) return 1.0;

    const wordsA = new Set(normA.split(' ').filter((w) => w.length > 2));
    const wordsB = new Set(normB.split(' ').filter((w) => w.length > 2));

    if (wordsA.size === 0 || wordsB.size === 0) return 0.0;

    let intersectionCount = 0;
    wordsA.forEach((w) => {
      if (wordsB.has(w)) intersectionCount++;
    });

    const unionCount = new Set([...wordsA, ...wordsB]).size;
    return unionCount > 0 ? intersectionCount / unionCount : 0;
  }

  /**
   * Comprehensive validation of a question object.
   */
  public static validateQuestion(candidate: any): QuestionValidationResult {
    const errors: QuestionValidationError[] = [];

    if (!candidate || typeof candidate !== 'object') {
      return {
        isValid: false,
        errors: [{ field: 'root', message: 'Candidate must be a valid JSON object' }],
      };
    }

    // 1. Question ID
    if (!candidate.questionId || typeof candidate.questionId !== 'string' || candidate.questionId.trim() === '') {
      errors.push({ field: 'questionId', message: 'Question ID is required and must be non-empty' });
    }

    // 2. Question Text
    if (!candidate.question || typeof candidate.question !== 'string' || candidate.question.trim().length < 8) {
      errors.push({ field: 'question', message: 'Question text must be at least 8 characters long' });
    }

    // 3. Options
    if (!Array.isArray(candidate.options) || candidate.options.length !== 4) {
      errors.push({ field: 'options', message: 'Question must have exactly 4 options' });
    } else {
      const uniqueOptions = new Set(candidate.options.map((o: any) => String(o).trim()));
      if (uniqueOptions.size !== 4) {
        errors.push({ field: 'options', message: 'All 4 options must be distinct' });
      }
      candidate.options.forEach((opt: any, idx: number) => {
        if (!opt || typeof opt !== 'string' || opt.trim() === '') {
          errors.push({ field: `options[${idx}]`, message: `Option ${idx + 1} must not be empty` });
        }
      });
    }

    // 4. Correct Answer
    if (!candidate.correctAnswer || typeof candidate.correctAnswer !== 'string' || candidate.correctAnswer.trim() === '') {
      errors.push({ field: 'correctAnswer', message: 'Correct answer is required' });
    } else if (Array.isArray(candidate.options) && !candidate.options.includes(candidate.correctAnswer)) {
      errors.push({
        field: 'correctAnswer',
        message: 'Correct answer must exactly match one of the provided options',
      });
    }

    // 5. Difficulty
    if (candidate.difficulty && !VALID_DIFFICULTIES.has(candidate.difficulty)) {
      errors.push({
        field: 'difficulty',
        message: `Invalid difficulty "${candidate.difficulty}". Must be one of: ${Array.from(VALID_DIFFICULTIES).join(', ')}`,
      });
    }

    // 6. Category
    if (!candidate.category || typeof candidate.category !== 'string' || candidate.category.trim() === '') {
      errors.push({ field: 'category', message: 'Category is required' });
    }

    // 7. Reading Complexity (optional, but validated if present)
    if (candidate.readingComplexity && !VALID_COMPLEXITIES.has(candidate.readingComplexity)) {
      errors.push({
        field: 'readingComplexity',
        message: `Invalid reading complexity. Allowed: ${Array.from(VALID_COMPLEXITIES).join(', ')}`,
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Detects duplicate against an existing question bank.
   */
  public static checkDuplicate(
    candidate: Question,
    existingBank: Question[]
  ): DuplicateDetectionResult {
    const candidateNorm = this.normalizeQuestionText(candidate.question);

    for (const existing of existingBank) {
      // 1. Exact ID match
      if (existing.questionId === candidate.questionId) {
        return {
          isDuplicate: true,
          duplicateType: 'EXACT_ID',
          matchedQuestionId: existing.questionId,
          matchedQuestionText: existing.question,
        };
      }

      // 2. Exact Question text match
      if (existing.question.trim().toLowerCase() === candidate.question.trim().toLowerCase()) {
        return {
          isDuplicate: true,
          duplicateType: 'EXACT_TEXT',
          matchedQuestionId: existing.questionId,
          matchedQuestionText: existing.question,
        };
      }

      // 3. Normalized Question text match
      const existingNorm = this.normalizeQuestionText(existing.question);
      if (candidateNorm === existingNorm) {
        return {
          isDuplicate: true,
          duplicateType: 'NORMALIZED_TEXT',
          matchedQuestionId: existing.questionId,
          matchedQuestionText: existing.question,
        };
      }

      // 4. Near-duplicate similarity check (> 0.85 token overlap with same correct answer)
      const similarity = this.calculateTextSimilarity(candidate.question, existing.question);
      if (similarity >= 0.85 && candidate.correctAnswer.toLowerCase() === existing.correctAnswer.toLowerCase()) {
        return {
          isDuplicate: true,
          duplicateType: 'NEAR_DUPLICATE',
          matchedQuestionId: existing.questionId,
          matchedQuestionText: existing.question,
          similarityScore: similarity,
        };
      }
    }

    return { isDuplicate: false };
  }

  /**
   * Imports a batch of questions from raw JSON with validation & duplicate detection.
   */
  public static importQuestionBatch(
    rawJson: string,
    existingBank: Question[]
  ): {
    imported: Question[];
    rejected: { item: any; errors: string[] }[];
    duplicates: { item: any; duplicateReason: string }[];
  } {
    let parsed: any[];
    try {
      const data = JSON.parse(rawJson);
      parsed = Array.isArray(data) ? data : [data];
    } catch (e: any) {
      return {
        imported: [],
        rejected: [{ item: rawJson, errors: [`JSON Parse Error: ${e.message}`] }],
        duplicates: [],
      };
    }

    const imported: Question[] = [];
    const rejected: { item: any; errors: string[] }[] = [];
    const duplicates: { item: any; duplicateReason: string }[] = [];

    const activeBank = [...existingBank];

    for (const rawItem of parsed) {
      const validation = this.validateQuestion(rawItem);
      if (!validation.isValid) {
        rejected.push({
          item: rawItem,
          errors: validation.errors.map((e) => `${e.field}: ${e.message}`),
        });
        continue;
      }

      const questionCandidate: Question = {
        questionId: String(rawItem.questionId).trim(),
        question: String(rawItem.question).trim(),
        options: rawItem.options.map((o: any) => String(o).trim()),
        correctAnswer: String(rawItem.correctAnswer).trim(),
        book: rawItem.book ? String(rawItem.book).trim() : 'Scripture',
        chapter: parseInt(rawItem.chapter, 10) || 1,
        verse: parseInt(rawItem.verse, 10) || 1,
        category: String(rawItem.category).trim(),
        difficulty: rawItem.difficulty || 'MEDIUM',
        readingComplexity: rawItem.readingComplexity || 'NORMAL',
        explanation: rawItem.explanation ? String(rawItem.explanation).trim() : '',
        questionType: rawItem.questionType || 'TEXT',
        imageUrl: rawItem.imageUrl,
        imageId: rawItem.imageId,
      };

      const dup = this.checkDuplicate(questionCandidate, activeBank);
      if (dup.isDuplicate) {
        duplicates.push({
          item: questionCandidate,
          duplicateReason: `${dup.duplicateType} (Matches ${dup.matchedQuestionId})`,
        });
        continue;
      }

      imported.push(questionCandidate);
      activeBank.push(questionCandidate);
    }

    return { imported, rejected, duplicates };
  }
}
