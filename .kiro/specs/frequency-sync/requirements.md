# Requirements Document

## Introduction

This document specifies the requirements for adding frequency synchronization functionality to the Web Audio File Transfer system. The synchronization feature enables the Receiver to automatically detect and calibrate to the exact frequencies being transmitted by the Emitter, ensuring reliable communication even when hardware variations cause frequency drift or when different encoding schemes are used.

## Glossary

- **Sync Button**: A UI control that initiates the frequency synchronization process
- **Emitter**: The transmitting device that broadcasts calibration signals
- **Receiver**: The receiving device that listens for and detects calibration signals
- **Preamble Frequency**: The synchronization tone frequency used to mark the start of transmission (currently 5500 Hz)
- **Bit 0 Frequency**: The carrier frequency representing binary 0 (currently 4500 Hz)
- **Bit 1 Frequency**: The carrier frequency representing binary 1 (currently 6500 Hz)
- **Calibration Signal**: A repeating sequence of preamble, bit 0, and bit 1 tones used for frequency detection
- **Frequency Detection**: The process of analyzing audio spectrum to identify peak frequencies
- **Spectrum Analyzer**: A component that performs frequency analysis on audio input using FFT (Fast Fourier Transform)
- **Sync State**: The operational state of the synchronization process (idle, transmitting, listening, detected, error)

## Requirements

### Requirement 1

**User Story:** As an emitter user, I want a sync button that broadcasts calibration signals, so that the receiver can detect the exact frequencies I am transmitting.

#### Acceptance Criteria

1. WHEN emitter mode is active THEN the Web Audio Transfer System SHALL display a sync button in the emitter interface
2. WHEN the sync button is clicked THEN the Web Audio Transfer System SHALL begin transmitting calibration signals
3. WHEN calibration transmission is active THEN the Web Audio Transfer System SHALL continuously loop through preamble frequency, bit 0 frequency, and bit 1 frequency
4. WHEN calibration transmission is active THEN the Web Audio Transfer System SHALL transmit each frequency for a minimum of 2000 milliseconds
5. WHEN calibration transmission is active THEN the sync button SHALL change to a stop button to allow manual termination

### Requirement 2

**User Story:** As an emitter user, I want to manually stop the calibration signal transmission, so that I can control when synchronization ends.

#### Acceptance Criteria

1. WHEN calibration transmission is active THEN the Web Audio Transfer System SHALL display a stop sync button
2. WHEN the stop sync button is clicked THEN the Web Audio Transfer System SHALL immediately cease calibration signal transmission
3. WHEN calibration transmission stops THEN the Web Audio Transfer System SHALL restore the sync button to its initial state
4. WHEN calibration transmission stops THEN the Web Audio Transfer System SHALL enable normal transmission functionality

### Requirement 3

**User Story:** As a receiver user, I want a sync button that listens for calibration signals, so that I can automatically detect the correct frequencies.

#### Acceptance Criteria

1. WHEN receiver mode is active THEN the Web Audio Transfer System SHALL display a sync button in the receiver interface
2. WHEN the sync button is clicked THEN the Web Audio Transfer System SHALL request microphone access if not already granted
3. WHEN microphone access is granted THEN the Web Audio Transfer System SHALL begin listening for calibration signals
4. WHEN listening for calibration signals THEN the Web Audio Transfer System SHALL analyze the audio spectrum to detect peak frequencies
5. WHEN listening is active THEN the sync button SHALL change to indicate active listening state

### Requirement 4

**User Story:** As a receiver user, I want the system to automatically detect preamble, bit 0, and bit 1 frequencies, so that I can receive transmissions accurately.

#### Acceptance Criteria

1. WHEN analyzing audio spectrum THEN the Spectrum Analyzer SHALL identify the three strongest frequency peaks in the 4kHz to 8kHz range
2. WHEN three distinct frequency peaks are detected THEN the Web Audio Transfer System SHALL classify them as preamble, bit 0, and bit 1 frequencies
3. WHEN frequencies are detected THEN the Web Audio Transfer System SHALL validate that the three frequencies are sufficiently separated (minimum 500 Hz apart)
4. WHEN frequencies are validated THEN the Web Audio Transfer System SHALL update the decoder configuration with the detected frequencies
5. WHEN frequency detection completes THEN the Web Audio Transfer System SHALL display the detected frequency values to the user

