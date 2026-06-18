import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SERVICE_ACCOUNT_PATH = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || 'firebase-service-account.json';
const serviceAccountFullPath = path.resolve(__dirname, SERVICE_ACCOUNT_PATH);

if (!fs.existsSync(serviceAccountFullPath)) {
  process.exit(1);
}

try {
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountFullPath, 'utf-8'));
  initializeApp({
    credential: cert(serviceAccount)
  });
} catch (err) {
  process.exit(1);
}

const db = getFirestore('default');

async function checkJobs() {
  try {
    const jobDoc = await db.collection('jobs').doc('job-1781621164112').get();
    if (jobDoc.exists) {
      const job = jobDoc.data();
      if (job.data) {
        job.data.forEach((dp, idx) => {
          console.log(`[${idx}] timestamp: ${dp.timestamp}, date: ${dp.date}, time: ${dp.time}, remark: "${dp.remark}"`);
        });
      }
    }
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
}

checkJobs();
