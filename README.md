# Auto Tab Grouper

A Chrome extension that automatically groups tabs based on URL patterns and domain names with intelligent group management.

## Demo

![Auto Tab Grouper Demo](assets/demo.gif)


## Features

- **Automatic Tab Grouping**: Automatically groups tabs based on custom URL patterns
- **Custom Rules**: Create and manage custom grouping rules through the settings page
- **Domain-based Grouping**: Falls back to domain-based grouping when no custom rules match
- **Enable/Disable**: Toggle automatic grouping on/off
- **Manual Grouping**: Group all existing tabs with a single click
- **Smart Group Management**: Automatically collapses other groups when a new group is created or expanded
- **Tab Count Display**: Shows the number of tabs in each group title (e.g., "Social Media (5)")
- **Auto Focus**: Automatically switches focus to newly created tabs, even across windows
- **Special Page Protection**: Skips grouping for new tabs, settings pages, and other Chrome internal pages

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

### Smart Group Management

- **Auto-Collapse**: When you create a new group or expand an existing one, other groups automatically collapse
- **Focus Management**: New tabs automatically receive focus, even if they're grouped in different windows
- **Tab Counting**: Each group shows the total number of tabs in its title (e.g., "Social Media (5)")
- **Special Page Handling**: New tabs, settings pages, and Chrome internal pages are never grouped

### Custom Rules

1. Open the settings page by clicking "Open Settings" in the popup
2. Add new rules with custom names and URL patterns
3. Use regular expressions for URL patterns (e.g., `.*github\\.com.*`)
4. Save your settings to apply the new rules

### Group Behavior

- **Automatic Collapse**: Only the active group stays expanded, others collapse automatically
- **Manual Expansion**: Click any collapsed group to expand it and collapse others
- **Real-time Counts**: Tab counts update automatically as you open and close tabs
- **Cross-window Support**: Groups work across multiple Chrome windows


