import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const wizard = fs.readFileSync(path.join(root, 'src/components/BookingWizard.tsx'), 'utf8');

test('authenticated customer details are automatically prefilled in booking wizard', () => {
  assert.match(wizard, /fullName:\s*currentUser\?\.fullName/);
  assert.match(wizard, /phone:\s*currentUser\?\.phone/);
  assert.match(wizard, /email:\s*currentUser\?\.email/);
  assert.match(wizard, /idNumber:\s*currentUser\?\.idNumber/);
  assert.match(wizard, /driverLicenseNumber:\s*currentUser\?\.licenseNumber/);
  assert.match(wizard, /nationality:\s*currentUser\?\.nationality/);
  assert.match(wizard, /isAuthenticated\s*&&\s*currentUser/);
});
