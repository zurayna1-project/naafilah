'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto bg-card border-t">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-6">
          {/* Zurayna Text */}
          <div className="text-center">
            <h2 className="font-serif text-2xl font-bold text-foreground">Zurayna</h2>
            <p className="text-sm text-muted-foreground mt-1">Ruang Pribadi untuk Kumpulan Puisi</p>
          </div>

          {/* Social Media Icons */}
          <div className="flex gap-6">
            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
              aria-label="Instagram"
            >
              <img 
                src="/icons/instagram.svg" 
                alt="Instagram" 
                className="w-6 h-6"
              />
            </a>

            {/* X / Twitter */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
              aria-label="X"
            >
              <img 
                src="/icons/x.svg" 
                alt="X" 
                className="w-6 h-6"
              />
            </a>

            {/* TikTok */}
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
              aria-label="TikTok"
            >
              <img 
                src="/icons/tiktok.svg" 
                alt="TikTok" 
                className="w-6 h-6"
              />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground font-serif">
            © {new Date().getFullYear()} Zurayna. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
