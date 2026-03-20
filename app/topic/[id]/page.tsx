"use client";

import { useTopic } from "@/lib/hooks/useTopic";
import { LessonViewer } from "@/components/lesson/LessonViewer";
import Link from "next/link";

export default function TopicPage({ params }: { params: { id: string } }) {
  const { topic, isLoading, error } = useTopic(params.id);

  if (isLoading) {
    return (
      <div className='flex flex-col gap-4 animate-pulse'>
        {/* Skeleton breadcrumb */}
        <div className='h-4 w-40 bg-ink-900 rounded' />
        {/* Skeleton header */}
        <div className='h-8 w-64 bg-ink-900 rounded mt-2' />
        <div className='h-4 w-96 bg-ink-900 rounded' />
        {/* Skeleton two-col */}
        <div className='grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 mt-6'>
          <div className='h-[500px] bg-ink-900 rounded-2xl' />
          <div className='h-[400px] bg-ink-900 rounded-2xl' />
        </div>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className='flex flex-col items-center justify-center py-24 gap-4'>
        <div
          className='w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20
                        flex items-center justify-center'
        >
          <svg
            className='w-5 h-5 text-red-400'
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
        <p className='text-ink-400 font-body'>{error ?? "Topic not found."}</p>
        <Link
          href='/dashboard'
          className='text-sm text-forest-400 hover:text-forest-300 underline underline-offset-2
                     font-body transition-colors'
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <LessonViewer
      topicId={topic.id}
      topicTitle={topic.title}
      topicDescription={topic.description}
      topicDuration={topic.duration}
      lessons={topic.lessons}
      keyTerms={topic.keyTerms}
      questionCount={topic.questionCount}
      lastAttempt={topic.lastAttempt}
    />
  );
}
