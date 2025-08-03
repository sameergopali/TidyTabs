# Auto Tab Grouper

A Chrome extension that automatically groups tabs based on URL patterns and domain names.

## Features

- **Automatic Tab Grouping**: Automatically groups tabs based on custom URL patterns
- **Custom Rules**: Create and manage custom grouping rules through the settings page
- **Domain-based Grouping**: Falls back to domain-based grouping when no custom rules match
- **Enable/Disable**: Toggle automatic grouping on/off
- **Manual Grouping**: Group all existing tabs with a single click

## Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the folder containing the extension files
5. The extension should now appear in your extensions list

## Usage

### Basic Usage

1. Click the extension icon in your Chrome toolbar
2. Use the toggle switch to enable/disable automatic grouping
3. Click "Group All Tabs Now" to manually group existing tabs
4. Click "Open Settings" to configure custom grouping rules

### Custom Rules

1. Open the settings page by clicking "Open Settings" in the popup
2. Add new rules with custom names and URL patterns
3. Use regular expressions for URL patterns (e.g., `.*github\\.com.*`)
4. Save your settings to apply the new rules

### Default Rules

The extension comes with three default rules:

- **Social Media**: Groups Facebook, Twitter, Instagram, and LinkedIn
- **Development**: Groups GitHub, StackOverflow, and MDN
- **News**: Groups news sites and major news outlets

## Files

- `manifest.json`: Extension configuration
- `background.js`: Service worker that handles tab grouping logic
- `popup.html` & `popup.js`: Extension popup interface
- `options.html` & `options.js`: Settings page for custom rules

## Permissions

- `tabs`: Required to access and group tabs
- `storage`: Required to save user settings and rules
- `host_permissions`: Required to access tab URLs for pattern matching

## Troubleshooting

- If tabs aren't grouping automatically, check that the extension is enabled
- If custom rules aren't working, verify your regular expressions are correct
- Try clicking "Group All Tabs Now" to manually group existing tabs
- Check the browser console for any error messages

## Development

To modify the extension:

1. Make your changes to the source files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Test your changes

## License

This project is open source and available under the MIT License. 