import React, { useState } from 'react';
import { useUserContext } from '@/context/UserContext';
import { GraduationCap, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

/**
 * RollNumberGate displays a card interface gating access to the lectures portal.
 * Requires a valid 10-digit registration number and session.
 */
export const RollNumberGate: React.FC = () => {
  const { login, error, clearError } = useUserContext();
  const [roll, setRoll] = useState('');
  const [sessionVal, setSessionVal] = useState('2026-27'); // Default to target session
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationError(null);

    // Basic pre-submit validation
    const digitsOnly = roll.replace(/\D/g, '');
    if (digitsOnly.length !== 10) {
      setValidationError('Registration number must be exactly 10 digits.');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await login(roll, sessionVal);
      if (!success) {
        // Error is set in UserContext and will be displayed
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      setValidationError('Verification service encountered an error.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-radial from-background via-muted/50 to-muted px-4 py-12">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-2xl transition-all duration-300 hover:shadow-primary/5">
        {/* Top Branding Banner */}
        <div className="relative bg-primary px-6 py-8 text-center text-primary-foreground">
          <div className="absolute inset-0 bg-linear-to-b from-primary/10 to-primary/40" />
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="rounded-full bg-primary-foreground/15 p-3 backdrop-blur-md">
              <GraduationCap className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Md. Nazmul Islam Rafi's Workspace</h1>
            <p className="text-xs text-primary-foreground/85">
              Shahjalal University of Science & Technology
            </p>
          </div>
        </div>

        {/* Verification Form Card Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5 text-center sm:text-left">
            <h2 className="text-md font-semibold flex items-center gap-1.5 justify-center sm:justify-start">
              <Lock className="h-4 w-4 text-primary" />
              Student Verification
            </h2>
            <p className="text-xs text-muted-foreground">
              Please provide your student identifiers to gain access.
            </p>
          </div>

          {/* Registration Input */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="roll" className="text-xs font-semibold text-foreground/80">
              Registration Number
            </label>
            <Input
              id="roll"
              type="text"
              required
              placeholder="e.g. 2020331001"
              value={roll}
              onChange={(e) => {
                setRoll(e.target.value);
                if (validationError) setValidationError(null);
                clearError();
              }}
              className="bg-muted/30 focus:bg-background transition-colors font-mono text-sm"
              disabled={isSubmitting}
            />
          </div>

          {/* Session Input */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="session" className="text-xs font-semibold text-foreground/80">
              Academic Session
            </label>
            <select
              id="session"
              required
              value={sessionVal}
              onChange={(e) => {
                setSessionVal(e.target.value);
                clearError();
              }}
              className="flex h-9 w-full rounded-md border border-input bg-muted/30 px-3 py-1 text-xs shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 focus:bg-background"
              disabled={isSubmitting}
            >
              <option value="2026-27">Session 2026-27</option>
              <option value="2025-26">Session 2025-26</option>
              <option value="2024-25">Session 2024-25</option>
              <option value="2023-24">Session 2023-24</option>
              <option value="2022-23">Session 2022-23</option>
              <option value="2021-22">Session 2021-22</option>
              <option value="2020-21">Session 2020-21</option>
            </select>
          </div>

          {/* Alert messages */}
          {(validationError || error) && (
            <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-xs text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{validationError || error}</span>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full font-semibold mt-1 group"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-1.5">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Verifying...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1.5">
                Enter Workspace
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RollNumberGate;
