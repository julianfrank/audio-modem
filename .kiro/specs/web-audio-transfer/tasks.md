# Implementation Plan

- [x] 1. Create HTML structure and basic UI





  - Create single HTML file with inline CSS and JavaScript structure
  - Implement mode selection interface (emitter/receiver buttons)
  - Create emitter UI (text input, file selector, send button)
  - Create receiver UI (listening indicator, received data display area)
  - Add progress display elements for both modes
  - _Requirements: 1.1, 1.2, 1.3, 7.1, 7.2, 7.3_

- [x] 2. Implement ModeController




  - Write mode state management logic
  - Implement UI switching between emitter and receiver modes
  - Add mode locking/unlocking functionality
  - _Requirements: 1.2, 1.3, 1.4_

- [ ]* 2.1 Write property test for mode controller
  - **Property 1: Mode selection configures correct UI**
  - **Property 2: Mode locking during operations**
  - **Validates: Requirements 1.2, 1.3, 1.4**

- [x] 3. Implement DataProcessor class




  - Write text preparation function
  - Write file reading and preparation function
  - Implement data chunking with configurable chunk size (255 bytes)
  - Implement chunk reconstruction logic
  - Add checksum calculation (CRC16 or simple sum)
  - Add checksum verification function
  - _Requirements: 2.2, 2.3, 5.5_

- [ ]* 3.1 Write property test for data processor
  - **Property 3: Data preparation preserves content**
  - **Validates: Requirements 2.2, 2.3**

- [x] 4. Implement input handling and validation




  - Add event listeners for text input
  - Add event listeners for file selection
  - Implement input priority logic (most recent wins)
  - Add file size validation and warning for large files (>1MB)
  - Update send button state based on data validity
  - _Requirements: 2.2, 2.3, 2.4, 2.5, 3.1_

- [ ]* 4.1 Write property test for input handling
  - **Property 4: Input priority follows recency**
  - **Property 5: Send button state reflects data validity**
  - **Validates: Requirements 2.5, 3.1**

- [x] 5. Implement AudioEncoder class




  - Set up Web Audio API context and nodes
  - Implement FSK bit encoding (4500 Hz for 0, 6500 Hz for 1)
  - Write preamble generation (500ms @ 5500 Hz)
  - Write postamble generation (200ms silence)
  - Implement header encoding (magic bytes, type, filename, chunk count, size, checksum)
  - Implement chunk encoding with start/stop bits and parity
  - Write main encode function that assembles complete transmission
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ]* 5.1 Write property test for audio encoder
  - **Property 7: Frequency range compliance**
  - **Property 8: FSK encoding structure**
  - **Property 9: Encoded data completeness**
  - **Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5**

- [ ] 6. Implement AudioPlayer class
  - Create audio playback functionality using Web Audio API
  - Add progress tracking during playback
  - Implement progress callback mechanism
  - Add stop functionality
  - _Requirements: 3.2, 8.1, 8.3_

- [ ] 7. Implement ProgressTracker class
  - Write progress state management
  - Implement progress calculation (percentage, bytes)
  - Add progress update callbacks
  - Create UI update functions for real-time display
  - _Requirements: 8.1, 8.2_

- [ ] 8. Wire up emitter mode functionality
  - Connect send button to encoding pipeline
  - Integrate DataProcessor, AudioEncoder, and AudioPlayer
  - Add transmission state management
  - Implement progress updates during transmission
  - Add completion notification
  - Prevent multiple simultaneous transmissions
  - _Requirements: 3.2, 3.3, 3.4, 3.5_

- [ ]* 8.1 Write property test for transmission lifecycle
  - **Property 6: Transmission lifecycle management**
  - **Validates: Requirements 3.3, 3.4, 3.5, 8.1**

- [ ] 9. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Implement Goertzel algorithm for frequency detection
  - Write Goertzel filter for 4500 Hz detection
  - Write Goertzel filter for 6500 Hz detection
  - Write Goertzel filter for 5500 Hz (preamble) detection
  - Implement threshold-based bit decision logic
  - _Requirements: 5.3, 5.4_

- [ ] 11. Implement AudioDecoder class
  - Implement preamble detection state machine
  - Write header decoding logic
  - Write chunk decoding with start/stop bit detection
  - Implement parity checking
  - Add checksum verification for chunks
  - Implement chunk collection and ordering
  - Add transmission completion detection
  - Create callback mechanisms for chunk received and transmission complete
  - _Requirements: 5.2, 5.3, 5.4, 5.5_

- [ ]* 11.1 Write property test for audio decoder
  - **Property 10: Preamble triggers decoding**
  - **Property 11: Checksum verification on decode**
  - **Validates: Requirements 5.3, 5.4**

- [ ]* 11.2 Write property test for encode-decode round trip
  - **Property 12: Encode-decode round trip**
  - **Validates: Requirements 5.5**

- [ ] 12. Implement AudioRecorder class
  - Request microphone permission
  - Set up MediaStream and AudioContext for recording
  - Implement continuous audio capture
  - Create audio data callback mechanism
  - Add start/stop recording functionality
  - _Requirements: 5.1, 5.2_

- [ ] 13. Implement data reception and display
  - Write logic to reconstruct data from received chunks
  - Implement text display in UI
  - Add download functionality for text files
  - Implement automatic file download with filename preservation
  - Handle multiple transmissions independently
  - _Requirements: 6.1, 6.2, 6.3, 6.5_

- [ ]* 13.1 Write property test for reception display
  - **Property 13: Text reception display and download**
  - **Property 14: File reception with filename preservation**
  - **Property 15: Multiple transmission independence**
  - **Validates: Requirements 6.1, 6.2, 6.3, 6.5**

- [ ] 14. Wire up receiver mode functionality
  - Connect AudioRecorder to AudioDecoder
  - Integrate decoder callbacks with data reconstruction
  - Add reception progress updates
  - Implement visual indicators for audio input monitoring
  - Add completion handling
  - _Requirements: 5.1, 5.2, 8.2, 8.4_

- [ ]* 14.1 Write property test for reception progress
  - **Property 16: Reception progress display**
  - **Validates: Requirements 8.2, 8.4**

- [ ] 15. Implement error handling and user feedback
  - Add error handling for Web Audio API unavailable
  - Add error handling for microphone permission denied
  - Add error handling for preamble timeout (30 seconds)
  - Add error handling for checksum mismatches
  - Add error handling for incomplete transmissions
  - Implement error message display with clear instructions
  - Add success confirmation messages
  - _Requirements: 6.4, 8.5, 8.6_

- [ ]* 15.1 Write property test for error and success notifications
  - **Property 17: Error notification**
  - **Property 18: Success confirmation**
  - **Validates: Requirements 8.5, 8.6**

- [ ] 16. Add visual feedback and polish
  - Implement visual audio output indicator (waveform or level meter)
  - Implement visual audio input indicator
  - Add CSS styling for clean, intuitive interface
  - Ensure responsive design for various screen sizes
  - Add loading states and disabled states for buttons
  - _Requirements: 8.3, 8.4_

- [ ] 17. Final testing and validation
  - Test text transmission end-to-end
  - Test file transmission end-to-end
  - Test error scenarios (permission denied, corrupted data)
  - Test with various file sizes and types
  - Verify single-file HTML structure with no external dependencies
  - Test offline functionality
  - _Requirements: 7.4, 7.5_

- [ ] 18. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
