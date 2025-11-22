# Design Document

## Overview

The Frequency Synchronization feature extends the Web Audio File Transfer system with automatic frequency calibration capabilities. This enhancement addresses hardware variations and frequency drift by allowing the Receiver to detect the exact frequencies being transmitted by the Emitter. The system uses FFT-based spectrum analysis to identify peak frequencies during a calibration phase, then applies these detected values to the existing Audio Decoder for improved reliability.

## Architecture

The synchronization feature integrates with the existing architecture by adding:

1. **Sync Controller**: Manages synchronization state and coordinates between UI, calibration signal generation, and frequency detection
2. **Calibration Signal Generator**: Produces repeating sequences of preamble, bit 0, and bit 1 tones for frequency detection
3. **Spectrum Analyzer**: Performs FFT analysis on incoming audio to identify peak frequencies
4. **Frequency Detector**: Identifies and validates the three calibration frequencies from spectrum data
5. **Decoder Configurator**: Updates the Audio Decoder with detected frequency values

The feature operates in two modes that mirror the existing emitter/receiver architecture:
- **Sync Transmit Mode**: Emitter broadcasts calibration signals in a continuous loop
- **Sync Listen Mode**: Receiver analyzes audio spectrum to detect and extract frequency values

## Components and Interfaces

### 1. Sync Controller
**Responsibility**: Manages synchronization state machine and coordinates sync operations

**Interface**:
```javascript
class SyncController {
  startEmitterSync(): void
  stopEmitterSync(): void
  startReceiverSync(): Promise<void>
  stopReceiverSync(): void
  getSyncState(): SyncState
  onStateChange(callback: (state: SyncState) => void): void
  onFrequenciesDetected(callback: (frequencies: DetectedFrequencies) => void): void
}

enum SyncState {
  IDLE = 'idle',
  TRANSMITTING = 'transmitting',
  LISTENING = 'listening',
  DETECTED = 'detected',
  ERROR = 'error'
}

interface DetectedFrequencies {
  preamble: number
  bit0: number
  bit1: number
  confidence: number
}
```

### 2. Calibration Signal Generator
**Responsibility**: Generates continuous calibration tone sequences for frequency detection

**Interface**:
```javascript
class CalibrationSignalGenerator {
  start(): void
  stop(): void
  generateCalibrationSequence(): AudioBuffer
  isTransmitting(): boolean
}
```

**Calibration Sequence**:
- Preamble tone: 2000ms at configured preamble frequency (default 5500 Hz)
- Silence: 500ms
- Bit 0 tone: 2000ms at configured bit 0 frequency (default 4500 Hz)
- Silence: 500ms
- Bit 1 tone: 2000ms at configured bit 1 frequency (default 6500 Hz)
- Silence: 500ms
- Loop continuously until stopped

### 3. Spectrum Analyzer
**Responsibility**: Performs real-time FFT analysis on audio input

**Interface**:
```javascript
class SpectrumAnalyzer {
  constructor(audioContext: AudioContext, fftSize: number)
  connect(sourceNode: AudioNode): void
  disconnect(): void
  getFrequencyData(): Float32Array
  getFrequencyBins(): number[]
  frequencyToIndex(frequency: number): number
  indexToFrequency(index: number): number
}
```

**FFT Configuration**:
- FFT Size: 8192 samples (provides ~5.4 Hz resolution at 44.1kHz sample rate)
- Window: Hanning window (built into AnalyserNode)
- Update Rate: 100ms intervals
- Frequency Range: 4000 Hz to 8000 Hz (focus on transmission band)

### 4. Frequency Detector
**Responsibility**: Identifies and validates frequency peaks from spectrum data

**Interface**:
```javascript
class FrequencyDetector {
  detectPeaks(spectrumData: Float32Array, minFreq: number, maxFreq: number): Peak[]
  identifyCalibrationFrequencies(peaks: Peak[]): DetectedFrequencies | null
  validateFrequencies(frequencies: DetectedFrequencies): boolean
  calculateConfidence(peaks: Peak[]): number
}

interface Peak {
  frequency: number
  magnitude: number
  index: number
}
```

