import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, push, remove } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export async function saveProcessedEmail(emailId, folderName, filters) {
  const key = `${emailId}_${folderName}`;
  const processedRef = ref(database, `processedEmails/${key}`);
  await set(processedRef, { emailId, folderName, filters });
  console.log(`Saved processed email: ${key} with filters ${JSON.stringify(filters)}`);
}

export async function isEmailProcessed(emailId, folderName) {
  const key = `${emailId}_${folderName}`;
  const processedRef = ref(database, `processedEmails/${key}`);
  const snapshot = await get(processedRef);
  return snapshot.exists();
}

// New functions using processedEmails structure
export async function getAllFolders() {
  const processedRef = ref(database, `processedEmails`);
  const snapshot = await get(processedRef);
  
  if (!snapshot.exists()) {
    return [];
  }
  
  const folderMap = new Map(); // folderName -> emailIds[]
  
  snapshot.forEach((childSnapshot) => {
    const data = childSnapshot.val();
    const { folderName, emailId } = data;
    
    if (!folderMap.has(folderName)) {
      folderMap.set(folderName, []);
    }
    folderMap.get(folderName).push(emailId);
  });
  
  const folders = [];
  folderMap.forEach((emailIds, folderName) => {
    folders.push({
      name: folderName,
      emailCount: emailIds.length,
      createdAt: new Date().toISOString() // Since we don't store folder creation time
    });
  });
  
  return folders;
}

export async function getEmailIdsFromFolder(folderName) {
  const processedRef = ref(database, `processedEmails`);
  const snapshot = await get(processedRef);
  
  if (!snapshot.exists()) {
    return [];
  }
  
  const emailIds = [];
  
  snapshot.forEach((childSnapshot) => {
    const data = childSnapshot.val();
    if (data.folderName === folderName) {
      emailIds.push(data.emailId);
    }
  });
  
  return emailIds;
}

// Keep these for backward compatibility but they're now no-ops
export async function saveEmailToFolder(emailId, folderName, emailData) {
  // No longer storing email data in folders structure
  console.log(`Email ${emailId} will be fetched from Gmail API when needed`);
}

export async function getEmailsFromFolder(folderName) {
  // This function is now handled by getEmailIdsFromFolder + Gmail API
  console.log(`Getting email IDs for folder ${folderName} from processedEmails`);
  return getEmailIdsFromFolder(folderName);
}

export async function createFolder(folderName) {
  // Folders are created automatically when first email is processed
  console.log(`Folder ${folderName} will be created when first email is processed`);
}

export async function removeEmailFromFolder(emailId, folderName) {
  const key = `${emailId}_${folderName}`;
  const processedRef = ref(database, `processedEmails/${key}`);
  await remove(processedRef);
  console.log(`Removed email ${emailId} from folder ${folderName}`);
}

export async function deleteFolder(folderName) {
  const processedRef = ref(database, `processedEmails`);
  const snapshot = await get(processedRef);
  
  if (!snapshot.exists()) {
    return;
  }
  
  const updates = {};
  snapshot.forEach((childSnapshot) => {
    const data = childSnapshot.val();
    if (data.folderName === folderName) {
      updates[`processedEmails/${childSnapshot.key}`] = null;
    }
  });
  
  // Remove all processed emails for this folder
  const dbRef = ref(database);
  await set(dbRef, updates);
  console.log(`Deleted folder: ${folderName}`);
}

export async function getFolderStats(folderName) {
  const emailIds = await getEmailIdsFromFolder(folderName);
  
  return {
    name: folderName,
    emailCount: emailIds.length,
    createdAt: new Date().toISOString() // Since we don't store folder creation time
  };
}