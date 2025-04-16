import admin from "firebase-admin";

if (!admin.apps.length) {
  const base64 = process.env.FIREBASE_ADMIN_SDK;

  let serviceAccount;
  try {
    serviceAccount = JSON.parse(
      Buffer.from(base64, "base64").toString("utf-8")
    );
  } catch (err) {
    console.error("Error al parsear JSON:", err.message);
    throw err;
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const adminAuth = admin.auth();

export { admin, adminAuth };
