
import { extractUsername } from '../server/utils/githubUtils.js';

const testCases = [
  { input: 'navmaan07', expected: 'navmaan07', description: 'Plain username' },
  { input: ' https://github.com/navmaan07 ', expected: 'navmaan07', description: 'Standard HTTPS URL with spaces' },
  { input: 'http://github.com/navmaan07', expected: 'navmaan07', description: 'HTTP URL' },
  { input: 'https://www.github.com/navmaan07/', expected: 'navmaan07', description: 'URL with www and trailing slash' },
  { input: 'https://github.com/navmaan07?tab=repositories', expected: 'navmaan07', description: 'URL with query parameters' },
  { input: 'https://github.com/navmaan07#main', expected: 'navmaan07', description: 'URL with fragment' },
  { input: '  ', expected: null, description: 'Empty/Whitespace input' },
  { input: 'https://google.com/navmaan07', expected: null, description: 'Non-GitHub profile link (Google)' },
  { input: 'github.com/navmaan07', expected: 'navmaan07', description: 'URL without protocol' },
  { input: 'https://m.github.com/navmaan07', expected: 'navmaan07', description: 'Mobile subdomain URL' }
];

console.log('--- Running GitHub Username Extraction Tests ---\n');

let passedCount = 0;

testCases.forEach((tc, index) => {
  const result = extractUsername(tc.input);
  const passed = result === tc.expected;

  if (passed) {
    passedCount++;
    console.log(`[PASS] Test ${index + 1}: ${tc.description}`);
  } else {
    console.log(`[FAIL] Test ${index + 1}: ${tc.description}`);
    console.log(`   Input:    '${tc.input}'`);
    console.log(`   Expected: '${tc.expected}'`);
    console.log(`   Actual:   '${result}'`);
  }
});

console.log(`\nSummary: ${passedCount}/${testCases.length} tests passed.`);

if (passedCount === testCases.length) {
  console.log('\n✅ All tests passed successfully!');
} else {
  console.log('\n❌ Some tests failed. Please review the output.');
  process.exit(1);
}
