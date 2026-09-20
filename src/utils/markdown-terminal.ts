const ANSI = {
  reset: '\u001B[0m',
  bold: '\u001B[1m',
  dim: '\u001B[2m',
  italic: '\u001B[3m',
  underline: '\u001B[4m',
  cyan: '\u001B[36m',
  blue: '\u001B[34m',
  green: '\u001B[32m',
} as const;

export interface MarkdownTerminalOptions {
  color?: boolean;
}

function style(
  value: string,
  codes: readonly string[],
  color: boolean,
): string {
  return color ? `${codes.join('')}${value}${ANSI.reset}` : value;
}

function renderInline(value: string, color: boolean): string {
  let rendered = value;

  rendered = rendered.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    (_match, label: string, url: string) =>
      `${style(label, [ANSI.underline, ANSI.cyan], color)} ${style(`(${url})`, [ANSI.dim], color)}`,
  );
  rendered = rendered.replace(
    /`([^`]+)`/g,
    (_match, code: string) => style(code, [ANSI.cyan], color),
  );
  rendered = rendered.replace(
    /\*\*([^*]+)\*\*/g,
    (_match, bold: string) => style(bold, [ANSI.bold], color),
  );
  rendered = rendered.replace(
    /(?<!\*)\*([^*]+)\*(?!\*)/g,
    (_match, italic: string) => style(italic, [ANSI.italic], color),
  );

  return rendered;
}

function renderCodeBlock(
  lines: readonly string[],
  language: string,
  color: boolean,
): string[] {
  const label = language ? ` ${language}` : '';
  const border = style(`╭─${label}`, [ANSI.dim], color);
  const body = lines.map((line) => `${style('│', [ANSI.dim], color)}  ${line}`);
  const footer = style('╰─', [ANSI.dim], color);
  return [border, ...body, footer];
}

/** Renders the Markdown subset used by Agent Skills for an interactive terminal. */
export function renderMarkdownForTerminal(
  markdown: string,
  options: MarkdownTerminalOptions = {},
): string {
  const color = options.color ?? (process.stdout.isTTY && !process.env.NO_COLOR);
  const output: string[] = [];
  const codeLines: string[] = [];
  let codeLanguage = '';
  let inCodeBlock = false;

  for (const line of markdown.replace(/\r\n/g, '\n').split('\n')) {
    const fence = line.match(/^\s*```([^\s]*)\s*$/);
    if (fence) {
      if (inCodeBlock) {
        output.push(...renderCodeBlock(codeLines, codeLanguage, color));
        codeLines.length = 0;
        codeLanguage = '';
      } else {
        codeLanguage = fence[1] ?? '';
      }
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (heading) {
      const level = heading[1]?.length ?? 1;
      const marker = level === 1 ? '▌ ' : level === 2 ? '├─ ' : '  ';
      const headingStyle = level === 1 ? [ANSI.bold, ANSI.blue] : [ANSI.bold];
      output.push(style(`${marker}${renderInline(heading[2] ?? '', color)}`, headingStyle, color));
      continue;
    }

    if (/^\s{0,3}([-*_])(?:\s*\1){2,}\s*$/.test(line)) {
      output.push(style('────────────────────────────────────────', [ANSI.dim], color));
      continue;
    }

    const checklist = line.match(/^(\s*)[-*+]\s+\[([ xX])\]\s+(.+)$/);
    if (checklist) {
      const mark = checklist[2]?.toLowerCase() === 'x' ? '☑' : '☐';
      output.push(`${checklist[1] ?? ''}${style(mark, [ANSI.green], color)} ${renderInline(checklist[3] ?? '', color)}`);
      continue;
    }

    const bullet = line.match(/^(\s*)[-*+]\s+(.+)$/);
    if (bullet) {
      output.push(`${bullet[1] ?? ''}${style('•', [ANSI.cyan], color)} ${renderInline(bullet[2] ?? '', color)}`);
      continue;
    }

    const ordered = line.match(/^(\s*)(\d+)\.\s+(.+)$/);
    if (ordered) {
      output.push(`${ordered[1] ?? ''}${style(`${ordered[2]}.`, [ANSI.cyan], color)} ${renderInline(ordered[3] ?? '', color)}`);
      continue;
    }

    const quote = line.match(/^>\s?(.*)$/);
    if (quote) {
      output.push(`${style('│', [ANSI.cyan], color)} ${style(renderInline(quote[1] ?? '', color), [ANSI.italic], color)}`);
      continue;
    }

    output.push(renderInline(line, color));
  }

  if (inCodeBlock) {
    output.push(...renderCodeBlock(codeLines, codeLanguage, color));
  }

  return output.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd();
}
