# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Lomaxia is a static French portfolio website for a web design agency specializing in showcase websites ("sites vitrines"). The site demonstrates both "Classic" and "Premium" project categories.

## Development

This is a vanilla HTML/CSS/JavaScript project with no build system. To preview:
- Open any HTML file directly in a browser
- Or use a local server: `python -m http.server 8000` then visit `http://localhost:8000`

## Architecture

**Pages** (all in root directory):
- `index.html` - Homepage with hero, services, stats, CTA sections
- `projects1.html` - Classic projects gallery
- `projects2.html` - Premium projects gallery
- `about.html` - About page with skills, process timeline, values
- `contact.html` - Contact form with FAQ section

**Styling** (`style.css`):
- CSS custom properties defined in `:root` for theming (colors, fonts, shadows)
- Typography: Playfair Display (headings) + Work Sans (body) via Google Fonts
- Mobile-first responsive design with breakpoint at 768px
- Organized by sections with comment headers (e.g., `/* ===== NAVIGATION ===== */`)

**JavaScript** (`main.js`):
- No external dependencies
- Features: smooth scroll, navbar shadow on scroll, animated counters, 3D tilt effect on `[data-tilt]` elements, parallax, magnetic buttons, scroll reveal animations, ripple effects
- Uses IntersectionObserver for scroll-triggered animations

## Key Patterns

- Navigation: Fixed navbar with `.nav-link.active` for current page, `.nav-link-cta` for CTA button
- Layout: `.container` class for max-width centering, CSS Grid for layouts
- Components use `data-tilt` attribute for 3D hover effects
- Form handling in `contact.html` has inline JavaScript (currently simulates submission)
- Project images use placeholder divs - real images go in `/images/projets/`
