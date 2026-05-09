import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

function isValidEmail(email: string): boolean {
  const trimmed = email.trim();
  if (trimmed.length === 0) return false;
  const atIndex = trimmed.indexOf("@");
  if (atIndex < 1) return false;
  const dotIndex = trimmed.indexOf(".", atIndex + 1);
  return dotIndex > atIndex + 1 && dotIndex < trimmed.length - 1;
}

export default function WaitlistCTASection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setSubmitted(true);
  }

  return (
    <section
      aria-labelledby="waitlist-heading"
      className="bg-bg-primary px-6 py-20 font-sans"
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2
          id="waitlist-heading"
          className="mb-4 text-3xl font-bold text-text-primary"
        >
          Join the Waitlist
        </h2>
        <p className="mb-8 text-text-secondary">
          Be the first to access the Causal Intelligence Terminal.
        </p>

        {submitted ? (
          <p
            className="text-lg font-medium text-signal-green"
            role="status"
            aria-live="polite"
          >
            You're on the list. We'll be in touch.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <div className="flex w-full flex-col sm:w-auto">
              <label htmlFor="waitlist-email" className="sr-only">
                Email address
              </label>
              <input
                id="waitlist-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                placeholder="you@example.com"
                aria-describedby={error ? "waitlist-error" : undefined}
                aria-invalid={error ? true : undefined}
                className={cn(
                  "min-h-11 min-w-[200px] rounded-sm border bg-surface px-4 py-2 font-sans text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-signal-green focus:ring-offset-2 focus:ring-offset-bg-primary",
                  error ? "border-red-500" : "border-border"
                )}
              />
              {error && (
                <p
                  id="waitlist-error"
                  className="mt-2 text-sm text-red-500"
                  role="alert"
                >
                  {error}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="solid"
              size="lg"
              className="min-w-[200px]"
            >
              Join Waitlist
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
