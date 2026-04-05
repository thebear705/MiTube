# MiTube

A Chrome extension that enhances your YouTube experience with powerful features to help you manage your playlist video feed and other quality of life features.

## Features

### Playlist Features
- **Playlist Total Duration** - Shows cumulative duration of all videos in a playlist
- **Playlist End Time** - Displays when the playlist will finish playing

### Hide Shorts
Hides YouTube Shorts from multiple locations:
- Navigation sidebar
- Homepage feed
- Search results (shelf sections)
- Search results (individual videos disguised as normal videos)
- Shorts filter chip in the search bar
- Shorts filter option in the Filters popup
- Shorts tab on creator channel pages
- Reel shelf on creator channel pages

### UI & Theme
- Light, Dark, and System theme support
- Persistent settings (settings are saved and restored)
- Expandable/collapsible settings sections

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/thebear705/MiTube.git
   ```

2. Open Chrome and navigate to `chrome://extensions`

3. Enable **Developer mode** (toggle in the top right corner)

4. Click **Load unpacked**

5. Select the `MiTube/src` directory

## Development

The extension uses:
- Chrome Extension Manifest V3
- JavaScript/HTML/CSS for popup UI
- Content scripts for YouTube page interaction
- Chrome Storage API for settings persistence

### Project Structure
```
MiTube/
├── src/
│   ├── manifest.json           # Extension manifest
│   ├── background.js           # Background service worker
│   ├── content/
│   │   ├── content.js          # Main content script
│   │   └── loader.js          # Content loader
│   ├── features/
│   │   ├── playlist_duration.js    # Playlist duration feature
│   │   ├── playlist_end_time.js   # Playlist end time feature
│   │   └── hide_shorts.js         # Hide shorts feature
│   ├── popup/
│   │   ├── popup.html         # Popup UI
│   │   ├── popup.css          # Popup styling
│   │   └── popup.js           # Popup logic
│   ├── utils/
│   │   ├── constants.js       # Shared constants
│   │   ├── dom.js            # DOM utilities
│   │   ├── storage.js        # Storage management
│   │   └── time_utils.js     # Time utilities
│   └── icons/                 # Extension icons
├── tests/                     # Test files
└── README.md                  # This file
```

## Planned Fetaures
- Video Player
    - Add next button when Video Player is Fullscreen
    - End Time 
    - Mini Player Button
    - Show Time Left



## Reloading the Extension

After making changes to the source code:
1. Go to `chrome://extensions`
2. Click the **Reload** button on the MiTube extension card

## License

MIT
