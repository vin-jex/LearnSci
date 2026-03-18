// components/lesson/LessonContent.tsx
"use client";

interface Props {
  content: string;
  title: string;
}

export function LessonContent({ content, title }: Props) {
  const html = markdownToHtml(content);

  return (
    <div>
      {title && (
        <h1 className='font-display text-3xl md:text-4xl text-ink-100 mb-6 leading-tight'>
          {title}
        </h1>
      )}
      <div
        className='lesson-prose'
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

function markdownToHtml(md: string): string {
  const lines = md.split("\n");
  const out: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // ── Headings ──────────────────────────────────────────────
    if (line.startsWith("### ")) {
      out.push(`<h3 class="lesson-h3">${inlineFormat(line.slice(4))}</h3>`);
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      out.push(`<h2 class="lesson-h2">${inlineFormat(line.slice(3))}</h2>`);
      i++;
      continue;
    }
    if (line.startsWith("# ")) {
      out.push(`<h1 class="lesson-h1">${inlineFormat(line.slice(2))}</h1>`);
      i++;
      continue;
    }

    // ── Blockquote ────────────────────────────────────────────
    if (line.startsWith("> ")) {
      out.push(
        `<blockquote class="lesson-blockquote">${inlineFormat(line.slice(2))}</blockquote>`,
      );
      i++;
      continue;
    }

    // ── Table ─────────────────────────────────────────────────
    if (line.startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      out.push(renderTable(tableLines));
      continue;
    }

    // ── Unordered list ────────────────────────────────────────
    if (/^[-*]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i])) {
        items.push(
          `<li class="lesson-li">${inlineFormat(lines[i].slice(2))}</li>`,
        );
        i++;
      }
      out.push(`<ul class="lesson-ul">${items.join("")}</ul>`);
      continue;
    }

    // ── Ordered list ──────────────────────────────────────────
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(
          `<li class="lesson-li">${inlineFormat(lines[i].replace(/^\d+\.\s/, ""))}</li>`,
        );
        i++;
      }
      out.push(`<ol class="lesson-ol">${items.join("")}</ol>`);
      continue;
    }

    // ── Blank line ────────────────────────────────────────────
    if (line.trim() === "") {
      i++;
      continue;
    }

    // ── Paragraph ─────────────────────────────────────────────
    // Collect consecutive non-empty, non-special lines
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("#") &&
      !lines[i].startsWith(">") &&
      !lines[i].startsWith("|") &&
      !/^[-*]\s/.test(lines[i]) &&
      !/^\d+\.\s/.test(lines[i])
    ) {
      paraLines.push(inlineFormat(lines[i]));
      i++;
    }
    if (paraLines.length > 0) {
      out.push(`<p class="lesson-p">${paraLines.join(" ")}</p>`);
    }
  }

  return out.join("\n");
}

function inlineFormat(text: string): string {
  return (
    text
      // Bold + italic
      .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong class="lesson-strong">$1</strong>')
      // Italic
      .replace(/\*(.+?)\*/g, '<em class="lesson-em">$1</em>')
      // Inline code
      .replace(/`(.+?)`/g, '<code class="lesson-code">$1</code>')
      // Chemical subscripts (common ones)
      .replace(/₂/g, "<sub>2</sub>")
      .replace(/₆/g, "<sub>6</sub>")
      .replace(/₁₂/g, "<sub>12</sub>")
  );
}

function renderTable(lines: string[]): string {
  // Filter out separator rows (---|---|---)
  const dataRows = lines.filter(
    (l) =>
      l.replace(/\|/g, "").replace(/-/g, "").replace(/\s/g, "").length !== 0 &&
      !/^\|[-| :]+\|$/.test(l.trim()),
  );

  if (dataRows.length === 0) return "";

  const parseRow = (line: string): string[] =>
    line
      .split("|")
      .slice(1, -1)
      .map((cell) => cell.trim());

  const [headerRow, ...bodyRows] = dataRows;
  const headers = parseRow(headerRow);

  const thead = `<thead><tr>${headers
    .map((h) => `<th class="lesson-th">${inlineFormat(h)}</th>`)
    .join("")}</tr></thead>`;

  const tbody = bodyRows
    .map(
      (row) =>
        `<tr>${parseRow(row)
          .map((cell) => `<td class="lesson-td">${inlineFormat(cell)}</td>`)
          .join("")}</tr>`,
    )
    .join("");

  return `<div class="lesson-table-wrap"><table class="lesson-table">${thead}<tbody>${tbody}</tbody></table></div>`;
}
