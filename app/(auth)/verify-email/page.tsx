"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

type State = "pending" | "verifying" | "success" | "error" | "waiting";

export default function VerifyEmailPage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");
  const [state, setState] = useState<State>(token ? "verifying" : "waiting");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!token) return;
    setState("verifying");

    fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setErrorMsg(data.error);
          setState("error");
        } else {
          setState("success");
          setTimeout(() => router.push("/login?verified=true"), 2000);
        }
      })
      .catch(() => {
        setErrorMsg("Network error. Please try again.");
        setState("error");
      });
  }, [token, router]);

  return (
    <div className='w-full max-w-md'>
      <div className='glass-card rounded-2xl p-8 animate-fade-up text-center'>
        {state === "waiting" && (
          <>
            <div className='w-16 h-16 rounded-2xl bg-forest-600/15 border border-forest-500/20 flex items-center justify-center mx-auto mb-6'>
              <svg
                className='w-8 h-8 text-forest-400'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='1.5'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75'
                />
              </svg>
            </div>
            <p className='text-xs font-semibold uppercase tracking-widest text-forest-500 mb-2'>
              Check your email
            </p>
            <h1 className='font-display text-2xl text-ink-100 mb-3'>
              Verify your account
            </h1>
            <p className='text-ink-400 font-body text-sm leading-relaxed mb-6'>
              We sent a verification link to your email address. Click the link
              in the email to activate your account.
            </p>
            <p className='text-ink-600 font-body text-xs'>
              Didn&apos;t receive it? Check your spam folder.
            </p>
            <div className='mt-6'>
              <Link
                href='/login'
                className='text-xs text-ink-500 hover:text-ink-300 font-body transition-colors'
              >
                ← Back to sign in
              </Link>
            </div>
          </>
        )}

        {state === "verifying" && (
          <>
            <div className='spinner mx-auto mb-6 !w-10 !h-10' />
            <p className='text-ink-400 font-body'>Verifying your email…</p>
          </>
        )}

        {state === "success" && (
          <>
            <div
              className='w-16 h-16 rounded-2xl bg-forest-600/15 border border-forest-500/20
                            flex items-center justify-center mx-auto mb-6'
            >
              <svg
                className='w-8 h-8 text-forest-400'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <h1 className='font-display text-2xl text-ink-100 mb-3'>
              Email verified!
            </h1>
            <p className='text-ink-400 font-body text-sm'>
              Redirecting you to sign in…
            </p>
          </>
        )}

        {state === "error" && (
          <>
            <div className='w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6'>
              <svg
                className='w-8 h-8 text-red-400'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <h1 className='font-display text-2xl text-ink-100 mb-3'>
              Link expired
            </h1>
            <p className='text-ink-400 font-body text-sm mb-6'>{errorMsg}</p>
            <Link
              href='/login'
              className='text-sm text-forest-400 underline underline-offset-2 font-body'
            >
              Back to sign in
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
