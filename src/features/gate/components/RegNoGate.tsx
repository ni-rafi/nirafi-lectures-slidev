import React, { useState } from 'react';
import { useUserContext } from '@/context';
import { GraduationCap, Lock, ArrowRight, AlertCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { validateRegistration, validateSession } from '@/cores/user/userValidation';

const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4 shrink-0" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
  </svg>
);

export const RegNoGate: React.FC = () => {
  const {
    signInWithGoogle,
    continueAsGuest,
    needsProfileSetup,
    googleUser,
    completeProfileSetup,
    logout,
    error,
    clearError
  } = useUserContext();

  const [roll, setRoll] = useState('');
  const [sessionVal, setSessionVal] = useState('2016-17');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [rollTouched, setRollTouched] = useState(false);
  const [sessionTouched, setSessionTouched] = useState(false);

  const isRollValid = validateRegistration(roll);
  const isSessionValid = validateSession(sessionVal);
  const isFormValid = isRollValid && isSessionValid;

  const showRollError = rollTouched && !isRollValid;
  const showSessionError = sessionTouched && !isSessionValid;

  const handleGoogleLogin = async () => {
    clearError();
    setValidationError(null);
    setIsSubmitting(true);
    const success = await signInWithGoogle();
    if (!success) {
      setIsSubmitting(false);
    }
  };

  const handleGuestLogin = async () => {
    clearError();
    setValidationError(null);
    setIsSubmitting(true);
    const success = await continueAsGuest('Guest Student', '9999999999', '2016-17');
    if (!success) {
      setIsSubmitting(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationError(null);

    if (!isRollValid) {
      setValidationError('Registration number must be exactly 10 digits.');
      return;
    }

    if (!isSessionValid) {
      setValidationError('Invalid academic session. Standard format is YYYY-YY (e.g., 2016-17).');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await completeProfileSetup(roll, sessionVal);
      if (!success) {
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      setValidationError('Profile setup service encountered an error.');
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

        {/* Dynamic Card Body */}
        {needsProfileSetup ? (
          /* Profile Setup Screen */
          <form onSubmit={handleProfileSubmit} className="p-6 sm:p-8 flex flex-col gap-5">
            <div className="flex flex-col gap-1.5 text-center sm:text-left">
              <h2 className="text-md font-semibold flex items-center gap-1.5 justify-center sm:justify-start">
                <Lock className="h-4 w-4 text-primary" />
                Complete Your Profile
              </h2>
              <p className="text-xs text-muted-foreground">
                Hello, <strong className="text-foreground">{googleUser?.name || 'Student'}</strong> ({googleUser?.email}). Please provide your student identifiers to register for this course.
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

            {/* Session Input */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="session" className="text-xs font-semibold text-foreground/80">
                Academic Session
              </label>
              <Input
                id="session"
                type="text"
                required
                placeholder="e.g. 2016-17"
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

            {/* Submit & Cancel Buttons */}
            <div className="flex flex-col gap-2 mt-1">
              <Button
                type="submit"
                className="w-full font-semibold group"
                disabled={isSubmitting || !isFormValid}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-1.5">
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Saving profile...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-1.5">
                    Complete Registration
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full font-semibold text-muted-foreground hover:text-foreground flex items-center justify-center gap-1.5"
                disabled={isSubmitting}
                onClick={logout}
              >
                <LogOut className="h-4 w-4" />
                Cancel & Sign Out
              </Button>
            </div>
          </form>
        ) : (
          /* Sign-In Choices Screen */
          <div className="p-6 sm:p-8 flex flex-col gap-6">
            <div className="flex flex-col gap-1.5 text-center sm:text-left">
              <h2 className="text-md font-semibold flex items-center gap-1.5 justify-center sm:justify-start">
                <Lock className="h-4 w-4 text-primary" />
                Student Verification
              </h2>
              <p className="text-xs text-muted-foreground">
                Sign in with Google to sync your course submissions across devices, or continue offline as a guest.
              </p>
            </div>

            {/* Alert messages */}
            {error && (
              <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-xs text-destructive animate-in fade-in-50 duration-200">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex flex-col gap-3">
              {/* Google Sign-in Button */}
              <Button
                type="button"
                variant="default"
                className="w-full font-semibold py-5 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                disabled={isSubmitting}
                onClick={handleGoogleLogin}
              >
                {isSubmitting ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                ) : (
                  <GoogleIcon />
                )}
                Sign In with Google
              </Button>

              <div className="relative flex items-center justify-center py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-muted-foreground/10" />
                </div>
                <span className="relative bg-card px-3 text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-wider">
                  or
                </span>
              </div>

              {/* Guest button */}
              <Button
                type="button"
                variant="outline"
                className="w-full font-semibold py-5"
                disabled={isSubmitting}
                onClick={handleGuestLogin}
              >
                Continue as Guest (Offline)
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegNoGate;
