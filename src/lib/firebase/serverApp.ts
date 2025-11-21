import "server-only";
import admin from "firebase-admin";
import { Auth } from "firebase-admin/auth";

let adminApp = null;
let isFirebaseAdminConfigured = false;
let adminAuth: Auth | null = isFirebaseAdminConfigured ? admin.auth() : null;

try {
  if (!admin.apps.length) {
    const base64: string | undefined = process.env.FIREBASE_ADMIN_SDK;

    if (!base64) {
      console.warn(
        "FIREBASE_ADMIN_SDK no está configurado. Firebase Admin no estará disponible."
      );
      adminApp = null;
      adminAuth = null;
    } else {
      try {
        const serviceAccount = JSON.parse(
          Buffer.from(base64, "base64").toString("utf-8")
        );
        adminApp = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
        adminAuth = admin.auth();
        isFirebaseAdminConfigured = true;
      } catch (parseErr: unknown) {
        console.error("Error al parsear Firebase Admin SDK:", parseErr);
        adminApp = null;
        adminAuth = null;
      }
    }
  } else {
    adminApp = admin.app();
    adminAuth = admin.auth();
    isFirebaseAdminConfigured = true;
  }
} catch (err: unknown) {
  console.error("Error inicializando Firebase Admin:", err);
  adminApp = null;
  adminAuth = null;
}

export { adminApp as admin, adminAuth, isFirebaseAdminConfigured };
