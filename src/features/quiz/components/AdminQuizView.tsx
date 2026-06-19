import React from 'react';
import { NumericQuizAdmin } from './types/NumericQuiz';
import { MultipleChoiceQuizAdmin } from './types/MultipleChoiceQuiz';
import { Play, RotateCcw, BarChart, List, Clock, RefreshCw } from 'lucide-react';

interface QuizSubmission {
  studentName: string;
  studentRegistration: string;
  answer: string;
  isCorrect: boolean;
}

interface AdminQuizViewProps {
  status: string;
  questionText: string;
  durationInput: number;
  setDurationInput: (val: number) => void;
  bufferInput: number;
  setBufferInput: (val: number) => void;
  handleAdminActivate: () => Promise<void>;
  isLagging: boolean;
  lagTimeLeft: number;
  timeLeft: number;
  formatTime: (seconds: number) => string;
  handleAdminClose: () => Promise<void>;
  handleAdminReset: () => Promise<void>;
  adminView: 'chart' | 'details';
  setAdminView: (view: 'chart' | 'details') => void;
  handleAdminReactivate: (extraSeconds: number) => Promise<void>;
  quizType: 'numeric-input' | 'multiple-choice';
  correctAnswer: string;
  options: string[];
  allSubmissions: QuizSubmission[];
  isRevealed: boolean;
  handleAdminReveal: () => Promise<void>;
}

