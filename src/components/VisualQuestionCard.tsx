import React, { useState } from 'react';
import { Question } from '../data/models/Question';
import { ImageOff, Info } from 'lucide-react';

interface Props {
  question: Question;
}

export const VisualQuestionCard: React.FC<Props> = ({ question }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showCredits, setShowCredits] = useState(false);

  if (!question.imageUrl && !question.localAssetPath) {
    return null;
  }

  const src = question.localAssetPath || question.imageUrl;

  return (
    <div className="relative w-full max-w-lg mx-auto my-2 rounded-2xl overflow-hidden sacred-card shadow-xl border border-amber-500/20">
      {!isLoaded && !hasError && (
        <div className="w-full h-48 flex flex-col items-center justify-center bg-slate-900 animate-shimmer text-slate-400 text-xs gap-2">
          <div className="w-8 h-8 rounded-full border-2 border-amber-500/30 border-t-amber-400 animate-spin" />
          <span className="font-semibold text-amber-200/80">Loading Scripture Illustration...</span>
        </div>
      )}

      {hasError ? (
        <div className="w-full h-28 flex flex-col items-center justify-center bg-slate-900 text-slate-400 text-xs p-4 text-center">
          <ImageOff size={24} className="mb-1.5 text-slate-500" />
          <span className="font-medium">Scripture illustration safely cached offline</span>
        </div>
      ) : (
        <img
          src={src}
          alt={question.imageAltText || 'Biblical question visual reference'}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full max-h-56 object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0 h-0'
          }`}
          loading="eager"
        />
      )}

      {question.imageCredit && isLoaded && (
        <div className="absolute top-2 right-2">
          <button
            onClick={() => setShowCredits(!showCredits)}
            className="p-1.5 rounded-full bg-black/70 text-amber-300/80 hover:text-amber-200 backdrop-blur-md transition-colors border border-white/10"
            title="Image details & credit"
            aria-label="View image credit information"
          >
            <Info size={14} />
          </button>
          {showCredits && (
            <div className="absolute right-0 mt-1.5 w-52 p-2.5 rounded-xl bg-slate-950/95 border border-amber-500/30 text-[10px] text-slate-300 shadow-2xl backdrop-blur-md z-30 animate-in fade-in duration-150">
              <p className="font-bold text-amber-300">{question.imageCredit}</p>
              <p className="text-slate-400 mt-0.5">{question.imageLicense || 'Public Domain'}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
