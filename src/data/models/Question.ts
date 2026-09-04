import { QuestionDifficultyStage, QuestionType, ReadingComplexity } from '../../core/types';

export interface Question {
  questionId: string;
  question: string;
  options: string[];
  correctAnswer: string;
  book: string;
  chapter: number;
  verse: number;
  category: string;
  difficulty: QuestionDifficultyStage;
  readingComplexity?: ReadingComplexity;
  language?: string;
  explanation: string;
  active?: boolean;

  // Visual question fields
  questionType: QuestionType;
  imageId?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  localAssetPath?: string;
  imageCredit?: string;
  imageLicense?: string;
  imageSource?: string;
  imageAltText?: string;
  audioHint?: string;
}

export function isVisualQuestion(q: Question): boolean {
  return q.questionType === 'IMAGE' || 
         q.questionType === 'IMAGE_TEXT' || 
         Boolean(q.imageUrl && q.imageUrl.trim() !== '') || 
         Boolean(q.localAssetPath && q.localAssetPath.trim() !== '');
}

export function getScriptureReference(q: Question): string {
  return `${q.book} ${q.chapter}:${q.verse}`;
}

export function getHintText(q: Question): string {
  if (q.audioHint && q.audioHint.trim() !== '') return q.audioHint;
  if (q.explanation && q.explanation.trim() !== '') {
    const firstPeriod = q.explanation.indexOf('.');
    return firstPeriod > 0 ? q.explanation.slice(0, firstPeriod).slice(0, 100).trim() : q.explanation.slice(0, 100).trim();
  }
  return `Scripture context: ${getScriptureReference(q)}`;
}
