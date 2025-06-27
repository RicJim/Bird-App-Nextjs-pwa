import "server-only";
import admin from "firebase-admin";

if (!admin.apps.length) {
  const base64: string | undefined = process.env.FIREBASE_ADMIN_SDK;

  let serviceAccount;
  try {
    if (!base64) throw new Error("");
    serviceAccount = JSON.parse(
      Buffer.from(base64, "base64").toString("utf-8")
    );
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error al parsear JSON:", err.message);
    }
    throw err;
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const adminAuth = admin.auth();

export { admin, adminAuth };
