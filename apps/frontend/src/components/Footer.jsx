import React from "react";
import Logo from "./ui/Logo";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border py-8 px-4 md:px-6 lg:px-8 text-text-muted text-[13px] bg-background/50">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left: Brand and description */}
        <div>
          <Logo size="sm" showText={true} showSubtext={true} />
        </div>

        {/* Center: Links */}
        <div className="flex flex-wrap items-center gap-5 text-[12px]">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-text-primary transition-colors"
          >
            GitHub
          </a>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="hover:text-text-primary transition-colors"
          >
            Documentation
          </a>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="hover:text-text-primary transition-colors"
          >
            Roadmap
          </a>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="hover:text-text-primary transition-colors"
          >
            API
          </a>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="hover:text-text-primary transition-colors"
          >
            Status
          </a>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="hover:text-text-primary transition-colors"
          >
            Privacy
          </a>
        </div>

        {/* Right: Version and Copyright */}
        <div className="flex flex-wrap items-center gap-4 text-[12px] text-text-muted/80">
          <span className="text-text-muted/60">Version 1.0.0</span>
          <span>Built by Madhav</span>
          <span>© 2026 Deployr</span>
        </div>
      </div>
    </footer>
  );
}
