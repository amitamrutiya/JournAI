import {
  GitHubLogoIcon,
  LinkedInLogoIcon,
  TwitterLogoIcon,
} from '@radix-ui/react-icons';

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Brand */}
          <div className="flex items-center space-x-2">
            <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded">
              <span className="text-xs font-bold">J</span>
            </div>
            <span className="text-foreground font-semibold">JournAI</span>
          </div>

          {/* Copyright */}
          <p className="text-muted-foreground text-sm">
            © 2025 JournAI. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex space-x-4">
            <a
              href="https://x.com/AmitAmrutiya2"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Twitter"
            >
              <TwitterLogoIcon className="h-4 w-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/amitamrutiya/"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <LinkedInLogoIcon className="h-4 w-4" />
            </a>
            <a
              href="https://github.com/amitamrutiya"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <GitHubLogoIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
