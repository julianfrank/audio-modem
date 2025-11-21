# Manual Test Checklist for Web Audio Transfer

## Prerequisites
- Two devices with modern browsers (Chrome 34+, Firefox 25+, Safari 14+, or Edge)
- OR two browser windows/tabs on the same device
- Speakers on emitter device
- Microphone on receiver device
- Quiet environment for testing

## Test Session Setup
1. Open `index.html` in first browser window (Emitter)
2. Open `index.html` in second browser window (Receiver)
3. Position devices so receiver's microphone can hear emitter's speakers
4. Adjust volume to moderate level (not too loud, not too quiet)

---

## Test 1: Text Transmission (Basic)
**Requirement**: 2.2, 3.1-3.5, 5.1-5.5, 6.1-6.2

### Steps:
1. **Emitter Window**:
   - [ ] Click "Emitter" button
   - [ ] Verify emitter UI appears (text input, file selector, send button)
   - [ ] Type "Hello World" in text input
   - [ ] Verify send button becomes enabled
   - [ ] Click "Send Data" button
   - [ ] Verify audio plays (you should hear tones)
   - [ ] Verify progress bar appears and updates
   - [ ] Verify waveform visualization shows
   - [ ] Wait for completion message

2. **Receiver Window**:
   - [ ] Click "Receiver" button
   - [ ] Allow microphone permission when prompted
   - [ ] Verify "Listening for transmission..." message
   - [ ] Verify audio input level meter shows activity
   - [ ] Wait for transmission to complete
   - [ ] Verify "Hello World" appears in received data area
   - [ ] Verify success message shows
   - [ ] Click "Download as Text File" button
   - [ ] Verify file downloads successfully

**Expected Result**: ✓ Text transmitted and received correctly

---

## Test 2: File Transmission (Small File)
**Requirement**: 2.3, 3.1-3.5, 5.1-5.5, 6.3

### Steps:
1. **Prepare Test File**:
   - [ ] Create a small text file (< 1KB) named "test.txt"
   - [ ] Add some content: "This is a test file for audio transfer."

2. **Emitter Window**:
   - [ ] Refresh page and select "Emitter" mode
   - [ ] Click file selector
   - [ ] Choose "test.txt"
   - [ ] Verify send button becomes enabled
   - [ ] Verify no warning message (file is small)
   - [ ] Click "Send Data" button
   - [ ] Verify transmission starts
   - [ ] Wait for completion

3. **Receiver Window**:
   - [ ] Refresh page and select "Receiver" mode
   - [ ] Allow microphone permission
   - [ ] Wait for transmission
   - [ ] Verify file information displays
   - [ ] Verify file downloads automatically
   - [ ] Verify filename is "test.txt"
   - [ ] Open downloaded file
   - [ ] Verify content matches original

**Expected Result**: ✓ File transmitted with filename preserved

---

## Test 3: Large File Warning
**Requirement**: 2.4

### Steps:
1. **Emitter Window**:
   - [ ] Select "Emitter" mode
   - [ ] Select a file larger than 1MB
   - [ ] Verify warning message appears
   - [ ] Verify estimated transmission time is shown
   - [ ] Verify send button is still enabled
   - [ ] (Optional) Proceed with transmission to test large file handling

**Expected Result**: ✓ Warning displayed for large files

---

## Test 4: Input Priority (Most Recent Wins)
**Requirement**: 2.5

### Steps:
1. **Emitter Window**:
   - [ ] Select "Emitter" mode
   - [ ] Type "First input" in text field
   - [ ] Verify send button enabled
   - [ ] Select a file
   - [ ] Verify text field is cleared
   - [ ] Verify send button still enabled
   - [ ] Type "Second input" in text field
   - [ ] Verify file selector is cleared
   - [ ] Click "Send Data"
   - [ ] Verify "Second input" is transmitted (not the file)

**Expected Result**: ✓ Most recent input takes priority

---

## Test 5: Mode Locking During Operation
**Requirement**: 1.4

### Steps:
1. **Emitter Window**:
   - [ ] Select "Emitter" mode
   - [ ] Enter text and click "Send Data"
   - [ ] While transmission is in progress, try to click "Receiver" button
   - [ ] Verify mode buttons are disabled
   - [ ] Wait for transmission to complete
   - [ ] Verify mode buttons become enabled again

