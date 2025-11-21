// Automated Structure Validation Script for Web Audio Transfer
// Run with: node validate-structure.js

const fs = require('fs');
const path = require('path');

console.log('='.repeat(70));
console.log('Web Audio Transfer - Automated Structure Validation');
console.log('='.repeat(70));
console.log('');

// Read the HTML file
const htmlPath = path.join(__dirname, 'audio-transfer.html');
let htmlContent;

try {
    htmlContent = fs.readFileSync(htmlPath, 'utf8');
    console.log('✓ Successfully loaded audio-transfer.html');
} catch (error) {
    console.error('✗ Failed to load audio-transfer.html:', error.message);
    process.exit(1);
}

console.log('');
console.log('-'.repeat(70));
console.log('Test 1: Single File Structure');
console.log('-'.repeat(70));

// Test 1: Check for external dependencies
const externalDependencies = {
    'External CSS': /<link[^>]*rel=["']stylesheet["'][^>]*>/gi,
    'External JavaScript': /<script[^>]*src=["'][^"']+["'][^>]*>/gi,
    'External Images': /<img[^>]*src=["']http[^"']+["'][^>]*>/gi,
    'CDN Links': /https?:\/\/(cdn|unpkg|jsdelivr|cdnjs)/gi,
    'Import Statements': /import\s+.*\s+from\s+['"][^'"]+['"]/gi
};

let hasExternalDeps = false;
for (const [depType, regex] of Object.entries(externalDependencies)) {
    const matches = htmlContent.match(regex);
    if (matches && matches.length > 0) {
        console.log(`✗ Found ${depType}:`, matches.length);
        hasExternalDeps = true;
    } else {
        console.log(`✓ No ${depType} found`);
    }
}

if (!hasExternalDeps) {
    console.log('✓ PASS: No external dependencies detected');
} else {
    console.log('✗ FAIL: External dependencies found');
}

console.log('');
console.log('-'.repeat(70));
console.log('Test 2: Required Components');
console.log('-'.repeat(70));

// Test 2: Check for required components
const requiredComponents = {
    'ModeController class': /class\s+ModeController/,
    'DataProcessor class': /class\s+DataProcessor/,
    'InputHandler class': /class\s+InputHandler/,
    'AudioEncoder class': /class\s+AudioEncoder/,
    'AudioPlayer class': /class\s+AudioPlayer/,
    'ProgressTracker class': /class\s+ProgressTracker/,
    'AudioVisualizer class': /class\s+AudioVisualizer/,
    'EmitterController class': /class\s+EmitterController/,
    'GoertzelFilter class': /class\s+GoertzelFilter/,
    'FrequencyDetector class': /class\s+FrequencyDetector/,
    'AudioDecoder class': /class\s+AudioDecoder/,
    'AudioRecorder class': /class\s+AudioRecorder/,
    'ReceiverController class': /class\s+ReceiverController/
};

let allComponentsPresent = true;
for (const [component, regex] of Object.entries(requiredComponents)) {
    if (regex.test(htmlContent)) {
        console.log(`✓ ${component} found`);
    } else {
        console.log(`✗ ${component} NOT found`);
        allComponentsPresent = false;
    }
}

if (allComponentsPresent) {
    console.log('✓ PASS: All required components present');
} else {
    console.log('✗ FAIL: Some components missing');
}

console.log('');
console.log('-'.repeat(70));
console.log('Test 3: Inline CSS and JavaScript');
console.log('-'.repeat(70));

// Test 3: Check for inline CSS and JavaScript
const hasStyleTag = /<style[^>]*>[\s\S]*<\/style>/i.test(htmlContent);
const hasScriptTag = /<script[^>]*>[\s\S]*<\/script>/i.test(htmlContent);

if (hasStyleTag) {
    console.log('✓ Inline CSS (<style> tag) found');
} else {
    console.log('✗ Inline CSS NOT found');
}

if (hasScriptTag) {
    console.log('✓ Inline JavaScript (<script> tag) found');
} else {
    console.log('✗ Inline JavaScript NOT found');
}

if (hasStyleTag && hasScriptTag) {
    console.log('✓ PASS: Inline CSS and JavaScript present');
} else {
    console.log('✗ FAIL: Missing inline CSS or JavaScript');
}

console.log('');
console.log('-'.repeat(70));
console.log('Test 4: Audio Encoding Parameters');
console.log('-'.repeat(70));

// Test 4: Check for correct audio encoding parameters
const audioParams = {
    'Frequency 0 (4500 Hz)': /freq0\s*=\s*4500/,
    'Frequency 1 (6500 Hz)': /freq1\s*=\s*6500/,
    'Preamble Frequency (5500 Hz)': /freqPreamble\s*=\s*5500/,
    'Baud Rate (100 bps)': /baudRate\s*=\s*100/,
    'Sample Rate (48000 Hz)': /sampleRate\s*=\s*48000/,
    'Chunk Size (255 bytes)': /chunkSize\s*=\s*255/
};

let allParamsCorrect = true;
for (const [param, regex] of Object.entries(audioParams)) {
    if (regex.test(htmlContent)) {
        console.log(`✓ ${param} configured correctly`);
    } else {
        console.log(`✗ ${param} NOT found or incorrect`);
        allParamsCorrect = false;
    }
}

if (allParamsCorrect) {
    console.log('✓ PASS: Audio encoding parameters correct');
} else {
    console.log('✗ FAIL: Some audio parameters incorrect');
}

console.log('');
console.log('-'.repeat(70));
console.log('Test 5: Error Handling');
console.log('-'.repeat(70));

// Test 5: Check for error handling
const errorHandling = {
    'Microphone permission error': /permission\s+denied/i,
    'Web Audio API check': /AudioContext|webkitAudioContext/,
    'Checksum verification': /verifyChecksum/,
    'Preamble timeout': /preambleTimeout/,
    'Try-catch blocks': /try\s*{[\s\S]*}\s*catch/
};

let hasErrorHandling = true;
for (const [feature, regex] of Object.entries(errorHandling)) {
    if (regex.test(htmlContent)) {
        console.log(`✓ ${feature} implemented`);
    } else {
        console.log(`✗ ${feature} NOT found`);
        hasErrorHandling = false;
    }
}

if (hasErrorHandling) {
    console.log('✓ PASS: Error handling implemented');
} else {
    console.log('✗ FAIL: Some error handling missing');
}

console.log('');
console.log('-'.repeat(70));
console.log('Test 6: UI Elements');
console.log('-'.repeat(70));

// Test 6: Check for required UI elements
const uiElements = {
    'Mode selection buttons': /id=["']emitterBtn["']|id=["']receiverBtn["']/,
    'Text input': /id=["']textInput["']/,
    'File input': /id=["']fileInput["']/,
    'Send button': /id=["']sendBtn["']/,
    'Progress bars': /progress-bar/,
    'Status messages': /status-message/,
    'Data display': /id=["']dataDisplay["']/,
    'Audio visualizer': /audio-visualizer/
};

let allUIPresent = true;
for (const [element, regex] of Object.entries(uiElements)) {
    if (regex.test(htmlContent)) {
        console.log(`✓ ${element} found`);
    } else {
        console.log(`✗ ${element} NOT found`);
        allUIPresent = false;
    }
}

if (allUIPresent) {
    console.log('✓ PASS: All UI elements present');
} else {
    console.log('✗ FAIL: Some UI elements missing');
}

console.log('');
console.log('-'.repeat(70));
console.log('Test 7: File Size and Complexity');
console.log('-'.repeat(70));

// Test 7: File size and complexity metrics
const fileSize = Buffer.byteLength(htmlContent, 'utf8');
const fileSizeKB = (fileSize / 1024).toFixed(2);
const lineCount = htmlContent.split('\n').length;
const classCount = (htmlContent.match(/class\s+\w+/g) || []).length;
const functionCount = (htmlContent.match(/function\s+\w+/g) || []).length;

console.log(`File size: ${fileSizeKB} KB`);
console.log(`Line count: ${lineCount}`);
console.log(`Class count: ${classCount}`);
console.log(`Function count: ${functionCount}`);

if (fileSize < 1024 * 1024) { // Less than 1MB
    console.log('✓ File size is reasonable (< 1MB)');
} else {
    console.log('⚠ File size is large (> 1MB)');
}

console.log('');
console.log('='.repeat(70));
console.log('VALIDATION SUMMARY');
console.log('='.repeat(70));

const tests = [
    { name: 'Single File Structure', passed: !hasExternalDeps },
    { name: 'Required Components', passed: allComponentsPresent },
    { name: 'Inline CSS and JavaScript', passed: hasStyleTag && hasScriptTag },
    { name: 'Audio Encoding Parameters', passed: allParamsCorrect },
    { name: 'Error Handling', passed: hasErrorHandling },
    { name: 'UI Elements', passed: allUIPresent }
];

const passedTests = tests.filter(t => t.passed).length;
const totalTests = tests.length;
const passRate = ((passedTests / totalTests) * 100).toFixed(1);

console.log('');
tests.forEach(test => {
    const status = test.passed ? '✓ PASS' : '✗ FAIL';
    console.log(`${status}: ${test.name}`);
});

console.log('');
console.log(`Tests Passed: ${passedTests}/${totalTests}`);
console.log(`Pass Rate: ${passRate}%`);
console.log('');

if (passedTests === totalTests) {
    console.log('✓✓✓ ALL TESTS PASSED ✓✓✓');
    console.log('The Web Audio Transfer implementation is structurally valid.');
    process.exit(0);
} else {
    console.log('✗✗✗ SOME TESTS FAILED ✗✗✗');
    console.log('Please review the failed tests above.');
    process.exit(1);
}
