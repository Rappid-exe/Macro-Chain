import {
  FOOTER_TAGLINE,
  FOOTER_LINK_GROUPS,
  SOCIAL_LINKS,
  FOOTER_COPYRIGHT,
  FOOTER_LEGAL_LINKS,
} from "@/lib/constants";
import type { SocialLink } from "@/lib/types";

function SocialIcon({ platform }: { platform: SocialLink["platform"] }) {
  switch (platform) {
    case "twitter":
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
          <path d="M4 20l6.768 -6.768" />
          <path d="M20 4l-7.364 7.364" />
        </svg>
      );
    case "linkedin":
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      );
    case "github":
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
      );
  }
}

export default function FooterSection() {
  return (
    <footer
      aria-label="Site footer"
      className="bg-bg-primary border-t border-border"
    >
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Main three-column grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Left column: Logo + Tagline */}
          <div>
            <p className="text-lg font-semibold text-text-primary">
              Macro-Chain
            </p>
            <p className="mt-2 text-sm text-text-secondary">{FOOTER_TAGLINE}</p>
          </div>

          {/* Centre column: Navigation link groups */}
          <div className="flex gap-12">
            {FOOTER_LINK_GROUPS.map((group) => (
              <div key={group.heading}>
                <h3 className="text-sm font-semibold text-text-primary">
                  {group.heading}
                </h3>
                <ul className="mt-3 space-y-2">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-text-secondary transition-colors hover:text-signal-green"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Right column: Social icons */}
          <div className="flex items-start gap-4 md:justify-end">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.platform}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.ariaLabel}
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-text-secondary transition-colors hover:text-signal-green"
              >
                <SocialIcon platform={social.platform} />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center gap-4 border-t border-border pt-8 sm:flex-row sm:justify-between">
          <p className="text-sm text-text-secondary">{FOOTER_COPYRIGHT}</p>
          <div className="flex gap-6">
            {FOOTER_LEGAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-text-secondary transition-colors hover:text-signal-green"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