**Expected Result**: ✓ Mode locked during transmission

---

## Test 6: Error - Microphone Permission Denied
**Requirement**: 8.5

### Steps:
1. **Receiver Window**:
   - [ ] Open in incognito/private mode
   - [ ] Select "Receiver" mode
   - [ ] When permission prompt appears, click "Deny"
   - [ ] Verify clear error message displays
   - [ ] Verify error message includes instructions
   - [ ] Verify error message mentions browser settings

**Expected Result**: ✓ Clear error with instructions

---

## Test 7: Error - Preamble Timeout
**Requirement**: 8.5

### Steps:
1. **Receiver Window**:
   - [ ] Select "Receiver" mode
   - [ ] Allow microphone permission
   - [ ] Wait 30 seconds without starting transmission
   - [ ] Verify timeout error message appears
   - [ ] Verify message suggests checking emitter

**Expected Result**: ✓ Timeout detected and reported

---

## Test 8: Error - Corrupted Data (Simulated)
**Requirement**: 6.4, 8.5

### Steps:
1. **Setup**:
   - [ ] Start transmission from emitter
   - [ ] During transmission, create interference:
     - Speak loudly near microphone
     - Play music
     - Move devices far apart
     - Lower volume significantly

2. **Observe**:
   - [ ] Check if checksum errors are detected
   - [ ] Verify error message if too many errors occur
   - [ ] Verify message suggests improving signal quality

**Expected Result**: ✓ Checksum errors detected and reported

---

## Test 9: Single-File Structure
**Requirement**: 7.1-7.4

### Steps:
1. **File Inspection**:
   - [ ] Open `index.html` in text editor
   - [ ] Verify all CSS is within `<style>` tags
   - [ ] Verify all JavaScript is within `<script>` tags
   - [ ] Search for external references:
     - [ ] No `<link>` tags for CSS
     - [ ] No `<script src="">` tags
     - [ ] No `import` statements
     - [ ] No CDN links
     - [ ] No external image references

2. **Network Inspection**:
   - [ ] Open browser DevTools (F12)
   - [ ] Go to Network tab
   - [ ] Clear network log
   - [ ] Load `index.html`
   - [ ] Verify only one request (the HTML file itself)
   - [ ] Verify no additional network requests

**Expected Result**: ✓ Completely self-contained

---

## Test 10: Offline Functionality
**Requirement**: 7.5

### Steps:
1. **Setup**:
   - [ ] Load `index.html` in browser
   - [ ] Disconnect from internet (turn off WiFi/unplug ethernet)

2. **Test All Features**:
   - [ ] Switch between Emitter and Receiver modes
   - [ ] Enter text in emitter
   - [ ] Select file in emitter
   - [ ] Verify all UI elements work
   - [ ] Perform a transmission between two offline devices
   - [ ] Verify no errors in console related to network

**Expected Result**: ✓ Full functionality offline

---

## Test 11: Progress Display - Emitter
**Requirement**: 8.1, 8.3

### Steps:
1. **Emitter Window**:
   - [ ] Select "Emitter" mode
   - [ ] Enter a moderate amount of text (several sentences)
   - [ ] Click "Send Data"
   - [ ] Observe progress display:
     - [ ] Progress bar appears
     - [ ] Percentage updates (0% → 100%)
     - [ ] Bytes transmitted counter updates
     - [ ] Waveform visualization shows audio output
     - [ ] Progress updates smoothly in real-time

**Expected Result**: ✓ Real-time progress visualization

---

## Test 12: Progress Display - Receiver
**Requirement**: 8.2, 8.4

### Steps:
1. **Receiver Window**:
   - [ ] Select "Receiver" mode
   - [ ] Allow microphone permission
   - [ ] Start transmission from emitter
   - [ ] Observe progress display:
     - [ ] Audio input level meter shows activity
     - [ ] Progress bar appears when decoding starts
     - [ ] Percentage updates (0% → 100%)
     - [ ] Bytes received counter updates
     - [ ] Listening indicator animates

