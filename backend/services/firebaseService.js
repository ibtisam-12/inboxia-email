import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get } from 'firebase/database';
const firebaseConfig = {
  apiKey: process.env.API_KEY,  // Use environment variable for API key
  authDomain: process.env.AUTH_DOMAIN,  // Use environment variable for auth domain
  databaseURL: process.env.DATABASE_URL,  // Use environment variable for database URL
  projectId: process.env.PROJECT_ID,  // Use environment variable for project ID
  storageBucket: process.env.STORAGE_BUCKET,  // Use environment variable for storage bucket
  messagingSenderId: process.env.MESSAGING_SENDER_ID,  // Use environment variable for messaging sender ID
  appId: process.env.APP_ID,  // Use environment variable for app ID
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export async function saveProcessedEmail(emailId, folderName, filters) {
  const key = `${emailId}_${folderName}`;  // Unique key based on emailId and folderName
  const processedRef = ref(database, `processedEmails/${key}`);
  await set(processedRef, { emailId, folderName, filters });  // Store filters for reference
  console.log(`Saved processed email: ${key} with filters ${JSON.stringify(filters)}`);
}

export async function isEmailProcessed(emailId, folderName) {
  const key = `${emailId}_${folderName}`;
  const processedRef = ref(database, `processedEmails/${key}`);
  const snapshot = await get(processedRef);
  return snapshot.exists();  // Only check if the key exists, ignoring filters
}