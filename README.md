# TidyTabs

A Chrome extension that automatically groups tabs based on URL patterns and domain names with intelligent group management.

## Demo

![Auto Tab Grouper Demo](assets/demo.gif)


## Smart Group Management

- **Auto-Collapse**: When you create a new group or expand an existing one, other groups automatically collapse
- **Focus Management**: New tabs automatically receive focus, even if they're grouped in different windows
- **Tab Counting**: Each group shows the total number of tabs in its title (e.g., "Social Media (5)")
- **Special Page Handling**: New tabs, settings pages, and Chrome internal pages are never grouped

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

### Group Behavior

- **Automatic Collapse**: Only the active group stays expanded, others collapse automatically
- **Manual Expansion**: Click any collapsed group to expand it and collapse others
- **Real-time Counts**: Tab counts update automatically as you open and close tabs
- **Cross-window Support**: Groups work across multiple Chrome windows


