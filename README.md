# Web Audio File Transfer

Transfer files and text using sound waves through your browser.

## Live Demo

The application is automatically deployed to GitHub Pages: [View Live Demo](https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/)

## Deployment

This project uses GitHub Actions for automatic deployment to GitHub Pages.

### Setup Instructions

1. **Enable GitHub Pages**:
   - Go to your repository Settings → Pages
   - Under "Source", select "GitHub Actions"
   - Save the configuration

2. **Automatic Deployment**:
   - Every push to the `main` branch automatically triggers deployment
   - The workflow copies `audio-transfer.html` to `index.html` for deployment
   - View deployment status in the Actions tab

3. **Manual Deployment**:
   - Go to Actions tab
   - Select "Deploy to GitHub Pages" workflow
   - Click "Run workflow" button
   - Select the branch and click "Run workflow"

### Deployment Status

![Deployment Status](https://github.com/YOUR-USERNAME/YOUR-REPO-NAME/actions/workflows/deploy.yml/badge.svg)

## Local Development

Simply open `audio-transfer.html` in a web browser to run the application locally.

## Features

- 📤 **Emitter Mode**: Send text or files as audio signals
- 📥 **Receiver Mode**: Receive and decode audio transmissions
- 🎵 **Audio Visualization**: Real-time waveform and level displays
- ✅ **Error Detection**: CRC16 checksums for data integrity
- 📊 **Progress Tracking**: Visual feedback during transmission

## How It Works

The application uses the Web Audio API to encode data into audio frequencies that can be transmitted through speakers and received through a microphone. Data is chunked, checksummed, and transmitted using frequency-shift keying (FSK) modulation.

## Browser Compatibility

Works in modern browsers that support:
- Web Audio API
- MediaStream API
- File API

## License

MIT License - feel free to use and modify as needed.
