export default function SiteFooter() {
  return (
    <footer className="bg-surface py-16">
      <div className="mx-auto max-w-5xl px-6">
        <nav
          aria-label="フッターナビゲーション"
          className="flex flex-wrap gap-x-6 gap-y-2 text-xs"
        >
          <a href="https://ch-ragge.github.io/blog/" className="text-subtle hover:text-ink">
            ブログ
          </a>
          <a
            href="https://ch-ragge.github.io/claudemd-generator/"
            className="text-subtle hover:text-ink"
          >
            CLAUDE.mdジェネレーター
          </a>
          <a
            href="https://ch-ragge.github.io/se-rate-simulator/"
            className="text-subtle hover:text-ink"
          >
            単価シミュレーター
          </a>
          <a
            href="https://ch-ragge.github.io/tech-stack-advisor/"
            className="text-subtle hover:text-ink"
          >
            技術スタック診断
          </a>
          <a href="https://ch-ragge.github.io/blog/privacy" className="text-subtle hover:text-ink">
            プライバシーポリシー
          </a>
          <a href="https://ch-ragge.github.io/blog/contact" className="text-subtle hover:text-ink">
            お問い合わせ
          </a>
        </nav>
        <p className="mt-8 text-xs text-subtle">&copy; 2026 らがSE</p>
      </div>
    </footer>
  );
}
