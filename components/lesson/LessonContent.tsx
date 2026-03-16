"use client";
// components/lesson/LessonContent.tsx

interface Props {
  content: string;
  title: string;
}

/**
 * Renders markdown lesson content.
 * In production you'd use `react-markdown` or `@tailwindcss/typography`.
 * This component does lightweight client-side markdown → HTML parsing
 * to avoid adding a heavy dependency for the scaffold.
 */
export function LessonContent({ content, title }: Props) {
  const html = markdownToHtml(content);

  return (
    <div>
      <h1 className='font-display text-3xl md:text-4xl text-ink-100 mb-6 leading-tight'>
        {title}
      </h1>
      <div
        className='lesson-prose'
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

/** Lightweight markdown → HTML converter for lesson content. */
function markdownToHtml(md: string): string {
  return (
    md
      // Headings
      .replace(/^### (.+)$/gm, '<h3 class="lesson-h3">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="lesson-h2">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="lesson-h1">$1</h1>')
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong class="lesson-strong">$1</strong>')
      // Italic
      .replace(/\*(.+?)\*/g, '<em class="lesson-em">$1</em>')
      // Blockquote
      .replace(
        /^> (.+)$/gm,
        '<blockquote class="lesson-blockquote">$1</blockquote>',
      )
      // Ordered list items
      .replace(/^\d+\.\s(.+)$/gm, '<li class="lesson-li">$1</li>')
      // Unordered list items
      .replace(
        /^[-*]\s(.+)$/gm,
        '<li class="lesson-li lesson-li-bullet">$1</li>',
      )
      // Wrap consecutive <li> in <ol> or <ul> - simple approach
      .replace(/(<li class="lesson-li">[\s\S]+?<\/li>)(\n|$)/g, (match) => {
        if (match.includes("lesson-li-bullet")) {
          return `<ul class="lesson-ul">${match}</ul>`;
        }
        return `<ol class="lesson-ol">${match}</ol>`;
      })
      // Paragraphs (blank-line separated)
      .replace(/\n\n(?!<[huo]|<block)/g, '</p><p class="lesson-p">')
      .replace(/^(?!<[huo]|<block)(.+)/gm, (line) => {
        if (line.startsWith("<")) return line;
        return line;
      })
      // Wrap in opening p tag if needed
      .replace(/^([^<])/, '<p class="lesson-p">$1')
      // Subscripts for chemical formulas
      .replace(/₂/g, "<sub>2</sub>")
      .replace(/₆/g, "<sub>6</sub>")
      .replace(/₁₂/g, "<sub>12</sub>")
  );
}
