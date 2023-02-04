import { addAdminServicesToServer } from "@grpc/grpc-js";
import * as admin from "firebase-admin";
import * as serviceAccount from "./key.json";

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount as any),
	databaseURL: "https://test-rutas-ce7d3-default-rtdb.firebaseio.com",
});

const firestore = admin.firestore();
const dbrt = admin.database();

export { firestore, dbrt };
