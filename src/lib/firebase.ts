import admin from "firebase-admin";
import { fbInfo } from "./config/firebase.config";

export default function initializeFirebaseAdmin() {
  admin.initializeApp({
    credential: admin.credential.cert(fbInfo as any),
  });
  return admin;
}
