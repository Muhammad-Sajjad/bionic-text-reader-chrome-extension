# Bionic Text Reader Chrome Extension

A Chrome extension that converts webpage text to bionic text format for faster reading. Bionic reading is a reading method where the first half of each word is highlighted to guide the eye through text more efficiently.

## Features

- Converts all text on a webpage to bionic format with a single click
- Preserves all website styling, layout, and functionality
- Toggle between normal and bionic text
- Works on any website

## How It Works

Bionic text highlights the first half of each word, which helps guide your eyes through text more efficiently. This extension:

1. Finds all text nodes on the current webpage
2. Converts each word to bionic format (first half bold, second half normal)
3. Preserves all HTML structure and styling
4. Allows toggling between normal and bionic text

## Installation

### Development Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/bionic-text-reader-chrome-extension.git
   cd bionic-text-reader-chrome-extension
   ```

2. Generate proper icon files:
   - The extension comes with placeholder icons in the `icons` folder
   - For better-looking icons, you can:
     - Open `icons/generate_icons.html` in a web browser
     - Right-click on each icon and save them with the appropriate names
     - Alternatively, use the SVG files provided and convert them to PNG
   - Required icon files:
     - `icon16.png` (16x16 pixels)
     - `icon48.png` (48x48 pixels)
     - `icon128.png` (128x128 pixels)
   - Optional active state icons (not currently used in the manifest):
     - `icon16-active.png` (16x16 pixels, active state)
     - `icon48-active.png` (48x48 pixels, active state)
     - `icon128-active.png` (128x128 pixels, active state)

3. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the extension directory

### Production Build and Deployment

1. Prepare the extension files:
   - Ensure all files are in place (manifest.json, background.js, content.js, icons)
   - Optionally minify JavaScript files for production

2. Create a ZIP file of the extension:
   ```
   zip -r bionic-text-reader.zip manifest.json background.js content.js icons/
   ```

3. Publish to the Chrome Web Store:
   - Go to the [Chrome Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
   - Sign up for a developer account if you don't have one (one-time $5 fee)
   - Click "New Item" and upload your ZIP file
   - Fill in the store listing information, including:
     - Description
     - Screenshots
     - Icon
     - Category (Productivity recommended)
   - Submit for review
   - Once approved, your extension will be available in the Chrome Web Store

## Usage

1. Install the extension from the Chrome Web Store or using the development installation steps
2. Navigate to any webpage
3. Click the Bionic Text Reader icon in your browser toolbar
4. The text on the page will be converted to bionic format
5. Click the icon again to revert to normal text

## Development

### Project Structure

- `manifest.json`: Extension configuration
- `background.js`: Handles extension icon clicks
- `content.js`: Contains the logic for converting text to bionic format
- `icons/`: Directory containing extension icons

### Customization

You can modify the bionic text conversion algorithm in `content.js` to adjust:
- The proportion of each word that gets highlighted
- The styling of the highlighted text
- Which elements get processed

## License

MIT License - See LICENSE file for details