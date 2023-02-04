import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
	// The value of `databaseURL` depends on the location of the database
	databaseURL: "https://test-rutas-ce7d3-default-rtdb.firebaseio.com",
};

const app = initializeApp(firebaseConfig);

const dbrt = getDatabase(app);

export { dbrt };
