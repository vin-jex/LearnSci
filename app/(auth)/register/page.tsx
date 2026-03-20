"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { registerSchema, RegisterInput } from "@/lib/validations/auth";
import { FormInput } from "@/components/auth/FormInput";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  setLoading,
  setError,
  setSuccess,
  clearMessages,
} from "@/lib/store/slices/authSlice";

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error, successMessage } = useAppSelector((s) => s.auth);
  const [step, setStep] = useState<"form" | "success">("form");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    dispatch(setLoading(true));
    dispatch(clearMessages());

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        dispatch(
          setError(json.error ?? "Registration failed. Please try again."),
        );
        return;
      }

      dispatch(setSuccess("Account created! Signing you in…"));
      setStep("success");

      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.ok) {
        setTimeout(() => router.push("/dashboard"), 800);
      } else {
        router.push("/login?registered=true");
      }
    } catch {
      dispatch(setError("Network error. Please check your connection."));
    }
  };

  const password = watch("password", "");
  const passwordStrength = getPasswordStrength(password);

  return (
    <div className='w-full max-w-md'>
      {/* Card */}
      <div className='glass-card rounded-2xl p-8 shadow-2xl animate-fade-up stagger'>
        {/* Heading */}
        <div className='mb-8 animate-fade-up'>
          <p className='text-xs font-semibold uppercase tracking-widest text-forest-500 mb-1'>
            Get started
          </p>
          <h1 className='font-display text-3xl text-ink-100 leading-tight'>
            Create your account
          </h1>
          <p className='text-sm text-ink-400 mt-2 font-body'>
            Join LearnSci and start your science journey today.
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div
            className='mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20
                          text-red-400 text-sm font-body flex items-center gap-2 animate-fade-in'
          >
            <svg
              className='w-4 h-4 shrink-0'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                clipRule='evenodd'
              />
            </svg>
            {error}
          </div>
        )}

        {/* Success banner */}
        {successMessage && (
          <div
            className='mb-5 px-4 py-3 rounded-xl bg-forest-500/10 border border-forest-500/20
                          text-forest-400 text-sm font-body flex items-center gap-2 animate-fade-in'
          >
            <svg
              className='w-4 h-4 shrink-0'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                clipRule='evenodd'
              />
            </svg>
            {successMessage}
          </div>
        )}

        {step === "form" && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='space-y-5 stagger'
            noValidate
          >
            {/* Name */}
            <div className='animate-fade-up'>
              <FormInput
                label='Full Name'
                type='text'
                placeholder='Ada Okonkwo'
                autoComplete='name'
                error={errors.name?.message}
                {...register("name")}
              />
            </div>

            {/* Email */}
            <div className='animate-fade-up'>
              <FormInput
                label='Email Address'
                type='email'
                placeholder='ada@example.com'
                autoComplete='email'
                error={errors.email?.message}
                {...register("email")}
              />
            </div>

            {/* Password */}
            <div className='animate-fade-up'>
              <PasswordInput
                label='Password'
                placeholder='Min. 8 characters'
                autoComplete='new-password'
                error={errors.password?.message}
                hint='Must include an uppercase letter and a number.'
                {...register("password")}
              />
              {/* Strength bar */}
              {password.length > 0 && (
                <div className='mt-2 space-y-1 animate-fade-in'>
                  <div className='flex gap-1'>
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className='h-1 flex-1 rounded-full transition-all duration-300'
                        style={{
                          background:
                            i <= passwordStrength.score
                              ? passwordStrength.color
                              : "rgba(255,255,255,0.08)",
                        }}
                      />
                    ))}
                  </div>
                  <p
                    className='text-xs'
                    style={{ color: passwordStrength.color }}
                  >
                    {passwordStrength.label}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className='animate-fade-up'>
              <PasswordInput
                label='Confirm Password'
                placeholder='Repeat your password'
                autoComplete='new-password'
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />
            </div>

            {/* Submit */}
            <div className='pt-2 animate-fade-up'>
              <button
                type='submit'
                disabled={isLoading}
                className='btn-primary flex items-center justify-center gap-2'
              >
                {isLoading ? (
                  <>
                    <div className='spinner' />
                    Creating account…
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </form>
        )}

        {/* Divider + sign in link */}
        {step === "form" && (
          <p className='mt-6 text-center text-sm text-ink-500 font-body animate-fade-up'>
            Already have an account?{" "}
            <Link
              href='/login'
              className='btn-ghost text-forest-400 hover:text-forest-300'
            >
              Sign in
            </Link>
          </p>
        )}
      </div>

      {/* Terms note */}
      <p className='mt-4 text-center text-xs text-ink-600 font-body animate-fade-up'>
        By creating an account, you agree to our{" "}
        <span className='text-ink-500 underline underline-offset-2 cursor-pointer'>
          Terms of Use
        </span>
        .
      </p>
    </div>
  );
}

function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const map: Record<number, { label: string; color: string }> = {
    0: { label: "Too short", color: "#6b7280" },
    1: { label: "Weak", color: "#ef4444" },
    2: { label: "Fair", color: "#f59e0b" },
    3: { label: "Good", color: "#22c55e" },
    4: { label: "Strong", color: "#16a34a" },
  };

  return { score, ...map[score] };
}