### Requirement 5

**User Story:** As a receiver user, I want visual feedback during the sync process, so that I understand what the system is detecting.

#### Acceptance Criteria

1. WHEN sync listening is active THEN the Web Audio Transfer System SHALL display a real-time frequency spectrum visualization
2. WHEN frequencies are being analyzed THEN the Web Audio Transfer System SHALL highlight detected peaks in the visualization
3. WHEN preamble frequency is detected THEN the Web Audio Transfer System SHALL display the detected preamble frequency value
4. WHEN bit 0 frequency is detected THEN the Web Audio Transfer System SHALL display the detected bit 0 frequency value
5. WHEN bit 1 frequency is detected THEN the Web Audio Transfer System SHALL display the detected bit 1 frequency value
6. WHEN all three frequencies are successfully detected THEN the Web Audio Transfer System SHALL display a success confirmation message

### Requirement 6

**User Story:** As a receiver user, I want to manually stop the sync listening process, so that I can control when synchronization ends.

#### Acceptance Criteria

1. WHEN sync listening is active THEN the Web Audio Transfer System SHALL display a stop sync button
2. WHEN the stop sync button is clicked THEN the Web Audio Transfer System SHALL immediately cease listening for calibration signals
3. WHEN sync listening stops THEN the Web Audio Transfer System SHALL restore the sync button to its initial state
4. WHEN sync listening stops without successful detection THEN the Web Audio Transfer System SHALL retain the previous frequency configuration

### Requirement 7

**User Story:** As a receiver user, I want the detected frequencies to be automatically used for subsequent data reception, so that I don't need to manually configure frequency values.

#### Acceptance Criteria

1. WHEN frequency detection succeeds THEN the Web Audio Transfer System SHALL update the Audio Decoder with the detected preamble frequency
2. WHEN frequency detection succeeds THEN the Web Audio Transfer System SHALL update the Audio Decoder with the detected bit 0 frequency
3. WHEN frequency detection succeeds THEN the Web Audio Transfer System SHALL update the Audio Decoder with the detected bit 1 frequency
4. WHEN decoder frequencies are updated THEN the Web Audio Transfer System SHALL persist the frequency configuration for the current session
5. WHEN a new data transmission is received THEN the Audio Decoder SHALL use the synchronized frequencies for decoding

### Requirement 8

**User Story:** As a user, I want clear error handling during synchronization, so that I understand when synchronization fails and why.

#### Acceptance Criteria

1. WHEN microphone access is denied during sync THEN the Web Audio Transfer System SHALL display an error message explaining the permission requirement
2. WHEN sync listening times out after 30 seconds without detection THEN the Web Audio Transfer System SHALL notify the user and stop listening
3. WHEN detected frequencies are too close together (less than 500 Hz separation) THEN the Web Audio Transfer System SHALL reject the detection and continue listening
4. WHEN audio input level is too low during sync THEN the Web Audio Transfer System SHALL warn the user to increase volume or move devices closer
5. WHEN sync fails THEN the Web Audio Transfer System SHALL provide actionable suggestions for resolving the issue

### Requirement 9

**User Story:** As a developer, I want the sync functionality to integrate seamlessly with existing transmission and reception code, so that the system remains maintainable.

#### Acceptance Criteria

1. WHEN sync mode is active on the emitter THEN the Web Audio Transfer System SHALL disable normal transmission controls
2. WHEN sync mode is active on the receiver THEN the Web Audio Transfer System SHALL disable normal reception display updates
3. WHEN sync completes successfully THEN the Web Audio Transfer System SHALL restore normal operational mode
4. WHEN sync is not used THEN the Web Audio Transfer System SHALL use default frequency values for backward compatibility
5. THE Web Audio Transfer System SHALL maintain the single-file HTML architecture with inline JavaScript and CSS
