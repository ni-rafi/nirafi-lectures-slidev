import React, { useState } from 'react';
import { useUserContext } from '@/context/UserContext';
import { GraduationCap, Lock, ArrowRight, AlertCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { validateRegistration, validateSession } from '@/cores/user/userValidation';

/**
 * RegNoGate displays a card interface gating access to the lectures portal.
 * Requires a valid 10-digit registration number and session.
 */
export const RegNoGate: React.FC = () => {
  const { login, error, clearError } = useUserContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [roll, setRoll] = useState('');
  const [sessionVal, setSessionVal] = useState('2016-17'); // Default to target session
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [rollTouched, setRollTouched] = useState(false);
  const [sessionTouched, setSessionTouched] = useState(false);

  const isRollValid = validateRegistration(roll);
  const isSessionValid = validateSession(sessionVal);
  const isFormValid = name.trim() !== '' && isRollValid && isSessionValid;

  const showRollError = rollTouched && !isRollValid;
  const showSessionError = sessionTouched && !isSessionValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationError(null);

    // Basic pre-submit validation
    if (!name.trim()) {
      setValidationError('Student Name is required.');
      return;
    }

    if (!isRollValid) {
      setValidationError('Registration number must be exactly 10 digits.');
      return;
    }

    if (!isSessionValid) {
      setValidationError('Invalid academic session. Standard format is YYYY-YY (e.g., 2016-17).');
      return;
    }

    // Email format validation (if provided)
    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setValidationError('Invalid email address format.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const success = await login(roll, sessionVal, name, email);
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

  const handleGuestLogin = async () => {
    clearError();
    setValidationError(null);
    setIsSubmitting(true);
    try {
      const success = await login('9999999999', '2016-17', 'Guest Student');
      if (!success) {
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      setValidationError('Guest login encountered an error.');
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

          {/* Name Input */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-xs font-semibold text-foreground/80">
              Student Name
            </label>
            <Input
              id="name"
              type="text"
              required
              placeholder="e.g. Md. Nazmul Islam Rafi"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (validationError) setValidationError(null);
                clearError();
              }}
              className="bg-muted/30 focus:bg-background transition-colors text-sm"
              disabled={isSubmitting}
            />
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
              placeholder="e.g. 2016333012"
              value={roll}
              onChange={(e) => {
                setRoll(e.target.value);
                if (validationError) setValidationError(null);
                clearError();
              }}
              onBlur={() => setRollTouched(true)}
              aria-invalid={showRollError}
              className="bg-muted/30 focus:bg-background transition-colors font-mono text-sm"
              disabled={isSubmitting}
            />
            {showRollError && (
              <span className="text-[11px] text-destructive flex items-center gap-1 mt-0.5 animate-in fade-in-50 duration-200">
                <AlertCircle className="h-3 w-3 shrink-0" />
                Registration number must be exactly 10 digits.
              </span>
            )}
          </div>

          {/* Email Input */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-semibold text-foreground/80 flex items-center justify-between">
              <span>Email Address</span>
              <span className="text-[10px] text-muted-foreground font-normal">Optional</span>
            </label>
            <Input
              id="email"
              type="email"
              placeholder="e.g. rafi@sust.edu"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (validationError) setValidationError(null);
                clearError();
              }}
              className="bg-muted/30 focus:bg-background transition-colors text-sm"
              disabled={isSubmitting}
            />
          </div>

          {/* Session Input */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="session" className="text-xs font-semibold text-foreground/80">
              Academic Session
            </label>
            <Input
              id="session"
              type="text"
              required
              placeholder="e.g. 2026-27"
              value={sessionVal}
              onChange={(e) => {
                setSessionVal(e.target.value);
                if (validationError) setValidationError(null);
                clearError();
              }}
              onBlur={() => setSessionTouched(true)}
              aria-invalid={showSessionError}
              className="bg-muted/30 focus:bg-background transition-colors text-sm"
              disabled={isSubmitting}
            />
            {showSessionError && (
              <span className="text-[11px] text-destructive flex items-center gap-1 mt-0.5 animate-in fade-in-50 duration-200">
                <AlertCircle className="h-3 w-3 shrink-0" />
                Session format must be YYYY-YY (e.g., 2016-17).
              </span>
            )}
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
            disabled={isSubmitting || !isFormValid}
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

          {/* Guest Option */}
          <div className="relative flex items-center justify-center py-1">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted-foreground/10" />
            </div>
            <span className="relative bg-card px-3 text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-wider">
              or
            </span>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full font-semibold transition-colors flex items-center justify-center gap-1.5"
            disabled={isSubmitting}
            onClick={handleGuestLogin}
          >
            <User className="h-3.5 w-3.5 text-muted-foreground" />
            Continue as Guest
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RegNoGate;
