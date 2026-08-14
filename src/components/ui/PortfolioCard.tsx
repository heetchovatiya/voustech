export function PortfolioCard({
  title,
  categoryLabel,
  summary,
  imageUrl,
  projectUrl,
  note,
  onClick,
}: {
  title: string;
  categoryLabel: string;
  summary: string;
  imageUrl?: string | null;
  projectUrl?: string | null;
  note?: string;
  onClick?: () => void;
}) {
  const handleMainClick = () => {
    if (projectUrl) {
      window.open(projectUrl, "_blank", "noopener,noreferrer");
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <article
      className="group flex flex-col rounded-sm border border-line bg-surface transition-all duration-200 hover:-translate-y-0.5 hover:border-tech-blue hover:shadow-md overflow-hidden"
    >
      {/* Top Banner / Image (Links to Live Project URL if available) */}
      <div
        onClick={handleMainClick}
        className="cursor-pointer"
        title={projectUrl ? `Visit ${title}` : "View Project"}
      >
        {imageUrl ? (
          <div className="aspect-[4/3] w-full overflow-hidden border-b border-line bg-surface">
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = "none";
              }}
            />
          </div>
        ) : (
          <div
            aria-hidden="true"
            className="flex aspect-[4/3] items-center justify-center border-b border-line bg-tech-blue/10 font-mono text-label text-tech-blue transition-colors duration-150 group-hover:bg-tech-blue/20"
          >
            {categoryLabel}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <p className="font-mono text-label uppercase tracking-[0.1em] text-tech-blue">
          {categoryLabel}
        </p>

        <h3
          onClick={handleMainClick}
          className="mt-2 text-body-lg font-display font-semibold transition-colors group-hover:text-tech-blue cursor-pointer"
        >
          {title}
        </h3>

        <p className="mt-2 flex-1 text-body-sm text-ink-muted">{summary}</p>

        {/* Action Buttons */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line/60 pt-3">
          {projectUrl && (
            <a
              href={projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-body-sm font-semibold text-tech-blue hover:underline flex items-center gap-1"
            >
              <span>Live Site</span>
              <span>↗</span>
            </a>
          )}
          {onClick && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              className="text-body-sm font-semibold text-ink-muted transition-colors hover:text-tech-blue ml-auto"
            >
              View Details &rarr;
            </button>
          )}
        </div>

        {note && <p className="mt-2 text-label text-ink-muted/80">{note}</p>}
      </div>
    </article>
  );
}
