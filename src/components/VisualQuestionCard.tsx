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
    <div className="relative w-full max-w-md mx-auto my-2 rounded-xl overflow-hidden bg-slate-900/80 border border-slate-700/60 shadow-lg">
      {!isLoaded && !hasError && (
        <div className="w-full h-44 flex items-center justify-center bg-slate-800 animate-pulse text-slate-400 text-xs">
          Loading Sacred Artifact...
        </div>
      )}

      {hasError ? (
        <div className="w-full h-28 flex flex-col items-center justify-center bg-slate-800/60 text-slate-400 text-xs p-4 text-center">
          <ImageOff size={24} className="mb-1 text-slate-500" />
          <span>Artifact illustration cached offline</span>
        </div>
      ) : (
        <img
          src={src}
          alt={question.imageAltText || 'Biblical question visual reference'}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full max-h-52 object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0 h-0'
          }`}
          loading="eager"
        />
      )}

      {question.imageCredit && isLoaded && (
        <div className="absolute top-2 right-2">
          <button
            onClick={() => setShowCredits(!showCredits)}
            className="p-1 rounded-full bg-black/60 text-white/80 hover:text-white backdrop-blur-sm transition-colors"
            title="Image details"
            aria-label="View image credit information"
          >
            <Info size={14} />
          </button>
          {showCredits && (
            <div className="absolute right-0 mt-1 w-48 p-2 rounded-lg bg-slate-900/95 border border-slate-700 text-[10px] text-slate-300 shadow-xl backdrop-blur-md z-10">
              <p className="font-semibold text-amber-400">{question.imageCredit}</p>
              <p className="text-slate-400">{question.imageLicense || 'Public Domain'}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
