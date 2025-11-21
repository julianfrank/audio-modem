# Design Document

## Overview

The Web Audio File Transfer system is a single-page HTML application that enables data transmission between devices using audio signals. The system uses the Web Audio API for signal generation and processing, bypassing noise cancellation by operating in the 4-8kHz frequency range with Frequency Shift Keying (FSK) modulation. The application supports both text and binary file transfer with error correction and integrity verification.

## Architecture

The system follows a modular architecture with clear separation between:

1. **UI Layer**: Handles user interaction, mode selection, and progress display
2. **Data Layer**: Manages data preparation, chunking, and reconstruction
3. **Encoding Layer**: Converts binary data to audio signals (emitter side)
4. **Decoding Layer**: Converts audio signals back to binary data (receiver side)
5. **Audio Layer**: Interfaces with Web Audio API for playback and recording

The application operates in two mutually exclusive modes:
- **Emitter Mode**: Encodes and transmits data via audio output
- **Receiver Mode**: Captures and decodes data from audio input

## Components and Interfaces

### 1. Mode Controller
**Responsibility**: Manages application mode and UI state transitions

**Interface**:
```javascript
class ModeController {
  setMode(mode: 'emitter' | 'receiver'): void
  getCurrentMode(): 'emitter' | 'receiver' | null
  lockMode(): void
  unlockMode(): void
}
```

### 2. Data Processor
**Responsibility**: Prepares data for transmission and reconstructs received data

**Interface**:
```javascript
class DataProcessor {
  prepareText(text: string): PreparedData
  prepareFile(file: File): Promise<PreparedData>
  chunkData(data: Uint8Array, chunkSize: number): Chunk[]
  reconstructData(chunks: Chunk[]): Uint8Array
  calculateChecksum(data: Uint8Array): number
  verifyChecksum(data: Uint8Array, checksum: number): boolean
}

interface PreparedData {
  type: 'text' | 'file'
  filename?: string
  data: Uint8Array
  checksum: number
}

interface Chunk {
  index: number
  total: number
  data: Uint8Array
  checksum: number
}
```

### 3. Audio Encoder
**Responsibility**: Converts binary data into FSK-modulated audio signals

**Interface**:
```javascript
class AudioEncoder {
  encode(chunks: Chunk[]): AudioBuffer
  generatePreamble(): Float32Array
  encodeChunk(chunk: Chunk): Float32Array
  generatePostamble(): Float32Array
}
```

**Encoding Scheme**:
- Bit 0: 4500 Hz carrier frequency
- Bit 1: 6500 Hz carrier frequency
- Baud rate: 100 bits per second (10ms per bit)
- Preamble: 500ms synchronization tone at 5500 Hz
- Postamble: 200ms silence

### 4. Audio Decoder
**Responsibility**: Converts FSK-modulated audio signals back to binary data

**Interface**:
```javascript
class AudioDecoder {
  startListening(): void
  stopListening(): void
  detectPreamble(audioData: Float32Array): boolean
  decodeChunk(audioData: Float32Array): Chunk | null
  onChunkReceived(callback: (chunk: Chunk) => void): void
  onTransmissionComplete(callback: () => void): void
}
```

**Decoding Approach**:
- Use Goertzel algorithm for frequency detection at 4500 Hz and 6500 Hz
- Sliding window analysis with 10ms windows
- Threshold-based bit decision
- Preamble detection triggers decoding state machine

### 5. Audio Player
**Responsibility**: Plays encoded audio through speakers

**Interface**:
```javascript
class AudioPlayer {
  play(audioBuffer: AudioBuffer): Promise<void>
  stop(): void
  getProgress(): number
  onProgressUpdate(callback: (progress: number) => void): void
}
```

### 6. Audio Recorder
**Responsibility**: Captures audio from microphone

**Interface**:
```javascript
class AudioRecorder {
  requestPermission(): Promise<boolean>
  startRecording(): void
  stopRecording(): void
  onAudioData(callback: (audioData: Float32Array) => void): void
}
```

### 7. Progress Tracker
**Responsibility**: Tracks and reports transmission/reception progress

**Interface**:
```javascript
class ProgressTracker {
  setTotal(total: number): void
  updateProgress(current: number): void
  getProgress(): { current: number, total: number, percentage: number }
  onUpdate(callback: (progress: ProgressInfo) => void): void
}

interface ProgressInfo {
  current: number
  total: number
  percentage: number
  bytesTransferred: number
}
```

## Data Models

### Transmission Frame Structure
```
[Preamble][Header][Chunk 0][Chunk 1]...[Chunk N][Postamble]

Preamble: 500ms @ 5500Hz
Header: 
  - Magic bytes (2 bytes): 0xAA 0x55
  - Data type (1 byte): 0x01=text, 0x02=file
  - Filename length (1 byte, 0 for text)
  - Filename (variable, UTF-8)
  - Total chunks (2 bytes)
  - Total data size (4 bytes)
  - Header checksum (2 bytes)

Chunk:
  - Chunk index (2 bytes)
  - Data length (1 byte, max 255)
  - Data (variable)
  - Chunk checksum (2 bytes)

Postamble: 200ms silence
```

### Bit Encoding
Each byte is transmitted LSB first with the following structure:
- Start bit (0)
- 8 data bits
- Parity bit (even parity)
- Stop bit (1)

Total: 11 bits per byte at 100 baud = 110ms per byte

## Error Handling

