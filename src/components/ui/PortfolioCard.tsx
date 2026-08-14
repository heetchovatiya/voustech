export function PortfolioCard({
  title,
  categoryLabel,
  summary,
  note,
  onClick,
}: {
  title: string;
  categoryLabel: string;
  summary: string;
  note?: string;
  onClick?: () => void;
}) {
  return (
    <article
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`group flex flex-col rounded-sm border border-line bg-surface transition-all duration-200 hover:-translate-y-0.5 hover:border-tech-blue hover:shadow-md ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
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
        <h3 className="mt-2 text-body-lg font-display font-semibold transition-colors group-hover:text-tech-blue">
          {title}
        </h3>
        <p className="mt-2 flex-1 text-body-sm text-ink-muted">{summary}</p>

        <div className="mt-4 flex items-center justify-between border-t border-line/60 pt-3">
          <span className="text-body-sm font-semibold text-tech-blue transition-colors group-hover:text-deep-ocean">
            View Project Details &rarr;
          </span>
        </div>

        {note && <p className="mt-2 text-label text-ink-muted/80">{note}</p>}
      </div>
    </article>
  );
}