**Detection Algorithm**:
1. Find all local maxima in spectrum data within 4-8kHz range
2. Sort peaks by magnitude (strongest first)
3. Select top 3 peaks as candidates
4. Validate minimum separation (500 Hz between any two peaks)
5. Classify peaks by frequency order: lowest = bit 0, middle = preamble, highest = bit 1
6. Calculate confidence score based on peak magnitude and separation
7. Require confidence > 0.7 for successful detection

### 5. Decoder Configurator
**Responsibility**: Updates Audio Decoder with detected frequencies

**Interface**:
```javascript
class DecoderConfigurator {
  updateFrequencies(decoder: AudioDecoder, frequencies: DetectedFrequencies): void
  getActiveFrequencies(): DetectedFrequencies
  resetToDefaults(): void
  persistFrequencies(frequencies: DetectedFrequencies): void
  loadPersistedFrequencies(): DetectedFrequencies | null
}
```

### 6. Sync UI Manager
**Responsibility**: Manages sync-related UI elements and visualizations

**Interface**:
```javascript
class SyncUIManager {
  showSyncButton(mode: 'emitter' | 'receiver'): void
  hideSyncButton(): void
  updateSyncButtonState(state: SyncState): void
  displayFrequencySpectrum(spectrumData: Float32Array): void
  highlightDetectedPeaks(peaks: Peak[]): void
  displayDetectedFrequencies(frequencies: DetectedFrequencies): void
  showSyncError(error: SyncError): void
  showSyncSuccess(): void
}

interface SyncError {
  type: 'permission' | 'timeout' | 'validation' | 'low_signal'
  message: string
  suggestions: string[]
}
```

## Data Models

### Frequency Configuration
```javascript
interface FrequencyConfig {
  preamble: number      // Default: 5500 Hz
  bit0: number          // Default: 4500 Hz
  bit1: number          // Default: 6500 Hz
  source: 'default' | 'detected' | 'manual'
  timestamp: number     // When configuration was set
}
```

### Spectrum Analysis Result
```javascript
interface SpectrumAnalysisResult {
  timestamp: number
  peaks: Peak[]
  averageNoiseFloor: number
  signalToNoiseRatio: number
  detectedFrequencies: DetectedFrequencies | null
}
```

### Sync Session
```javascript
interface SyncSession {
  sessionId: string
  mode: 'emitter' | 'receiver'
  startTime: number
  endTime: number | null
  state: SyncState
  result: DetectedFrequencies | null
  error: SyncError | null
}
```

## Error Handling

### Emitter Sync Errors
1. **Audio Context Error**: Display error if Web Audio API fails to initialize
2. **Playback Error**: Notify user if calibration signal playback fails
3. **Browser Compatibility**: Warn if browser doesn't support required APIs

### Receiver Sync Errors
1. **Microphone Permission Denied**: Display clear message with instructions to grant permission
2. **Detection Timeout**: Stop listening after 30 seconds, suggest increasing volume or moving closer
3. **Insufficient Frequency Separation**: Continue listening, display warning about signal quality
4. **Low Signal Level**: Warn user when input amplitude is below threshold (-60 dB)
5. **No Peaks Detected**: Suggest checking if emitter is transmitting and devices are close enough

### Error Recovery
- All sync errors are non-fatal and allow retry
- Previous frequency configuration is preserved on sync failure
- User can manually stop sync at any time without affecting normal operation
- Default frequencies are always available as fallback

## Testing Strategy

### Unit Testing

1. **Calibration Signal Generation Tests**
   - Test calibration sequence structure (tone durations, silence gaps)
   - Test frequency accuracy of generated tones
   - Test continuous looping behavior

