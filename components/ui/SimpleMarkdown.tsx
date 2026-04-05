type SimpleMarkdownProps = {
  content: string;
  className?: string;
};

export default function SimpleMarkdown({ content, className }: SimpleMarkdownProps) {
  const lines = content.split(/\r?\n/);
  const blocks: Array<
    | { type: "h1" | "h2" | "h3"; text: string }
    | { type: "p"; text: string }
    | { type: "ul"; items: string[] }
    | { type: "ol"; items: string[] }
  > = [];

  let listBuffer: string[] = [];
  let orderedListBuffer: string[] = [];

  const flushList = () => {
    if (listBuffer.length) {
      blocks.push({ type: "ul", items: listBuffer });
      listBuffer = [];
    }

    if (orderedListBuffer.length) {
      blocks.push({ type: "ol", items: orderedListBuffer });
      orderedListBuffer = [];
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushList();
      continue;
    }

    if (line.startsWith("- ") || line.startsWith("* ")) {
      listBuffer.push(line.slice(2).trim());
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      orderedListBuffer.push(line.replace(/^\d+\.\s/, "").trim());
      continue;
    }

    flushList();

    if (line.startsWith("# ")) {
      blocks.push({ type: "h1", text: cleanInlineMarkdown(line.slice(2).trim()) });
      continue;
    }

    if (line.startsWith("## ")) {
      blocks.push({ type: "h2", text: cleanInlineMarkdown(line.slice(3).trim()) });
      continue;
    }

    if (line.startsWith("### ")) {
      blocks.push({ type: "h3", text: cleanInlineMarkdown(line.slice(4).trim()) });
      continue;
    }

    blocks.push({ type: "p", text: cleanInlineMarkdown(line) });
  }

  flushList();

  return (
    <div className={className}>
      {blocks.map((block, index) => {
        if (block.type === "h1") {
          return (
            <h2 key={`h1-${index}`} className="mt-2 text-2xl font-bold text-[var(--foreground)] first:mt-0">
              {block.text}
            </h2>
          );
        }

        if (block.type === "h2") {
          return (
            <h3 key={`h2-${index}`} className="mt-6 text-lg font-bold text-[var(--foreground)] first:mt-0">
              {block.text}
            </h3>
          );
        }

        if (block.type === "h3") {
          return (
            <h4 key={`h3-${index}`} className="mt-5 text-base font-semibold text-[var(--foreground)] first:mt-0">
              {block.text}
            </h4>
          );
        }

        if (block.type === "ul") {
          return (
            <ul key={`ul-${index}`} className="mt-3 space-y-2 pl-5 text-sm leading-7 text-muted list-disc">
              {block.items.map((item, itemIndex) => (
                <li key={`${item}-${itemIndex}`}>{cleanInlineMarkdown(item)}</li>
              ))}
            </ul>
          );
        }

        if (block.type === "ol") {
          return (
            <ol key={`ol-${index}`} className="mt-3 space-y-2 pl-5 text-sm leading-7 text-muted list-decimal">
              {block.items.map((item, itemIndex) => (
                <li key={`${item}-${itemIndex}`}>{cleanInlineMarkdown(item)}</li>
              ))}
            </ol>
          );
        }

        return (
          <p key={`p-${index}`} className="mt-3 text-sm leading-7 text-muted first:mt-0">
            {block.text}
          </p>
        );
      })}
    </div>
  );
}

function cleanInlineMarkdown(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^\>\s?/, "")
    .trim();
}
