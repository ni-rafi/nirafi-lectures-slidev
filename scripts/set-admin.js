import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse arguments
let identifier = null;
let keyFile = null;

for (const arg of process.argv.slice(2)) {
  if (arg.startsWith('--key=')) {
    keyFile = arg.split('=')[1];
  } else if (!identifier) {
    identifier = arg;
  }
}

const possibleKeys = keyFile 
  ? [keyFile] 
  : ['nirafi-workspace-dev.json', 'nirafi-workspace.json', 'serviceAccountKey.json'];

let serviceAccountPath = null;
for (const key of possibleKeys) {
  const p = path.isAbsolute(key) ? key : path.join(__dirname, key);
  if (fs.existsSync(p)) {
    serviceAccountPath = p;
    break;
  }
}

if (!serviceAccountPath) {
  console.error('\nError: Service account key file not found.');
  console.error('Looked for:', possibleKeys.join(', '));
  console.error('Please download the key JSON from Firebase Console and place it in the "scripts/" folder.');
  console.error('You can also specify a key with: node scripts/set-admin.js <email> --key=<filename>\n');
  process.exit(1);
}

console.log(`Using service account key: ${path.basename(serviceAccountPath)}`);

// Read and parse service account credentials
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// Initialize Firebase Admin
initializeApp({
  credential: cert(serviceAccount),
});

const auth = getAuth();

if (!identifier) {
  console.error('\nUsage: node scripts/set-admin.js <user-uid-or-email> [--key=<filename>]\n');
  process.exit(1);
}

async function setAdmin() {
  let user;
  try {
    if (identifier.includes('@')) {
      user = await auth.getUserByEmail(identifier);
    } else {
      user = await auth.getUser(identifier);
    }
  } catch (error) {
    console.error(`\nError: Failed to find user with identifier "${identifier}":`, error.message);
    process.exit(1);
  }

  console.log(`Found user: ${user.displayName || 'No Name'} (${user.email}) - UID: ${user.uid}`);

  try {
    /** @type {import('../src/services/firebase/firebase.schemas').FirebaseClaims} */
    const claims = {
      is_admin: true,
      isAdmin: true,
      role: 'admin',
    };

    // Set custom claims (aligned with the application's FirebaseClaims type definition)
    await auth.setCustomUserClaims(user.uid, claims);

    console.log(`\nSuccess! Custom claims (is_admin, isAdmin, role: 'admin') have been set for ${user.email}.`);
    console.log('Important: The user must sign out and sign back in (or force refresh their token) for the changes to take effect.\n');
  } catch (error) {
    console.error('\nError setting custom claims:', error.message);
    process.exit(1);
  }
}

setAdmin();
