"use client";
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormInput } from "@/components/auth/FormInput";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error);
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full max-w-md'>
      <div className='glass-card rounded-2xl p-8 animate-fade-up'>
        {!submitted ? (
          <>
            <div className='mb-8'>
              <p className='text-xs font-semibold uppercase tracking-widest text-forest-500 mb-1'>
                Account recovery
              </p>
              <h1 className='font-display text-3xl text-ink-100 leading-tight'>
                Forgot password?
              </h1>
              <p className='text-sm text-ink-400 mt-2 font-body'>
                Enter your email and we&apos;ll send you a reset link.
              </p>
            </div>

            {error && (
              <div className='mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-body animate-fade-in'>
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit(onSubmit)}
              className='space-y-5'
              noValidate
            >
              <FormInput
                label='Email Address'
                type='email'
                placeholder='ada@example.com'
                autoComplete='email'
                error={errors.email?.message}
                {...register("email")}
              />
              <button
                type='submit'
                disabled={isLoading}
                className='btn-primary flex items-center justify-center gap-2'
              >
                {isLoading ? (
                  <>
                    <div className='spinner' />
                    Sending…
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>

            <p className='mt-6 text-center text-sm text-ink-500 font-body'>
              Remember it?{" "}
              <Link
                href='/login'
                className='text-forest-400 hover:text-forest-300 transition-colors'
              >
                Sign in
              </Link>
            </p>
          </>
        ) : (
          <div className='text-center'>
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
              Reset link sent
            </h1>
            <p className='text-ink-400 font-body text-sm leading-relaxed mb-6'>
              If an account exists for that email, we&apos;ve sent a password
              reset link. The link expires in 1 hour.
            </p>
            <Link
              href='/login'
              className='text-sm text-forest-400 underline underline-offset-2 font-body'
            >
              Back to sign in
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
