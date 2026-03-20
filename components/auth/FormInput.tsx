"use client";

import { forwardRef } from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, hint, id, ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className='flex flex-col gap-1.5'>
        <label
          htmlFor={inputId}
          className='text-xs font-semibold uppercase tracking-widest text-ink-400'
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`input-field ${error ? "error" : ""}`}
          {...props}
        />
        {error && (
          <p className='text-xs text-red-400 flex items-center gap-1 animate-fade-in'>
            <svg
              className='w-3 h-3 shrink-0'
              viewBox='0 0 12 12'
              fill='currentColor'
            >
              <path d='M6 1a5 5 0 100 10A5 5 0 006 1zm-.5 2.5h1v3h-1v-3zm0 4h1v1h-1v-1z' />
            </svg>
            {error}
          </p>
        )}
        {hint && !error && <p className='text-xs text-ink-500'>{hint}</p>}
      </div>
    );
  },
);

FormInput.displayName = "FormInput";
