# Fonts

This directory contains the font files used in the application.

## Cairo Font

The main font used in this application is Cairo, a contemporary Arabic and Latin typeface family.
We use it from Google Fonts, but you can also include local copies here for offline use.

To add local font files:

1. Download Cairo font files (woff2, woff, ttf) from Google Fonts or another source
2. Create a subdirectory here (e.g., `/cairo`)
3. Place font files in the subdirectory
4. Update the CSS in `src/assets/css/style.css` to use local fonts

## Font Weights

The following weights are used in the application:

- 300 (Light)
- 400 (Regular)
- 500 (Medium)
- 600 (SemiBold)
- 700 (Bold)

## Using Custom Fonts

To use a different font, update the following files:

1. `public/index.html`: Update the Google Fonts link
2. `src/assets/css/style.css`: Update the font-family declarations
3. `tailwind.config.js`: Update the fontFamily configuration