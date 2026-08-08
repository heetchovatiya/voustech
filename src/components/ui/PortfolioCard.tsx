export function PortfolioCard({
  title,
  categoryLabel,
  summary,
  note,
}: {
  title: string;
  categoryLabel: string;
  summary: string;
  note?: string;
}) {
  return (
    <article className="group flex flex-col rounded-sm border border-line bg-surface transition-colors duration-150 hover:border-tech-blue">
      <div
        aria-hidden="true"
        className="flex aspect-[4/3] items-center justify-center border-b border-line bg-tech-blue/10 font-mono text-label text-tech-blue transition-colors duration-150 group-hover:bg-tech-blue/20"
      >
        {categoryLabel}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="font-mono text-label uppercase tracking-[0.1em] text-tech-blue">
          {categoryLabel}
        </p>
        <h3 className="mt-2 text-body-lg font-display font-semibold">{title}</h3>
        <p className="mt-2 flex-1 text-body-sm text-ink-muted">{summary}</p>
        {note && <p className="mt-3 text-label text-ink-muted/80">{note}</p>}
      </div>
    </article>
  );
}
