# Implementation Plan

- [x] 1. Add sync UI elements to existing HTML





  - Add sync button to emitter mode interface
  - Add sync button to receiver mode interface
  - Add frequency display area for detected values
  - Add spectrum visualization canvas element (optional)
  - Add sync status indicator elements
  - _Requirements: 1.1, 3.1, 4.5, 5.1_

- [x] 2. Implement SyncController class


  - Write sync state management (idle, transmitting, listening, detected, error)
  - Implement state transition logic
  - Add state change callback mechanism
  - Implement emitter sync start/stop methods
  - Implement receiver sync start/stop methods
  - Add frequency detection callback handling
  - _Requirements: 1.2, 2.2, 3.3, 6.2_

- [ ]* 2.1 Write property test for sync state transitions
  - **Property 2: Sync initiation triggers calibration transmission**
  - **Property 5: Stop sync terminates calibration**
  - **Property 14: Stop listening terminates spectrum analysis**
  - **Validates: Requirements 1.2, 2.2, 6.2**

- [x] 3. Implement CalibrationSignalGenerator class


  - Set up Web Audio API context and oscillator nodes
  - Write method to generate preamble tone (2000ms at 5500 Hz)
  - Write method to generate bit 0 tone (2000ms at 4500 Hz)
  - Write method to generate bit 1 tone (2000ms at 6500 Hz)
  - Write method to generate silence gaps (500ms)
  - Implement calibration sequence assembly with looping
  - Add start/stop playback control
  - _Requirements: 1.3, 1.4_

- [ ]* 3.1 Write property test for calibration signal structure
  - **Property 3: Calibration signal structure**
  - **Validates: Requirements 1.3, 1.4**

- [x] 4. Implement SpectrumAnalyzer class


  - Create AnalyserNode with FFT size 8192
  - Implement connection to audio source
  - Write method to get frequency data (getFloatFrequencyData)
  - Implement frequency-to-bin-index conversion
  - Implement bin-index-to-frequency conversion
  - Add method to extract frequency range (4-8kHz) data
  - _Requirements: 3.4, 4.1_

- [x] 5. Implement FrequencyDetector class


  - Write peak detection algorithm (local maxima finding)
  - Implement magnitude threshold filtering (-40 dB)
  - Write peak sorting by magnitude
  - Implement top-3 peak selection
  - Write frequency separation validation (minimum 500 Hz)
  - Implement peak classification (bit0=lowest, preamble=middle, bit1=highest)
  - Write confidence calculation algorithm
  - Add noise floor estimation
  - _Requirements: 4.1, 4.2, 4.3_

- [ ]* 5.1 Write property test for peak detection
  - **Property 9: Peak detection identifies top frequencies**
  - **Validates: Requirements 4.1**

- [ ]* 5.2 Write property test for peak classification
  - **Property 10: Peak classification by frequency order**
  - **Validates: Requirements 4.2**

- [ ]* 5.3 Write property test for frequency validation
  - **Property 11: Frequency separation validation**
  - **Validates: Requirements 4.3, 8.3**

- [x] 6. Implement DecoderConfigurator class


  - Write method to update AudioDecoder with detected frequencies
  - Implement frequency persistence to session storage
  - Write method to load persisted frequencies
  - Implement reset to default frequencies
  - Add method to get currently active frequencies
  - _Requirements: 4.4, 7.1, 7.2, 7.3, 7.4_

- [ ]* 6.1 Write property test for decoder configuration
  - **Property 12: Successful detection updates decoder**
  - **Property 16: Frequency persistence for session**
  - **Validates: Requirements 4.4, 7.1, 7.2, 7.3, 7.4, 7.5**

- [x] 7. Implement SyncUIManager class


  - Write method to show/hide sync buttons based on mode
  - Implement sync button state updates (start/stop labels)
  - Write method to display detected frequency values
  - Implement spectrum visualization rendering (canvas-based)
  - Write method to highlight detected peaks in visualization
  - Implement error message display
  - Write method to show success confirmation
  - Add low signal warning display
  - _Requirements: 4.5, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 8.4_

- [ ]* 7.1 Write property test for UI state management
  - **Property 1: Mode-appropriate sync button visibility**
  - **Property 4: Button state reflects sync state**
  - **Property 13: Detection completion displays frequencies**
  - **Validates: Requirements 1.1, 1.5, 3.1, 3.5, 4.5, 5.3, 5.4, 5.5, 5.6**