### Transmission Errors
1. **File Too Large**: Warn user if file exceeds 1MB (estimated 2+ hours transmission time)
2. **Audio Context Error**: Display error if Web Audio API is unavailable
3. **Playback Error**: Notify user if audio playback fails

### Reception Errors
1. **Microphone Permission Denied**: Display clear message with instructions
2. **Preamble Not Detected**: Timeout after 30 seconds of no signal
3. **Checksum Mismatch**: Mark chunk as corrupted, request retransmission (future enhancement)
4. **Incomplete Transmission**: Detect missing chunks and notify user

### Error Recovery
- Checksums at both header and chunk level enable corruption detection
- Future enhancement: Implement automatic retransmission protocol
- Current version: Notify user of errors and allow manual retry

## Testing Strategy

### Unit Testing
The implementation will use a lightweight testing approach focused on core logic:

1. **Data Processing Tests**
   - Test text and file preparation
   - Test chunking with various data sizes
   - Test data reconstruction from chunks
   - Test checksum calculation and verification

2. **Encoding/Decoding Tests**
   - Test bit encoding for known byte sequences
   - Test frequency generation for 0 and 1 bits
   - Test preamble and postamble generation
   - Test Goertzel algorithm frequency detection

3. **Error Handling Tests**
   - Test checksum mismatch detection
   - Test incomplete chunk handling
   - Test invalid header detection

### Property-Based Testing
The implementation will use a property-based testing library appropriate for JavaScript (such as fast-check) to verify universal properties:

- Each property-based test will run a minimum of 100 iterations
- Each test will be tagged with: `**Feature: web-audio-transfer, Property {number}: {property_text}**`
- Each correctness property will be implemented by a single property-based test


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Mode selection configures correct UI
*For any* selected mode (emitter or receiver), the UI should display the appropriate controls and hide inappropriate ones
**Validates: Requirements 1.2, 1.3**

### Property 2: Mode locking during operations
*For any* selected mode, once an operation begins, mode switching controls should be disabled until the operation completes
**Validates: Requirements 1.4**

### Property 3: Data preparation preserves content
*For any* text string or file content, preparing it for transmission should preserve the original data such that it can be reconstructed identically
**Validates: Requirements 2.2, 2.3**

### Property 4: Input priority follows recency
*For any* sequence of text and file inputs, the system should prioritize the most recently provided input
**Validates: Requirements 2.5**

### Property 5: Send button state reflects data validity
*For any* data preparation state, the send button should be enabled if and only if valid data is prepared
**Validates: Requirements 3.1**

### Property 6: Transmission lifecycle management
*For any* transmission in progress, the system should prevent new transmissions, display progress updates, and show completion notification when finished
**Validates: Requirements 3.3, 3.4, 3.5, 8.1**

### Property 7: Frequency range compliance
*For any* encoded data, the generated audio signal should contain frequency components only within the 4kHz to 8kHz range
**Validates: Requirements 4.1**

### Property 8: FSK encoding structure
*For any* encoded data, the audio signal should use two distinct carrier frequencies (one for bit 0, one for bit 1) within the specified range
**Validates: Requirements 4.2**

### Property 9: Encoded data completeness
*For any* encoded transmission, the audio signal should include synchronization markers, error correction codes, and checksums
**Validates: Requirements 4.3, 4.4, 4.5**

### Property 10: Preamble triggers decoding
*For any* audio input containing a valid synchronization marker, the decoder should transition to decoding state
**Validates: Requirements 5.3**

### Property 11: Checksum verification on decode
*For any* decoded data packet, the decoder should verify the checksum before accepting the data
**Validates: Requirements 5.4**

### Property 12: Encode-decode round trip
*For any* data (text or file), encoding it to audio and then decoding the audio should produce data identical to the original
**Validates: Requirements 5.5**

### Property 13: Text reception display and download
*For any* received text data, the system should both display it on screen and provide a download option
**Validates: Requirements 6.1, 6.2**

### Property 14: File reception with filename preservation
*For any* received file data, the system should trigger a download with the original filename preserved
**Validates: Requirements 6.3**

### Property 15: Multiple transmission independence
*For any* sequence of multiple transmissions, each should be handled independently without interference
**Validates: Requirements 6.5**

### Property 16: Reception progress display
*For any* active reception, the system should display real-time progress including percentage and bytes received, along with visual indicators
**Validates: Requirements 8.2, 8.4**

### Property 17: Error notification
*For any* error condition (checksum failure, permission denied, etc.), the system should display a clear error message
**Validates: Requirements 8.5**

### Property 18: Success confirmation
*For any* successfully completed operation, the system should display a clear success message
**Validates: Requirements 8.6**

## Implementation Notes

### Browser Compatibility
- Target modern browsers with Web Audio API support (Chrome 34+, Firefox 25+, Safari 14+)
- Use feature detection for Web Audio API and MediaDevices API
- Provide clear error messages for unsupported browsers

### Performance Considerations
- Chunk size of 255 bytes balances transmission speed with error resilience
- 100 baud rate is slow but reliable for acoustic transmission
- Consider using Web Workers for encoding/decoding to prevent UI blocking (future enhancement)

### Security Considerations
- File size limits prevent excessive memory usage
- No server-side component eliminates network security concerns
- All processing happens client-side in the browser sandbox

### Future Enhancements
1. Automatic retransmission on checksum failure
2. Adaptive baud rate based on signal quality
3. Multiple frequency channels for faster transmission
4. Compression for text and common file types
5. Visual waveform display during transmission/reception
