"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PasswordInput } from "@/components/auth/PasswordInput";

const schema = z
  .object({
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[0-9]/, "Must contain a number"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  if (!token) {
    return (
      <div className='w-full max-w-md'>
        <div className='glass-card rounded-2xl p-8 text-center animate-fade-up'>
          <p className='text-ink-400 font-body mb-4'>
            Invalid or missing reset token.
          </p>
          <Link
            href='/forgot-password'
            className='text-sm text-forest-400 underline font-body'
          >
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: data.password }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error);
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push("/login?reset=true"), 2000);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full max-w-md'>
      <div className='glass-card rounded-2xl p-8 animate-fade-up'>
        {!success ? (
          <>
            <div className='mb-8'>
              <p className='text-xs font-semibold uppercase tracking-widest text-forest-500 mb-1'>
                Account recovery
              </p>
              <h1 className='font-display text-3xl text-ink-100 leading-tight'>
                Set new password
              </h1>
              <p className='text-sm text-ink-400 mt-2 font-body'>
                Choose a strong password for your account.
              </p>
            </div>

            {error && (
              <div
                className='mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20
                              text-red-400 text-sm font-body animate-fade-in'
              >
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit(onSubmit)}
              className='space-y-5'
              noValidate
            >
              <PasswordInput
                label='New Password'
                placeholder='Min. 8 characters'
                autoComplete='new-password'
                error={errors.password?.message}
                hint='Must include an uppercase letter and a number.'
                {...register("password")}
              />
              <PasswordInput
                label='Confirm Password'
                placeholder='Repeat your password'
                autoComplete='new-password'
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />
              <button
                type='submit'
                disabled={isLoading}
                className='btn-primary flex items-center justify-center gap-2'
              >
                {isLoading ? (
                  <>
                    <div className='spinner' />
                    Saving…
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          </>
        ) : (
          <div className='text-center'>
            <div className='w-16 h-16 rounded-2xl bg-forest-600/15 border border-forest-500/20 flex items-center justify-center mx-auto mb-6'>
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
              Password updated!
            </h1>
            <p className='text-ink-400 font-body text-sm'>
              Redirecting you to sign in…
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