- [x] 8. Wire up emitter sync functionality


  - Connect sync button click to SyncController.startEmitterSync()
  - Integrate CalibrationSignalGenerator with SyncController
  - Implement continuous looping until manual stop
  - Connect stop button to SyncController.stopEmitterSync()
  - Update UI to show transmitting state
  - Disable normal transmission controls during sync
  - Restore normal controls when sync stops
  - _Requirements: 1.2, 1.5, 2.1, 2.2, 2.3, 2.4, 9.1_

- [ ]* 8.1 Write property test for emitter sync lifecycle
  - **Property 6: Sync completion restores normal mode**
  - **Property 21: Sync mode disables normal controls**
  - **Validates: Requirements 2.4, 9.1, 9.3**

- [x] 9. Wire up receiver sync functionality


  - Connect sync button click to microphone permission request
  - Implement permission handling (granted/denied)
  - Connect SpectrumAnalyzer to microphone audio stream
  - Set up periodic spectrum analysis (every 100ms)
  - Integrate FrequencyDetector with spectrum data
  - Connect detected frequencies to DecoderConfigurator
  - Update UI with real-time spectrum visualization
  - Display detected frequencies when found
  - Implement 30-second timeout for detection
  - Connect stop button to SyncController.stopReceiverSync()
  - Disable normal reception updates during sync
  - Restore normal controls when sync completes
  - _Requirements: 3.2, 3.3, 3.4, 3.5, 5.1, 5.2, 6.1, 6.2, 6.3, 9.2_

- [ ]* 9.1 Write property test for receiver sync lifecycle
  - **Property 7: Microphone permission request on receiver sync**
  - **Property 8: Permission grant enables listening**
  - **Validates: Requirements 3.2, 3.3, 3.4**

- [x] 10. Implement error handling for sync operations


  - Add error handling for microphone permission denied
  - Implement timeout detection (30 seconds without success)
  - Add validation error handling (frequencies too close)
  - Implement low signal level detection and warning
  - Write error message generation with actionable suggestions
  - Add error state display in UI
  - Ensure previous configuration is preserved on failure
  - _Requirements: 6.4, 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ]* 10.1 Write property test for error handling
  - **Property 15: Failed sync preserves previous configuration**
  - **Property 17: Permission denial shows error**
  - **Property 18: Sync timeout triggers notification**
  - **Property 19: Low signal warning**
  - **Property 20: Error messages include suggestions**
  - **Validates: Requirements 6.4, 8.1, 8.2, 8.4, 8.5**

- [x] 11. Integrate sync with existing AudioDecoder


  - Modify AudioDecoder to accept configurable frequencies
  - Update Goertzel filters to use configured frequencies instead of hardcoded values
  - Ensure decoder uses synchronized frequencies for preamble detection
  - Ensure decoder uses synchronized frequencies for bit decoding
  - Implement fallback to default frequencies when sync not performed
  - _Requirements: 7.5, 9.4_

- [ ]* 11.1 Write property test for decoder integration
  - **Property 22: Default frequencies for backward compatibility**
  - **Validates: Requirements 9.4**

- [x] 12. Add visual polish and feedback


  - Implement smooth CSS transitions for button state changes
  - Add color coding for sync states (green=detected, yellow=analyzing, red=error)
  - Implement spectrum visualization with gradient colors
  - Add peak highlighting in spectrum display
  - Ensure responsive design for sync UI elements
  - Add loading/processing indicators during sync
  - _Requirements: 5.1, 5.2_

- [x] 13. Checkpoint - Ensure all tests pass


  - Ensure all tests pass, ask the user if questions arise.

- [x] 14. End-to-end testing and validation


  - Test emitter sync transmission with audio output verification
  - Test receiver sync detection with known calibration signals
  - Test frequency detection accuracy with various signal strengths
  - Test error scenarios (permission denied, timeout, low signal)
  - Test integration with existing transmission/reception functionality
  - Verify backward compatibility (system works without sync)
  - Test session persistence of detected frequencies
  - Verify single-file HTML architecture is maintained
  - _Requirements: 9.5_

- [x] 15. Final Checkpoint - Ensure all tests pass



  - Ensure all tests pass, ask the user if questions arise.
