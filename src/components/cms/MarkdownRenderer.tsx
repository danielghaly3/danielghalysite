type MarkdownRendererProps = {
  content: string;
};

function inlineText(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`(.*?)`/g, "$1");
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const blocks = content.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);

  if (!blocks.length) return null;

  return (
    <div className="space-y-6 text-[17px] leading-[1.75] text-ash">
      {blocks.map((block, index) => {
        if (block.startsWith("### ")) {
          return (
            <h3 key={index} className="pt-4 font-display text-2xl font-semibold leading-tight text-ink">
              {inlineText(block.slice(4))}
            </h3>
          );
        }

        if (block.startsWith("## ")) {
          return (
            <h2 key={index} className="pt-6 font-display text-3xl font-semibold leading-tight text-ink">
              {inlineText(block.slice(3))}
            </h2>
          );
        }

        if (block.startsWith("# ")) {
          return (
            <h1 key={index} className="font-display text-4xl font-semibold leading-tight text-ink">
              {inlineText(block.slice(2))}
            </h1>
          );
        }

        if (block.startsWith("> ")) {
          return (
            <blockquote key={index} className="border-l-2 border-accent pl-5 font-display text-2xl text-ink">
              {inlineText(block.replace(/^>\s?/gm, ""))}
            </blockquote>
          );
        }

        if (block.split("\n").every((line) => line.trim().startsWith("- "))) {
          return (
            <ul key={index} className="list-disc space-y-2 pl-6">
              {block.split("\n").map((line) => (
                <li key={line}>{inlineText(line.replace(/^-\s?/, ""))}</li>
              ))}
            </ul>
          );
        }

        return <p key={index}>{inlineText(block)}</p>;
      })}
    </div>
  );
}
