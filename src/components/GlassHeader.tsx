const LINKS = [
  { id: "claudemd", label: "CLAUDE.md生成", href: "https://ch-ragge.github.io/claudemd-generator/" },
  { id: "rate", label: "単価診断", href: "https://ch-ragge.github.io/se-rate-simulator/" },
  { id: "stack", label: "技術診断", href: "https://ch-ragge.github.io/tech-stack-advisor/" },
] as const;

type ToolId = (typeof LINKS)[number]["id"];

export default function GlassHeader({ current }: { current: ToolId }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-12 bg-white/70 backdrop-blur-md">
      <nav
        aria-label="サイト内ナビゲーション"
        className="mx-auto flex h-full max-w-5xl items-center justify-between px-4 sm:px-6"
      >
        <a
          href="https://ch-ragge.github.io/blog/"
          className="text-xs font-semibold tracking-wide text-ink"
        >
          らがSE
        </a>
        <div className="flex items-center gap-4 text-xs sm:gap-6">
          {LINKS.map((link) =>
            link.id === current ? (
              <span key={link.id} aria-current="page" className="font-medium text-ink">
                {link.label}
              </span>
            ) : (
              <a
                key={link.id}
                href={link.href}
                className="text-subtle transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            )
          )}
          <a
            href="https://ch-ragge.github.io/blog/"
            className="text-subtle transition-colors hover:text-ink"
          >
            ブログ
          </a>
        </div>
      </nav>
    </header>
  );
}