2. **Spectrum Analysis Tests**
   - Test FFT bin calculation and frequency mapping
   - Test peak detection with known frequency inputs
   - Test noise floor calculation

3. **Frequency Detection Tests**
   - Test peak identification with synthetic spectrum data
   - Test frequency validation (minimum separation)
   - Test confidence calculation
   - Test classification of peaks into preamble/bit0/bit1

4. **Decoder Configuration Tests**
   - Test frequency update propagation to decoder
   - Test persistence and loading of frequency configuration
   - Test fallback to defaults

### Property-Based Testing

The implementation will use fast-check for JavaScript property-based testing:

- Each property-based test will run a minimum of 100 iterations
- Each test will be tagged with: `**Feature: frequency-sync, Property {number}: {property_text}**`
- Each correctness property will be implemented by a single property-based test

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Mode-appropriate sync button visibility
*For any* application mode (emitter or receiver), the sync button should be visible in the interface for that mode
**Validates: Requirements 1.1, 3.1**

### Property 2: Sync initiation triggers calibration transmission
*For any* emitter state, clicking the sync button should transition the system to transmitting calibration signals
**Validates: Requirements 1.2**

### Property 3: Calibration signal structure
*For any* generated calibration signal, it should contain the sequence of preamble, bit 0, and bit 1 frequencies in the correct order with proper timing
**Validates: Requirements 1.3, 1.4**

### Property 4: Button state reflects sync state
*For any* sync state (idle, transmitting, listening), the sync button should display the appropriate label and functionality (start sync or stop sync)
**Validates: Requirements 1.5, 2.1, 3.5, 6.1**

### Property 5: Stop sync terminates calibration
*For any* active calibration transmission, clicking stop should immediately cease transmission and restore the initial button state
**Validates: Requirements 2.2, 2.3**

### Property 6: Sync completion restores normal mode
*For any* completed sync operation (success or manual stop), the system should re-enable normal transmission or reception functionality
**Validates: Requirements 2.4, 9.3**

### Property 7: Microphone permission request on receiver sync
*For any* receiver state without microphone permission, clicking sync should trigger a permission request
**Validates: Requirements 3.2**

### Property 8: Permission grant enables listening
*For any* receiver state where microphone permission is granted, the system should begin listening for calibration signals and analyzing the spectrum
**Validates: Requirements 3.3, 3.4**

### Property 9: Peak detection identifies top frequencies
*For any* audio spectrum data in the 4-8kHz range, the analyzer should identify the three strongest frequency peaks
**Validates: Requirements 4.1**

### Property 10: Peak classification by frequency order
*For any* three detected frequency peaks, they should be classified as bit 0 (lowest), preamble (middle), and bit 1 (highest)
**Validates: Requirements 4.2**

### Property 11: Frequency separation validation
*For any* set of three detected frequencies, they should be validated to have minimum 500 Hz separation between any two frequencies
**Validates: Requirements 4.3, 8.3**

### Property 12: Successful detection updates decoder
*For any* validated frequency set, the decoder configuration should be updated with the detected preamble, bit 0, and bit 1 frequencies
**Validates: Requirements 4.4, 7.1, 7.2, 7.3**

### Property 13: Detection completion displays frequencies
*For any* successful frequency detection, the UI should display all three detected frequency values
**Validates: Requirements 4.5, 5.3, 5.4, 5.5, 5.6**

### Property 14: Stop listening terminates spectrum analysis
*For any* active listening state, clicking stop should immediately cease listening and restore the initial button state
**Validates: Requirements 6.2, 6.3**

### Property 15: Failed sync preserves previous configuration
*For any* sync attempt that fails or is manually stopped without successful detection, the previous frequency configuration should remain unchanged
**Validates: Requirements 6.4**

### Property 16: Frequency persistence for session
*For any* successfully detected frequencies, they should be persisted for the current session and used for subsequent decoding operations
**Validates: Requirements 7.4, 7.5**