export const AdminQuizView: React.FC<AdminQuizViewProps> = ({
  status,
  questionText,
  durationInput,
  setDurationInput,
  bufferInput,
  setBufferInput,
  handleAdminActivate,
  isLagging,
  lagTimeLeft,
  timeLeft,
  formatTime,
  handleAdminClose,
  handleAdminReset,
  adminView,
  setAdminView,
  handleAdminReactivate,
  quizType,
  correctAnswer,
  options,
  allSubmissions,
  isRevealed,
  handleAdminReveal,
}) => {

  return (
    <div className="w-full max-w-2xl mx-auto bg-card border border-border/80 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-4 text-left">
      <div className="flex justify-between items-center select-none">
        <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Classroom Quiz</span>
        {status === 'active' && (
          <span className={`flex items-center gap-1 text-xs font-bold font-mono px-2 py-0.5 rounded-full border ${
            isLagging 
              ? 'text-amber-500 bg-amber-500/10 border-amber-500/25' 
              : 'text-red-500 bg-red-500/10 border-red-500/25'
          }`}>
            <Clock className={`h-3.5 w-3.5 ${isLagging ? 'animate-spin' : 'animate-pulse'}`} />
            {isLagging ? `${lagTimeLeft}s (Buffer)` : formatTime(timeLeft)}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div className="text-xs font-medium text-foreground select-text border bg-muted/20 p-3 rounded-xl mb-1">
          <span className="font-bold text-muted-foreground block mb-0.5 select-none">Admin Preview:</span>
          {isLagging ? (
            <span className="italic text-muted-foreground font-normal">[Question hidden during buffer time]</span>
          ) : (
            questionText
          )}
        </div>

        {status === 'hidden' && (
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex flex-col gap-1 w-full sm:w-auto">
              <label className="text-[10px] font-bold text-muted-foreground uppercase select-none">Duration</label>
              <select
                value={durationInput}
                onChange={(e) => setDurationInput(parseInt(e.target.value))}
                className="w-full text-xs border rounded-lg bg-background p-2 h-9 min-w-[110px]"
              >
                <option value={60}>1 Minute</option>
                <option value={120}>2 Minutes</option>
                <option value={300}>5 Minutes</option>
                <option value={600}>10 Minutes</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 w-full sm:w-auto">
              <label className="text-[10px] font-bold text-muted-foreground uppercase select-none">Buffer (Max 30s)</label>
              <select
                value={bufferInput}
                onChange={(e) => setBufferInput(parseInt(e.target.value))}
                className="w-full text-xs border rounded-lg bg-background p-2 h-9 min-w-[125px]"
              >
                <option value={0}>0s (No Lag)</option>
                <option value={10}>10 Seconds</option>
                <option value={20}>20 Seconds</option>
                <option value={30}>30 Seconds</option>
              </select>
            </div>
            <button
              onClick={handleAdminActivate}
              className="w-full sm:flex-1 py-2 bg-primary hover:bg-primary/95 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer h-9"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              Activate Quiz
            </button>
          </div>
        )}

        {status !== 'hidden' && (
          <div className="flex flex-col gap-3">
            {isLagging ? (
              <div className="p-6 border border-dashed border-border rounded-xl bg-muted/10 flex flex-col items-center gap-3 text-center">
                <div className="relative flex items-center justify-center">
                  <div className="h-10 w-10 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin"></div>
                </div>
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Lag Buffer Active</h4>
                <p className="text-xs text-muted-foreground">
                  Students are loading the quiz form... {lagTimeLeft} seconds remaining.
                </p>
                <div className="flex gap-2 mt-2 w-full justify-center">
                  <button
                    onClick={handleAdminClose}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                  >
                    Cancel / Close
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center border-b pb-2 border-border/40 select-none">
                  <div className="flex gap-1">
                    <button
                      onClick={() => setAdminView('chart')}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        adminView === 'chart' ? 'bg-primary/10 border-primary text-primary' : 'bg-background hover:bg-muted text-muted-foreground'
                      }`}
                    >
                      <BarChart className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setAdminView('details')}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        adminView === 'details' ? 'bg-primary/10 border-primary text-primary' : 'bg-background hover:bg-muted text-muted-foreground'
                      }`}
                    >
                      <List className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    {status === 'active' && (
                      <>
                        <button
                          onClick={handleAdminReset}
                          className="px-2.5 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-[10px] font-bold cursor-pointer flex items-center gap-1"
                        >
                          <RefreshCw className="h-3 w-3" />
                          Reset
                        </button>
                        <button
                          onClick={() => handleAdminReactivate(60)}
                          className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                        >
                          +1 Min
                        </button>
                        <button
                          onClick={handleAdminClose}
                          className="px-2.5 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                        >
                          Close
                        </button>
                      </>
                    )}
                    {status === 'closed' && (
                      <>
                        {!isRevealed && (
                          <button
                            onClick={handleAdminReveal}
                            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                          >
                            Reveal Answer
                          </button>
                        )}
                        <button
                          onClick={handleAdminReset}
                          className="px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <RefreshCw className="h-3 w-3" />
                          Reset
                        </button>
                        <div className="flex items-center gap-1">
                          <select
                            value={durationInput}
                            onChange={(e) => setDurationInput(parseInt(e.target.value))}
                            className="text-[10px] font-bold border rounded-lg bg-background px-1.5 py-1 h-[28px] min-w-[85px] cursor-pointer"
                          >
                            <option value={60}>1 Min</option>
                            <option value={120}>2 Mins</option>
                            <option value={300}>5 Mins</option>
                            <option value={600}>10 Mins</option>
                          </select>
                          <button
                            onClick={() => handleAdminReactivate(durationInput)}
                            className="px-2.5 py-1.5 bg-primary hover:bg-primary/95 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer h-[28px]"
                          >
                            <RotateCcw className="h-3 w-3" />
                            Reopen
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {quizType === 'numeric-input' ? (
                  <NumericQuizAdmin
                    correctAnswer={correctAnswer}
                    submissions={allSubmissions}
                    activeView={adminView}
                    isRevealed={isRevealed}
                  />
                ) : (
                  <MultipleChoiceQuizAdmin
                    correctAnswer={correctAnswer}
                    options={options}
                    submissions={allSubmissions}
                    activeView={adminView}
                    isRevealed={isRevealed}
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
