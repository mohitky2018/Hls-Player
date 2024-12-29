# HLS Player
This is a only demonstration of a simple HLS player using HLS.js library. This player is not intended for production use, but rather as a starting point for developers who want to build their own custom player.

I've created a complete HTML file with vanilla JavaScript that includes:


## Audio Player Features:
- Play/Pause button
- Quality selection dropdown (Auto, 128k, 256k, 512k)
- Progress bar with seeking capability
- Time display showing current time and duration

## HLS Implementation:
- Uses HLS.js library for handling adaptive streaming
- Automatic quality switching in "Auto" mode
- Manual quality selection
- Error handling and recovery


## To use this player:
1. Save the code as an HTML file.
2. Make sure your m3u8 files are properly hosted.
3. Update the `loadSource('master.m3u8')` line with the correct path to your master playlist.
4. Open the HTML file in a modern browser.

The player will automatically attempt to use the best quality based on network conditions when in "Auto" mode, or you can manually select the desired quality.