### Property 17: Permission denial shows error
*For any* microphone permission denial during sync, an error message explaining the permission requirement should be displayed
**Validates: Requirements 8.1**

### Property 18: Sync timeout triggers notification
*For any* sync listening operation that exceeds 30 seconds without successful detection, the system should notify the user and stop listening
**Validates: Requirements 8.2**

### Property 19: Low signal warning
*For any* audio input with amplitude below threshold during sync, a warning message should be displayed suggesting volume increase or closer proximity
**Validates: Requirements 8.4**

### Property 20: Error messages include suggestions
*For any* sync error state, the error message should include actionable suggestions for resolving the issue
**Validates: Requirements 8.5**

### Property 21: Sync mode disables normal controls
*For any* active sync operation (transmitting or listening), normal transmission or reception controls should be disabled
**Validates: Requirements 9.1, 9.2**

### Property 22: Default frequencies for backward compatibility
*For any* system state where sync has not been performed, the decoder should use default frequency values (4500 Hz, 5500 Hz, 6500 Hz)
**Validates: Requirements 9.4**



## Implementation Notes

### FFT Analysis Details
- Use Web Audio API's AnalyserNode for real-time spectrum analysis
- FFT size of 8192 provides good frequency resolution (~5.4 Hz at 44.1kHz)
- Frequency bin calculation: `frequency = (binIndex * sampleRate) / fftSize`
- Focus analysis on 4-8kHz range to reduce computational overhead
- Use smoothing time constant of 0.8 for stable peak detection

### Peak Detection Algorithm
1. Convert frequency range to FFT bin indices
2. Find local maxima by comparing each bin to neighbors
3. Filter peaks by minimum magnitude threshold (-40 dB)
4. Sort peaks by magnitude (descending)
5. Select top 3 peaks
6. Validate minimum separation (500 Hz = ~93 bins at 44.1kHz)
7. Calculate confidence based on peak prominence and separation

### Confidence Scoring
```
confidence = (peakStrength * 0.6) + (separation * 0.4)

where:
  peakStrength = average(peak magnitudes) / noiseFloor
  separation = min(frequency differences) / 500Hz (normalized)
```

Require confidence > 0.7 for successful detection.

### UI Integration
- Add sync button to existing mode-specific UI sections
- Use CSS transitions for smooth button state changes
- Implement canvas-based spectrum visualization (optional but recommended)
- Display detected frequencies with 1 Hz precision
- Use color coding: green for detected, yellow for analyzing, red for errors

### Backward Compatibility
- Default frequencies remain unchanged (4500, 5500, 6500 Hz)
- Sync feature is entirely optional
- Existing transmission/reception code works without modification
- Frequency configuration stored in session storage (not persistent across page reloads)

### Performance Considerations
- Spectrum analysis runs at 10 Hz (every 100ms) to balance responsiveness and CPU usage
- Calibration signal generation is pre-computed and looped for efficiency
- Peak detection algorithm is O(n) where n is number of FFT bins in range (~740 bins)
- Total CPU overhead: <5% on modern devices

### Browser Compatibility
- Requires Web Audio API (Chrome 34+, Firefox 25+, Safari 14+)
- Requires MediaDevices API for microphone access
- AnalyserNode with getFloatFrequencyData support
- No additional dependencies beyond existing Web Audio Transfer requirements

### Security and Privacy
- Microphone access requires user permission (standard browser security)
- No audio data is stored or transmitted outside the browser
- Frequency configuration is session-only (cleared on page reload)
- No external network requests

### Future Enhancements
1. Persistent frequency storage (localStorage) for convenience
2. Manual frequency adjustment UI for fine-tuning
3. Multiple frequency profile support (save/load configurations)
4. Automatic re-sync on detection failure during transmission
5. Visual waveform display alongside spectrum analyzer
6. Adaptive detection thresholds based on ambient noise