**Expected Result**: ✓ Real-time reception visualization

---

## Test 13: Multiple Transmissions
**Requirement**: 6.5

### Steps:
1. **First Transmission**:
   - [ ] Transmit "Message 1" from emitter
   - [ ] Verify received on receiver
   - [ ] Note the received data

2. **Second Transmission**:
   - [ ] Without refreshing, transmit "Message 2"
   - [ ] Verify received on receiver
   - [ ] Verify "Message 2" replaces "Message 1" in display
   - [ ] Verify both transmissions handled independently

**Expected Result**: ✓ Multiple transmissions work independently

---

## Test 14: Browser Compatibility
**Requirement**: Design Document - Browser Compatibility

### Test in Each Browser:
- [ ] **Chrome/Edge**: All features work
- [ ] **Firefox**: All features work
- [ ] **Safari**: All features work
- [ ] **Older Browser**: Appropriate error message shown

**Expected Result**: ✓ Works in modern browsers, clear error in old browsers

---

## Test 15: Responsive Design
**Requirement**: Design Document - Responsive Design

### Steps:
1. **Desktop View** (>768px):
   - [ ] Open in full browser window
   - [ ] Verify layout is clean and spacious
   - [ ] Verify all elements visible

2. **Tablet View** (600-768px):
   - [ ] Resize browser window to tablet size
   - [ ] Verify layout adapts appropriately
   - [ ] Verify buttons remain usable

3. **Mobile View** (<600px):
   - [ ] Resize to mobile size
   - [ ] Verify mode buttons stack vertically
   - [ ] Verify all controls remain accessible
   - [ ] Verify text remains readable

**Expected Result**: ✓ Responsive across all screen sizes

---

## Test 16: Success Messages
**Requirement**: 8.6

### Steps:
1. **Emitter**:
   - [ ] Complete a transmission
   - [ ] Verify success message appears
   - [ ] Verify message has green background
   - [ ] Verify checkmark icon (✓) present
   - [ ] Verify message is clear and informative

2. **Receiver**:
   - [ ] Complete a reception
   - [ ] Verify success message appears
   - [ ] Verify message includes file size
   - [ ] Verify message includes filename (for files)
   - [ ] Verify message has green background

**Expected Result**: ✓ Clear success confirmation

---

## Test 17: Different File Types
**Requirement**: 2.3, 6.3

### Test Each File Type:
- [ ] **Text file** (.txt): Transmits and downloads correctly
- [ ] **Image file** (.jpg, .png): Transmits and opens correctly
- [ ] **PDF file** (.pdf): Transmits and opens correctly
- [ ] **Binary file** (.zip, .exe): Transmits with correct size

**Expected Result**: ✓ All file types handled correctly

---

## Final Validation Checklist

### Core Functionality
- [ ] Text transmission works end-to-end
- [ ] File transmission works end-to-end
- [ ] Data integrity maintained (checksums work)
- [ ] Progress tracking accurate
- [ ] Error handling comprehensive

### Requirements Compliance
- [ ] All 36 requirements tested
- [ ] Single HTML file structure confirmed
- [ ] No external dependencies
- [ ] Offline functionality verified
- [ ] All error scenarios handled

### User Experience
- [ ] UI is intuitive and clear
- [ ] Error messages are helpful
- [ ] Success messages are clear
- [ ] Progress feedback is real-time
- [ ] Visual design is clean

### Technical Validation
- [ ] FSK encoding at correct frequencies
- [ ] Preamble detection works
- [ ] Checksum verification works
- [ ] Chunk reconstruction works
- [ ] Audio quality sufficient

---

## Test Results Summary

**Date**: _______________
**Tester**: _______________
**Browser**: _______________
**OS**: _______________

**Tests Passed**: _____ / 17
**Tests Failed**: _____ / 17
**Pass Rate**: _____%

**Critical Issues Found**: 
_______________________________________
_______________________________________

**Minor Issues Found**:
_______________________________________
_______________________________________

**Overall Assessment**: 
[ ] PASS - Ready for use
[ ] FAIL - Requires fixes
[ ] PARTIAL - Works with limitations

**Notes**:
_______________________________________
_______________________________________
_______________________________________
