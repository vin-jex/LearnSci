"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { loginSchema, LoginInput } from "@/lib/validations/auth";
import { FormInput } from "@/components/auth/FormInput";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setLoading, setError, setSuccess, clearMessages } from "@/lib/store/slices/authSlice";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { isLoading, error, successMessage } = useAppSelector((s) => s.auth);

  const justRegistered = searchParams.get("registered") === "true";

  useEffect(() => {
    if (justRegistered) {
      dispatch(setSuccess("Account created! Please sign in."));
    }
    return () => { dispatch(clearMessages()); };
  }, [justRegistered, dispatch]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    dispatch(setLoading(true));
    dispatch(clearMessages());

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      const msg =
        result.error === "No account found with this email"
          ? "No account found with this email address."
          : result.error === "Incorrect password"
          ? "Incorrect password. Please try again."
          : "Sign in failed. Please check your credentials.";
      dispatch(setError(msg));
      return;
    }

    if (result?.ok) {
      dispatch(setSuccess("Welcome back! Redirecting…"));
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Card */}
      <div className="glass-card rounded-2xl p-8 shadow-2xl animate-fade-up stagger">

        {/* Heading */}
        <div className="mb-8 animate-fade-up">
          <p className="text-xs font-semibold uppercase tracking-widest text-forest-500 mb-1">
            Welcome back
          </p>
          <h1 className="font-display text-3xl text-ink-100 leading-tight">
            Sign in to LearnSci
          </h1>
          <p className="text-sm text-ink-400 mt-2 font-body">
            Continue your learning journey.
          </p>
        </div>

        {/* Success banner */}
        {successMessage && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-forest-500/10 border border-forest-500/20
                          text-forest-400 text-sm font-body flex items-center gap-2 animate-fade-in">
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {successMessage}
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20
                          text-red-400 text-sm font-body flex items-center gap-2 animate-fade-in">
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 stagger" noValidate>
          <div className="animate-fade-up">
            <FormInput
              label="Email Address"
              type="email"
              placeholder="ada@example.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register("email")}
            />
          </div>

          <div className="animate-fade-up">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-ink-400">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-ink-500 hover:text-ink-300 transition-colors
                           underline underline-offset-2"
              >
                Forgot password?
              </Link>
            </div>
            <PasswordInput
              label=""
              placeholder="Your password"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register("password")}
            />
          </div>

          <div className="pt-2 animate-fade-up">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="spinner" />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>

        {/* Sign up link */}
        <p className="mt-6 text-center text-sm text-ink-500 font-body animate-fade-up">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="btn-ghost text-forest-400 hover:text-forest-300">
            Create one free
          </Link>
        </p>
      </div>

      {/* Demo hint */}
      <div className="mt-4 glass-card rounded-xl px-4 py-3 animate-fade-up">
        <p className="text-xs text-ink-500 font-body text-center">
          <span className="text-ink-400 font-semibold">Demo credentials:</span>{" "}
          admin@cal.edu · admin1234
        </p>
      </div>
    </div>
  );
}
