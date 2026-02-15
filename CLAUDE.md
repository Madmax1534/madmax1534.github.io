# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Portfolio website for a French web design agency specializing in showcase websites ("sites vitrines"). All user-facing text is in French. The brand name displayed in the logo is "Portfolio."

## Development

Vanilla HTML/CSS/JavaScript with no build system or dependencies. To preview:
- `python -m http.server 8000` then visit `http://localhost:8000`

## Architecture

The repo has two levels: the **portfolio site** (root) and **demo client sites** (`site1/`, `site2/`).

### Portfolio site (root)
- `index.html` — Homepage (hero, services, stats, CTA)
- `projects1.html` — Projects gallery (links to demo sites)
- `about.html` — About page (skills with animated progress bars, process timeline, values)
- `contact.html` — Contact form + FAQ (form submission is simulated via inline `<script>`)
- `style.css` — All portfolio styles, organized by `/* ===== SECTION ===== */` comment blocks
- `main.js` — Shared JS (smooth scroll, navbar, counters, tilt, parallax, magnetic buttons, scroll reveal, ripple)

### Demo client sites
- `site1/` — "Hair Studio" salon site (pages: index, galerie, services, contact)
- `site2/` — "Bella Napoli" restaurant site (pages: index, galerie, menu, contact)

Each has its own `css/style.css`, `js/main.js`, and `images/` directory. They are self-contained and independent from the root portfolio styles/scripts.

### Known path issues
- Root HTML pages load `<script src="js/main.js">` but the file is at `main.js` in root (no `js/` directory at root).
- In `projects1.html`, the site1 link uses `../site1/index.html` (incorrect relative path from root) while site2 correctly uses `site2/index.html`.

## Theming & Styling

- **Dark futuristic theme** with glassmorphism effects (`--glass`, `--glass-border` variables)
- CSS custom properties in `:root` for colors (`--accent-primary: #00d4ff`, gradient accents), fonts, shadows, glow effects, transitions
- Typography: Playfair Display (headings) + Work Sans (body) via Google Fonts
- Responsive breakpoint at 768px

## Key Patterns

- Navigation: Fixed navbar, `.nav-link.active` marks current page (set manually per HTML file), `.nav-link-cta` for the Contact button
- Layout: `.container` for max-width centering, CSS Grid for page layouts
- Interactive effects: `data-tilt` attribute on elements enables 3D hover via JS; `data-count` on `.stat-number` triggers animated counters; `data-progress` on `.skill-progress` triggers skill bar animation
- Project images: real images go in `images/projets/`, placeholder divs (with `.placeholder-image`) used for unfilled slots
- Each root page duplicates the full navbar and footer markup (no templating system)
